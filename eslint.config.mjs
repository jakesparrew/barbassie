import pluginNext from "@next/eslint-plugin-next"
import tseslint from "typescript-eslint"

export default [
  pluginNext.flatConfig.recommended,
  pluginNext.flatConfig.coreWebVitals,
  ...tseslint.configs.recommended,
  {
    ignores: [".next/**", "node_modules/**", "public/**", "next-env.d.ts"],
  },
]
