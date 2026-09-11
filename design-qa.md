# Services and Site-Wide Update Design QA

- Source reference: Cleveland Clinic Services index, individual service page, and the user-provided navigation screenshot.
- Implementation: `https://anandhospitalmbd.org/`
- States: Services index, Services navigation menu, eight service detail routes, Doctors, About, and shared footer.
- Browser-rendered comparison: unavailable because this environment has no user-selected browser rendering surface.

## Verified implementation

- Services sections use wider spacing, three-column desktop specialty cards, 76px specialty icons, and larger facility cards with 16:10 image placeholders.
- The Services navigation item includes a dropdown indicator, eight direct service links, and a See all Services link.
- Eight individual service pages return HTTP 200, include unique metadata, canonical URLs and MedicalClinic structured data.
- All ten supplied Set 3 icons are installed and distributed across the individual service pages.
- Doctors departments reuse the same service icon mapping. Doctor order begins with Dr Subhash Singh and Dr Nidhi Thakur; Dr Rajiv Kumar is present in Paediatrics; Dr Talvar Rahul Bala Ratna is absent.
- About statistics exclude the unsupported bed and doctor claims and use viewport-triggered count-up animation.
- Tick icons were removed from rendered page content.
- Address, establishment year and copyright range were updated consistently.
- Favicon markup uses same-origin relative fallbacks and the canonical custom domain. The ICO returns HTTP 200 with `image/vnd.microsoft.icon` on both custom domains.
- Large medical imagery was converted from roughly 1.8 MB PNG files to roughly 88 KB WebP files without changing the displayed source imagery.
- Clean production build, artifact validation, rendered HTML tests and production route/content checks passed.

## Remaining visual gate

- [P1] A same-viewport browser screenshot comparison could not be performed in this environment. Desktop dropdown positioning and responsive card wrapping should receive a final visual pass in a browser.

final result: blocked

---

# Home Care Section Visual QA — 2026-08-20

- Source visual truth: the two desktop screenshots attached to the user request (not exposed as a local file path).
- Implementation: `https://anand-hospital.anandhospital.workers.dev/`
- Implementation screenshot: unavailable; this workspace exposes no browser-rendering or page-capture surface.
- Intended viewport: desktop, matching the supplied 1773 × 660 and 1807 × 872 references.
- Source pixel dimensions: 1773 × 660 and 1807 × 872 at the supplied attachment density.
- Implementation pixel dimensions, CSS size, and density normalization: unavailable because browser capture is unavailable.
- State: home page, care-feature section at rest.

## Full-view comparison evidence

- Browser-rendered comparison is blocked. Production HTML and the deployed hashed stylesheet were fetched successfully.
- The deployed stylesheet contains the requested `100svh` desktop section, the larger `1.35fr / 1fr` content split, and the waiting-area image path.
- The production waiting-area asset returns HTTP 200 and preserves its native 1448 × 1086 (4:3) source dimensions.

## Focused region comparison evidence

- Blocked because no rendered implementation screenshot can be captured in this workspace.

## Findings

- [P1] Visual fidelity cannot be signed off without a same-viewport browser capture.
  - Location: home page care section.
  - Evidence: source screenshots are visible in the conversation, but no browser-rendered implementation screenshot is available for combined comparison.
  - Impact: deployed CSS and asset delivery are verified, but crop, perceived scale, and exact spacing cannot be judged pixel-for-pixel.
  - Fix: capture the deployed section at the target desktop viewport and compare it with the supplied reference.

## Required fidelity surfaces

- Fonts and typography: existing site typography and copy were preserved; rendered fidelity remains unverified.
- Spacing and layout rhythm: desktop section is coded at `100svh`, with a 1600px maximum grid and enlarged image column; rendered fidelity remains unverified.
- Colors and visual tokens: existing section colors and controls were preserved; rendered fidelity remains unverified.
- Image quality and asset fidelity: the correct 1448 × 1086 waiting-area photo is deployed without a generated substitute; rendered crop remains unverified.
- Copy and content: existing care-section text and CTA are unchanged.

