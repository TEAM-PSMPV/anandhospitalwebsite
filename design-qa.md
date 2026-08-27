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
