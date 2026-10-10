import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
const procedureSlugs = [
  'general-surgery', 'laparoscopic-surgery', 'gallbladder-surgery', 'gallstone-surgery',
  'hernia-surgery', 'appendix-surgery', 'piles-treatment', 'cancer-surgery',
  'obstetrics-gynaecology', 'high-risk-pregnancy', 'pregnancy-care', 'maternity-care',
  'pcos-treatment', 'infertility-evaluation', 'hysteroscopy', 'laparoscopic-gynaecology',
  'emergency-care', 'icu-critical-care', '24x7-emergency', 'emergency-surgery',
];
const origin = "https://www.anandhospitalmbd.org";
async function verifyProduction() {
for (const path of ["/", "/appointment", "/doctors", "/awards", "/doctors/dr-nidhi-thakur", "/doctors/dr-subhash-singh", "/services", "/gallery", "/feedback", "/sitemap", "/site-information/privacy-policy"]) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(!html.includes(String.fromCodePoint(0x2014)), `${path}: no em dashes`);
  const canonical = path === "/" ? origin : `${origin}${path}`;
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Canonical missing on ${path}`);
  if (path === "/") {
    assert.ok(!html.includes('aria-label="Breadcrumb"') && !html.includes('"@type":"BreadcrumbList"'));
    for (const profile of ["https://instagram.com/anandhospital.mbd", "https://linkedin.com/company/anand-hospital-moradabad", "https://x.com/anandhospitalmb", "https://facebook.com/profile.php?id=61595003672609", "https://www.youtube.com/@anandhospitalmbd"]) assert.ok(html.includes(profile), profile);
    assert.ok(html.includes("hero-responsive-image") && html.includes('fetchPriority="high"'));
  }
  if (path === "/appointment") {
    assert.ok(html.includes("11:00 AM–3:00 PM IST") && html.includes("OPD closed"));
    assert.ok(!/9:00 AM|6:00 PM|10:15 AM/.test(html));
  }
  if (path === "/awards") {
    assert.equal((html.match(/class="award-card"/g) ?? []).length, 21);
    assert.ok(html.includes('id="nidhi"') && html.includes('id="subhash"'));
  }
  if (path === "/doctors") assert.ok(html.includes('class="award-cascade"'));
  if (path === "/services") {
    for (const id of ["medical-services", "treatments-procedures", "diagnostics", "hospital-facilities", "patient-support"]) assert.ok(html.includes(`id="${id}"`), `Services group missing: ${id}`);
    assert.equal((html.match(/class="services-emergency"/g) ?? []).length, 1);
    assert.ok(html.includes('/icons/set-5/simple/right-arrow.svg'));
    assert.ok(html.includes('href="/services/critical-care"') && html.includes('href="/gallery#deluxe"'));
    assert.ok(!html.includes('Ayushman Card Facility Available'));
  }
  if (path === "/gallery") {
    assert.equal((html.match(/"@type":"ImageObject"/g) ?? []).length, 24);
    assert.equal((html.match(/aria-roledescription="carousel"/g) ?? []).length, 4);
    assert.ok(!html.includes("/images/awards/"));
  }
  if (path === "/feedback") assert.ok(html.includes('sent only when you choose Send'));
  assert.ok(html.includes('teampsmpv-wordmark-white.webp'), `Developer logo missing on ${path}`);
  assert.ok(!html.includes('Estb. in 2007'));
}
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
assert.ok(sitemap.includes(`<loc>${origin}/awards</loc>`));
assert.ok(sitemap.includes(`<loc>${origin}/gallery</loc>`));
for (const slug of procedureSlugs) {
  const path = `/services/${slug}`;
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), path);
  for (const marker of ['id="evaluation-team"', 'id="warning-signs"', 'id="faqs"', 'Cost / Ayushman eligibility', 'Illustrative image']) assert.ok(html.includes(marker), `${path}: ${marker}`);
  assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`), `${path}: sitemap`);
  const imagePath = html.match(/src="(\/images\/procedures\/[a-z-]+\.webp)"/)?.[1];
  assert.ok(imagePath, `${path}: hero image`);
  const image = await fetch(`${origin}${imagePath}`);
  assert.equal(image.status, 200, imagePath);
  assert.match(image.headers.get('content-type') ?? '', /image\/webp/);
  assert.ok((response.headers.get('content-security-policy') ?? '').includes('https://maps.google.com'), 'Map frame CSP');
}
const doctorImage = await fetch(`${origin}/_vinext/image?url=%2Fimages%2Fdoctors%2Fdrgarima.webp&w=120&q=75`, {headers:{accept:'image/avif,image/webp'}});
assert.equal(doctorImage.status, 200, 'Compact doctor photograph');
assert.match(doctorImage.headers.get('content-type'), /image\/(avif|webp)/);
const robots = await (await fetch(`${origin}/robots.txt`)).text();
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const missing = await fetch(`${origin}/missing-page-production-check`);
assert.equal(missing.status, 404);
assert.ok((await missing.text()).includes("We couldn’t find that page"));
const redirect = await fetch(`${origin}/our-doctors/`, { redirect: "manual" });
assert.equal(redirect.status, 301);
assert.equal(redirect.headers.get("location"), `${origin}/doctors`);
// Full clinician profiles and article-to-clinician links must survive deployment.