## Comparison history

- Initial implementation: changed the section from compact desktop flow to a full-viewport layout, enlarged the waiting-area image at 4:3, preserved the existing content, and kept the tablet/mobile layout rules intact.
- Post-fix visual evidence: unavailable due to the missing browser capture surface.

## Implementation checklist

- Capture the production care section at a matching desktop viewport.
- Confirm image crop, grid balance, and vertical centering against the reference.
- Address any P1/P2 mismatch found in the rendered comparison.

final result: blocked

---

# Production Content Refresh Design QA — 2026-09-11

- Source visual truth: `/mnt/c/Shishir/team-psmpv/clients/anand-hospital/assets/Images/herocorrect.png`
- Source asset: `/mnt/c/Shishir/team-psmpv/clients/anand-hospital/assets/Images/herobanner.jpg`
- Browser-rendered implementation: `qa-artifacts/home-desktop-1813x868.png`
- Combined comparison: `qa-artifacts/home-reference-comparison.png`
- Additional evidence: `qa-artifacts/appointment-desktop-1813x868.png`, `qa-artifacts/services-desktop-full.png`, `qa-artifacts/doctors-desktop-full.png`, and corresponding 390px mobile captures
- Viewports: 1813 × 868 desktop and 390 × 844 mobile
- Source and implementation pixels: 1813 × 868 at deviceScaleFactor 1; no density normalization required
- State: initial page load, doctor CTA keyboard focus, doctor-specific appointment navigation, and reduced-motion preference

## Full-view comparison evidence

- The combined comparison confirms that the implementation preserves the reference's left-aligned three-line headline, stacked appointment actions, six-person team image, blue/white palette and wide desktop composition.
- The implementation intentionally retains a darker blue image frame so the complete supplied team photograph remains visible without cropping faces.
- Desktop and mobile captures show no horizontal overflow, clipped controls or section collisions.

## Focused region evidence

- Appointment hero: the supplied six-person group photograph is sharp, centered and readable at desktop and mobile sizes.
- Facility cards: available hospital photographs render for imaging, ICU, room, reception and Ayushman facilities; corresponding SVG image assets render at a consistent blue scale for the remaining cards.
- Doctor cards: all six images load, Dr Subhash Singh's PGIMS Rohtak experience is visible, and every appointment button remains legible without wrapping.
- Mobile homepage: the headline now renders as three separate readable lines over the hero photograph.

## Findings

- No actionable P0, P1 or P2 issues remain.
- [P3] The implementation header and dark hero framing are slightly more compact than the supplied reference. This is acceptable because the full doctor group is preserved and all primary content remains above the fold.

## Required fidelity surfaces

- Fonts and typography: passed; display and body fonts preserve the existing site hierarchy, with corrected mobile headline wrapping.
- Spacing and layout rhythm: passed; desktop and mobile captures show balanced hero, card and form spacing without overflow.
- Colors and visual tokens: passed; hospital blue, light-blue and patient-care green tokens remain consistent.
- Image quality and asset fidelity: passed; supplied raster images and existing SVG assets are used directly, with no placeholders or generated substitutes.
- Copy and content: passed; requested facility and doctor wording appears in rendered output.
- Icons: passed; card icons are consistently sized and aligned.
- Accessibility: passed for labels, alt text, focus visibility, reduced motion and basic overflow checks.

## Interaction checks

- Doctor CTA navigated to `/appointment?doctor=Dr+Subhash+Singh&department=General+Surgery#appointment-form`.
- Doctor and department selects were prefilled with Dr Subhash Singh and General Surgery.
- Keyboard focus produced a visible solid outline.
- Reduced-motion mode produced `0s` link transition duration.
- All inputs, selects and textareas had accessible labels; no images lacked alt text and no empty links were found.
- Console inspection found only the expected local-preview CSP warning for the canonical production favicon; metadata now targets the `www` production origin, where the icon is same-origin.

