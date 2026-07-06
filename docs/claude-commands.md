# Claude shortcuts for Bar Bassie

Custom phrases the user may type. When they do, run the matching steps.

## "open site"
Open the project in the inline browser.

1. Node lives at `/opt/homebrew/bin` (not on the default shell PATH) — prepend it:
   `export PATH=/opt/homebrew/bin:$PATH`
2. Ensure deps are installed (`npm i`) if `node_modules` is missing.
3. Start the inline preview via `.claude/launch.json` config **barbassie**
   (preview_start → name `barbassie`). The config wraps the dev command in a
   zsh shell that prepends Homebrew to PATH, because the preview tool can't
   otherwise find `node`.
4. Screenshot to confirm it renders.

Dev server runs on **http://localhost:3000**.

## "publish online"
Commit everything and push to `main`.

```
git add . && git commit -m "<message>" && git push origin main
```

Use a conventional-commit message (`feat`/`fix`/`chore`/...) describing the
change. Confirm the working tree first if anything looks unexpected.
