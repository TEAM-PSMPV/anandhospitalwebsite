# Procedure page content and imagery

Updated 5 October 2026. Twenty patient-facing service guides are defined in
`app/procedure-data.ts` and rendered by `app/procedure-page.tsx` using the existing
site shell, service hero, hospital palette and booking flow. Existing clinical
profiles supply doctor names and roles. Selected guides adapt the existing
health-library material with additional preparation, admission and recovery
information. The resources linked on each page support general patient education;
no clinical-review attribution or fixed prices, stays or outcomes are claimed.

The service directory and HTML sitemap group all guides. `app/sitemap.ts` includes
17 additional routes alongside the three existing department routes without
duplicates. The Worker generates `/sitemap.xml` from this same list. The existing
Worker normalises trailing slashes to its canonical routes.

## Unsplash assets

Images are illustrative stock photographs, not photographs of Anand Hospital,
its clinicians or patients. They are credited beside the hero and stored locally
as 1200 × 900 WebP crops, served without a runtime dependency on Unsplash.

| Local file | Photographer | Original photo | CDN original |
| --- | --- | --- | --- |
| surgical-team.webp | National Cancer Institute | https://unsplash.com/photos/KrsoedfRAf4 | https://images.unsplash.com/photo-1579684453423-f84349ef60b0 |
| womens-consultation.webp | National Cancer Institute | https://unsplash.com/photos/tl447mekwuQ | https://images.unsplash.com/photo-1631217868264-e5b90bb7e133 |
| pregnancy-care.webp | Suhyeon Choi | https://unsplash.com/photos/NIZeg731LxM | https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22 |
| emergency-monitoring.webp | Maxim Tolchinskiy | https://unsplash.com/photos/HoneMAhhCXI | https://images.unsplash.com/photo-1624004015322-a94d3a4eff39 |

Sources were downloaded with `w=1200&h=900&fit=crop&q=75&fm=webp`
(surgical and pregnancy photos use quality 78). The source pages identify free
Unsplash photography: https://unsplash.com/license.

Maps load lazily from maps.google.com, with its www.google.com redirect, both allowed specifically in the
Worker's frame-src policy. A directions link remains available alongside the map.