## Comparison history

- Initial pass: P1 mobile homepage headline collapsed into unreadable text; P2 featured-doctor buttons wrapped; P2 facility SVG assets rendered oversized.
- Fixes: enforced three-line mobile hero typography, prevented appointment CTA wrapping, constrained and recolored facility SVG image assets, and corrected the canonical metadata origin.
- Post-fix evidence: all desktop/mobile screenshots were recaptured; the corrected headline, cards and icons are visible in the listed artifacts, and automated browser checks pass.

final result: passed

---

# Homepage Hero Reference Match Design QA — 2026-09-11

- Source visual truth: `/mnt/c/Shishir/team-psmpv/clients/anand-hospital/assets/Images/herocorrect.png`
- Source pixels: 1813 × 868
- Browser-rendered implementation: `qa-artifacts/home-desktop-1813x868.png`
- Combined comparison: `qa-artifacts/home-reference-comparison.png`
- Responsive evidence: `qa-artifacts/home-mobile-390x844.png`
- Implementation pixels and CSS viewport: 1813 × 868 desktop and 390 × 844 mobile at deviceScaleFactor 1; no density normalization required
- State: homepage initial load, desktop Find a Doctor hover state, and unchanged mobile hero rendering

## Full-view comparison evidence

- The combined comparison confirms the supplied right-aligned team-photo composition, clear left text area, three-line white headline, stacked CTAs, and blue-gray backdrop.
- The site header, navigation, text, buttons, downstream content, and mobile-specific hero image remain unchanged.
- Desktop and mobile captures have no horizontal overflow or clipped hero controls.

## Focused region comparison evidence

- A separate focused crop was unnecessary because the complete hero and all critical details are readable at the native 1813 × 868 comparison size.
- The desktop media measures 1486.66 × 646.41 CSS pixels, begins at x=326.34, uses the supplied 1910 × 681 image at full opacity, and has no mask or fade overlay.

## Findings

- No actionable P0, P1, or P2 mismatch remains.
- [P3] The supplied screenshot was captured with a taller existing header than the current implementation. The header was intentionally not altered because the requested scope was strictly limited to the homepage hero.

## Required fidelity surfaces

- Fonts and typography: passed; existing families, weights, line heights, hierarchy, and copy are unchanged.
- Spacing and layout rhythm: passed; the photo occupies the reference's right-aligned 82% frame and leaves the left content area clear.
- Colors and visual tokens: passed; the dark blue framing was replaced with the reference's blue-gray outer field and light image field.
- Image quality and asset fidelity: passed; the existing supplied team photograph is rendered directly at full opacity with no fade mask, generated replacement, or crop that removes a doctor.
- Copy and content: passed; all hero and site copy remains unchanged.
- Responsiveness and accessibility: passed; the desktop-only rule leaves the mobile image behavior unchanged, no overflow is present, the hero retains descriptive alt text, and both CTAs remain semantic links.

## Interaction and console checks

- The Find a Doctor CTA hover state rendered successfully.
- Both desktop and mobile pages loaded with no page exceptions.
- Console inspection found only the known local-preview CSP warning caused by the production-origin favicon URL; it does not occur when served from the same production origin.

## Comparison history

- Initial pass: P1—the image was allowed to span the full hero width, enlarging the doctors and obscuring the intended clear text field.
- Fix: restored the reference's right-aligned 82% media frame while removing the dark mask and reduced opacity.
- Second pass: P2—the flat frame color did not match the reference's distinct outer and image fields.
- Fix: sampled and applied the reference-aligned blue-gray outer field and light media field, then recaptured desktop, mobile, and combined comparison evidence.
- Post-fix evidence: `qa-artifacts/home-reference-comparison.png` and `qa-artifacts/visual-qa-results.json` show the corrected composition, full-opacity image, disabled mask, working hover state, and overflow-free desktop/mobile layouts.

final result: passed
