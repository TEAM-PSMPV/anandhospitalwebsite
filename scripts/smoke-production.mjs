import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
const origin = "https://www.anandhospitalmbd.org";
async function verifyProduction() {
for (const path of ["/", "/doctors", "/awards", "/doctors/dr-nidhi-thakur", "/doctors/dr-subhash-singh", "/services", "/gallery", "/feedback", "/sitemap", "/site-information/privacy-policy"]) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const canonical = path === "/" ? origin : `${origin}${path}`;
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Canonical missing on ${path}`);
  if (path === "/awards") {
    assert.equal((html.match(/class="award-card"/g) ?? []).length, 21);
    assert.ok(html.includes('id="nidhi"') && html.includes('id="subhash"'));
  }
  if (path === "/doctors") assert.ok(html.includes('class="award-cascade"'));
  if (path === "/services") assert.ok(html.includes('aria-label="Next ICU photograph"') && html.includes('aria-label="Next deluxe room photograph"'));
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
console.log("Production gallery, facility slides, feedback, footer, doctor image, SEO and custom 404 checks passed.");

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
