// scripts/optimize-assets.mjs
// Automatically compresses oversized images (and PDFs) under public/ IN PLACE.
//
// Design goals:
//  - SAFE for automation: never renames files or changes their format, so
//    existing code references (src="/gallery/8.jpg", events.json, ...) keep
//    working. It only resizes huge dimensions and re-encodes at web quality.
//  - IDEMPOTENT: only touches files above a size threshold, and only writes
//    the result back when it is meaningfully smaller — so re-runs are no-ops
//    and quality never drifts from repeated recompression.
//
// Smart format conversions (PNG photo -> JPEG, poster PNG -> WebP) are left to
// a human/Claude because they require updating the reference in code.
//
// Requires Python-free: pure Node + `sharp` (already a dependency). PDF
// downsampling is attempted only if Ghostscript (`gs`) is installed.
import sharp from "sharp"
import { execSync } from "node:child_process"
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs"
import { join, extname } from "node:path"

const ROOT = "public"
// Only inspect files bigger than this (fast stat-based prefilter).
const SIZE_TRIGGER = 500 * 1024 // 500 KB
// Longest edge we keep for web display. Sources above this are downscaled.
const MAX_EDGE = 2000
// Only write the recompressed result if it saves at least this fraction,
// which keeps the script idempotent (no endless micro-recompression).
const MIN_GAIN = 0.1 // 10 %

sharp.cache(false)

const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp"])
const fmtKB = (b) => (b / 1024).toFixed(0) + "KB"

/** Recursively collect every file under a directory. */
function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else out.push({ path: p, size: s.size })
  }
  return out
}

async function optimizeImage(path, size) {
  const ext = extname(path).toLowerCase()
  const img = sharp(path).rotate() // respect EXIF orientation
  const meta = await img.metadata()
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0)
  let pipeline = img
  if (longEdge > MAX_EDGE) {
    pipeline = pipeline.resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
  }
  // Re-encode in the SAME format so the filename/extension is preserved.
  if (ext === ".png") pipeline = pipeline.png({ compressionLevel: 9, palette: true })
  else if (ext === ".webp") pipeline = pipeline.webp({ quality: 82 })
  else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true })

  const buf = await pipeline.toBuffer()
  if (buf.length < size * (1 - MIN_GAIN)) {
    writeFileSync(path, buf)
    return buf.length
  }
  return null // no meaningful gain — leave the original untouched
}

let gsAvailable = false
try {
  execSync("command -v gs", { stdio: "ignore" })
  gsAvailable = true
} catch {
  /* Ghostscript not installed — PDFs are skipped. */
}

function optimizePdf(path, size) {
  if (!gsAvailable) return null
  const tmp = path + ".opt.pdf"
  try {
    execSync(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook ` +
        `-dNOPAUSE -dBATCH -dQUIET -sOutputFile="${tmp}" "${path}"`,
      { stdio: "ignore" },
    )
    const optimized = readFileSync(tmp)
    if (optimized.length < size * (1 - MIN_GAIN)) {
      writeFileSync(path, optimized)
      execSync(`rm -f "${tmp}"`)
      return optimized.length
    }
    execSync(`rm -f "${tmp}"`)
  } catch {
    execSync(`rm -f "${tmp}"`, { stdio: "ignore" })
  }
  return null
}

const files = walk(ROOT).filter((f) => f.size > SIZE_TRIGGER)
let saved = 0
let touched = 0
for (const { path, size } of files) {
  const ext = extname(path).toLowerCase()
  let newSize = null
  if (RASTER.has(ext)) newSize = await optimizeImage(path, size)
  else if (ext === ".pdf") newSize = optimizePdf(path, size)
  if (newSize != null) {
    console.log(`optimized ${path}  ${fmtKB(size)} -> ${fmtKB(newSize)}`)
    saved += size - newSize
    touched++
  }
}
console.log(
  touched ? `\n${touched} file(s) optimized, saved ${fmtKB(saved)}.` : "All assets already optimized.",
)
