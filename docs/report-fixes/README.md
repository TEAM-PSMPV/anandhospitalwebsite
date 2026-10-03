# Desktop and mobile report fixes — 3 October 2026

Reviewed the supplied `3_10_26_Desk.pdf` and `3_10_26_Mob_org.pdf`. Their Lighthouse scores were desktop performance 97 and accessibility 92, and mobile performance 74 and accessibility 92. The reports are diagnostic evidence; the owner's request to preserve the website's styling governs the changes.

## Changes

- Removed the homepage breadcrumb and its BreadcrumbList schema. Interior pages retain their trail below the introduction.
- Replaced social search links with the supplied official Instagram, LinkedIn, Facebook and X profiles. X replaces the generic YouTube search link. Icons use direct vector SVGs at 32px with 44px clickable areas.
- Reduced shared service section padding, grid margins, fixed card heights and navigation-menu spacing. General Surgery is approximately 720px shorter on a 1440px desktop, without deleting content.
- Kept the original hero artwork, cropping, responsive breakpoints, text and buttons. One responsive AVIF/WebP picture selects the correct desktop or mobile photo, with matching media-specific preloads and high priority. This avoids downloading both hidden hero images.
- Created compressed variants of the supplied reception and waiting-area photographs. CSS uses AVIF with WebP fallback and smaller assets for mobile screens; desktop waiting-area backgrounds support different display densities.
- Set the footer logo's actual image size to 108px so its responsive source does not default to a 640px download.
- Kept the same Montserrat fonts and weights, directly served WOFF2 with critical preloads, and converted/subset Times Sans Serif to WOFF2. The subset retains Latin, Latin Extended, punctuation, currency, letterlike symbols and arrows used by the website.
- Loaded the chatbot JavaScript and panel CSS only after interaction. Its existing launcher, panel styling and behavior remain intact.
- Darkened only the reported low-contrast Get Help button to the existing brand blue and enlarged pathway and footer phone tap targets.

Original source photographs and the complete supplied gallery remain intact. Image generation was not needed. The optimized assets were created with Pillow (AVIF quality 55; WebP quality 82) and FontTools; no runtime dependencies were added. Montserrat's license is included with the copied fonts.

## Verification

- `npm run lint`: no errors or warnings.
- `npm test`: all 14 rendered HTML, API, image service, redirect, security and SEO tests passed.
- `git diff --check`: passed.
- Browser checks at 1440×900, 390×844 and 820×1180: one correct hero photo requested per viewport; chatbot code and CSS absent initially and successfully loaded on opening; opening/closing works; all eight service routes return 200 with interior breadcrumbs and no horizontal overflow; no JavaScript errors.
- Desktop/mobile computed-style comparisons across home, services, surgery, emergency, gallery, health article, appointment, doctors and privacy: typography, text colors and backgrounds unchanged except the intentional Get Help contrast correction. Spacing and tap targets change as requested.
- Local Lighthouse accessibility improves from 92 to 100. Local performance scores vary with execution/network conditions; they are not substitutes for the attached PageSpeed Insights results. Production verification follows deployment.

Screenshots: [Desktop home](desktop-home.png), [Mobile home](mobile-home.png), [Desktop surgery](desktop-general-surgery.png), [Mobile surgery](mobile-general-surgery.png), [Desktop social icons](desktop-social.png), [Mobile social icons](mobile-social.png).

## Report items with remaining costs

The canonical apex-to-www redirect remains a single 301 so search engines receive one preferred URL. Cloudflare controls the injected analytics beacon's one-day cache lifetime and legacy JavaScript; application code cannot change those headers or polyfills. React/framework code and shared styling still have route-dependent unused portions. The chatbot's JavaScript and CSS were separated to reduce the initial cost while preserving functionality. Existing compression, security headers, SEO metadata and canonical behavior remain covered by tests.
