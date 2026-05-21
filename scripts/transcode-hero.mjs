// scripts/transcode-hero.mjs
// Transcodes assets/hero/source.mp4 into delivery formats in public/hero/.
// Requires ffmpeg on PATH.
import { execSync } from "node:child_process"
import { existsSync } from "node:fs"

const SRC = "assets/hero/source.mp4"
const OUT = "public/hero"

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC}. Drop the source MP4 there and re-run.`)
  process.exit(1)
}

try {
  execSync("ffmpeg -version", { stdio: "ignore" })
} catch {
  console.error("ffmpeg not found on PATH. Install ffmpeg first.")
  process.exit(1)
}

const passes = [
  // 1080p WebM (VP9) — smallest modern format, browser tries this first
  { out: `${OUT}/hero-1080.webm`, args: '-vf "scale=-2:1080" -c:v libvpx-vp9 -b:v 0 -crf 34 -an' },
  // 1080p MP4 (H.264) — fallback for Safari + older browsers, no audio
  { out: `${OUT}/hero-1080.mp4`,  args: '-vf "scale=-2:1080" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart' },
  // Poster JPG (frame 1)
  { out: `${OUT}/hero-poster.jpg`, args: '-vf "select=eq(n\\,0),scale=-2:1080" -frames:v 1 -q:v 4' },
]

for (const p of passes) {
  console.log(`-> ${p.out}`)
  execSync(`ffmpeg -y -i "${SRC}" ${p.args} "${p.out}"`, { stdio: "inherit" })
}
console.log("Hero transcoding complete.")
