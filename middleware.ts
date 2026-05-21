// middleware.ts
import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./lib/i18n"

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
})

// Use Node.js runtime instead of Edge: Next 15.5.x bundles its compiled
// ua-parser-js (used by req.ua) into the middleware function, and that file
// references __dirname which doesn't exist in the Edge V8 isolate. Node
// runtime has __dirname and accepts the same middleware API.
// Requires `experimental.nodeMiddleware: true` in next.config.
export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
