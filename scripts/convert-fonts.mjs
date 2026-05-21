// scripts/convert-fonts.mjs
// Converts every .otf and .ttf in src/assets/fonts/ to WOFF2 in public/fonts/.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises"
import { join, basename, extname } from "node:path"
import wawoff2 from "wawoff2"

const SRC = "src/assets/fonts"
const OUT = "public/fonts"

const files = (await readdir(SRC)).filter((f) => /\.(otf|ttf)$/i.test(f))
if (files.length === 0) {
  console.error(`No .otf/.ttf files in ${SRC}. Drop the original brand fonts there and re-run.`)
  process.exit(1)
}

await mkdir(OUT, { recursive: true })

for (const file of files) {
  const inputPath = join(SRC, file)
  const buf = await readFile(inputPath)
  const woff2 = Buffer.from(await wawoff2.compress(buf))
  const outName = basename(file, extname(file)) + ".woff2"
  const outputPath = join(OUT, outName)
  await writeFile(outputPath, woff2)
  console.log(`${inputPath} -> ${outputPath} (${woff2.length} bytes)`)
}
console.log(`Converted ${files.length} font file(s).`)
