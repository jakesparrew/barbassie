// scripts/extract-menu-panels.mjs
// Crops the drinks (3-fold, 2 pages) and food (2-fold, 1 page) PDFs into panel JPGs.
// Requires Python 3 with `pymupdf`. No Pillow needed — uses pix.tobytes("jpeg") directly.
import { execSync } from "node:child_process"
import { writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const PY = `
import fitz, os
def crop(pdf_path, out_dir, layout):
    doc = fitz.open(pdf_path)
    os.makedirs(out_dir, exist_ok=True)
    counter = 1
    for page_index, panels in enumerate(layout):
        page = doc[page_index]
        w, h = page.rect.width, page.rect.height
        for px in range(panels):
            x0 = w * px / panels
            x1 = w * (px + 1) / panels
            clip = fitz.Rect(x0, 0, x1, h)
            pix = page.get_pixmap(clip=clip, dpi=200)
            data = pix.tobytes("jpeg", jpg_quality=88)
            out = os.path.join(out_dir, f"panel-{counter}.jpg")
            with open(out, "wb") as f:
                f.write(data)
            print(out, len(data), "bytes")
            counter += 1
    doc.close()

crop("public/menu/bar-bassie-drinks.pdf", "public/menu/drinks", [3, 3])
crop("public/menu/bar-bassie-food.pdf",   "public/menu/food",   [2])
`

const scriptPath = join(tmpdir(), "extract-menu-panels.py")
writeFileSync(scriptPath, PY)
execSync(`python "${scriptPath}"`, { stdio: "inherit" })
