import assert from "node:assert/strict";
const origin = "https://www.anandhospitalmbd.org";
for (const path of ["/", "/doctors", "/awards", "/doctors/dr-nidhi-thakur", "/doctors/dr-subhash-singh"]) {
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
}
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
assert.ok(sitemap.includes(`<loc>${origin}/awards</loc>`));
const robots = await (await fetch(`${origin}/robots.txt`)).text();
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const missing = await fetch(`${origin}/missing-page-production-check`);
assert.equal(missing.status, 404);
assert.ok((await missing.text()).includes("We couldn’t find that page"));
const redirect = await fetch(`${origin}/our-doctors/`, { redirect: "manual" });
assert.equal(redirect.status, 301);
assert.equal(redirect.headers.get("location"), `${origin}/doctors`);
console.log("Production awards, canonicals, sitemap, robots, redirect and custom 404 checks passed.");