for (const [slug, registration] of [['dr-subhash-singh','23457'],['dr-nidhi-thakur','46181'],['dr-bhoopendra-kumar-sharma','117362'],['dr-rajeev-kumar','75493'],['dr-garima-singh','39431'],['dr-rangit-pandey','43348']]) {
  const response = await fetch(`${origin}/doctors/${slug}`);
  assert.equal(response.status, 200, slug);
  const html = await response.text();
  assert.ok(html.includes(`rel="canonical" href="${origin}/doctors/${slug}"`), slug);
  assert.ok(html.includes(registration), `${slug}: registration`);
  for (const id of ['credentials','consultation','educational-articles','reviewer-credentials','recognition-gallery']) assert.ok(html.includes(`id="${id}"`), `${slug}: ${id}`);
  const photo = html.match(/src="(\/images\/doctors\/profiles\/[a-z]+\.webp)"/)?.[1];
  assert.ok(photo, slug);
  const image = await fetch(`${origin}${photo}`);
  assert.equal(image.status, 200, photo);
  assert.match(image.headers.get('content-type') ?? '', /image\/webp/);
  if (slug === 'dr-subhash-singh' || slug === 'dr-nidhi-thakur') assert.ok(html.includes('11:00 AM–3:00 PM IST'));
}
const paediatricianRedirect = await fetch(`${origin}/doctors/dr-rajiv-kumar/`, {redirect:'manual'});
assert.equal(paediatricianRedirect.status, 301);
assert.equal(paediatricianRedirect.headers.get('location'), `${origin}/doctors/dr-rajeev-kumar`);
for (const [slug, doctor] of [['pcos','dr-nidhi-thakur'],['hernia-surgery','dr-subhash-singh']]) {
  const html = await (await fetch(`${origin}/health-library/${slug}`)).text();
  assert.ok(html.includes(`href="/doctors/${doctor}"`), slug);
}
console.log('Production full doctor profiles, registration details, schedules, portraits and clinical links passed.');

console.log("Production procedure pages, hero images, sitemap, gallery, facility slides, feedback, footer, doctor image, SEO and custom 404 checks passed.");

}

// Custom-domain edges can briefly serve the previous Worker after deployment.
// Retry the complete assertions; persistent content failures still fail the job.
for (let attempt = 1; attempt <= 6; attempt++) {
  try {
    await verifyProduction();
    break;
  } catch (error) {
    if (attempt === 6) throw error;
    console.log(`Production propagation check ${attempt}/6 failed: ${error.message}. Retrying in 10 seconds.`);
    await setTimeout(10_000);
  }
}
