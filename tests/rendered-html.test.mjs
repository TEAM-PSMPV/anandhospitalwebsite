import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function fetchPath(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders development preview metadata", async () => {
  const response = await fetchPath();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders Anand Hospital identity and supplied clinical details", async () => {
  const response = await fetchPath("/doctors");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Anand Hospital/);
  assert.match(html, /Dr Subhash Singh/);
  assert.match(html, /Former Lecturer, PGIMS Rohtak/);
  assert.match(html, /Dr Nidhi Thakur/);
  assert.match(html, /Dr Bhoopendra Kumar Sharma/);
  assert.match(html, /20\+ years in high-risk obstetrics/);
  assert.match(html, /MCh \(Urology\)/);
  assert.doesNotMatch(html, /Dr Mohammad Fareed/);
  assert.match(html, /Dr Rajiv Kumar/);
  assert.doesNotMatch(html, /Talvar Rahul Bala Ratna/);
  assert.match(html, /Near Miglani Cinema/);
  assert.match(html, /Open 24 hours/);
  assert.match(html, /appointment\?doctor=Dr\+Subhash\+Singh&amp;department=General\+Surgery#appointment-form/);
});

test("renders the requested appointment and facility content", async () => {
  const [appointmentResponse, prefilledAppointmentResponse, servicesResponse] = await Promise.all([
    fetchPath("/appointment"),
    fetchPath("/appointment?doctor=Dr%20Subhash%20Singh&department=General%20Surgery"),
    fetchPath("/services"),
  ]);
  const appointmentHtml = await appointmentResponse.text();
  const prefilledAppointmentHtml = await prefilledAppointmentResponse.text();
  const servicesHtml = await servicesResponse.text();

  assert.equal(appointmentResponse.status, 200);
  assert.match(appointmentHtml, /\/images\/group-photo\.png/);
  assert.match(appointmentHtml, /<label>Doctor<select/);
  assert.match(appointmentHtml, /<label>Department<select/);
  assert.match(prefilledAppointmentHtml, /<option value="Dr Subhash Singh" selected="">/);
  assert.match(prefilledAppointmentHtml, /<option value="General Surgery" selected="">/);

  assert.equal(servicesResponse.status, 200);
  assert.match(servicesHtml, /Critical Care High Tech ICU/);
  assert.doesNotMatch(servicesHtml, />Blood Bank</);
  assert.match(servicesHtml, /\/images\/facilities\/imaging-services\.png/);
  assert.match(servicesHtml, /\/images\/facilities\/critical-care-icu\.png/);
  assert.match(servicesHtml, /\/images\/facilities\/health-checkups-ot\.png/);
  assert.match(servicesHtml, /\/images\/facilities\/deluxe-room\.png/);
  assert.match(servicesHtml, /\/images\/facilities\/home-care\.png/);
  assert.doesNotMatch(servicesHtml, /class="cta-photo"/);
});

test("renders complete Health Library procedure guides", async () => {
  const slugs = [
    "gallbladder-stone-surgery",
    "laparoscopic-cholecystectomy",
    "hernia-surgery",
    "appendix-surgery",
    "piles-fissure-fistula-treatment",
    "breast-cancer-surgery",
    "hysterectomy",
    "ovarian-cyst-treatment",
    "pcos-treatment",
    "high-risk-pregnancy-care",
    "normal-delivery",
    "caesarean-delivery",
    "infertility-evaluation",
    "hysteroscopy",
  ];

  const responses = await Promise.all(slugs.map((slug) => fetchPath(`/health-library/${slug}`)));
  const pages = await Promise.all(responses.map((response) => response.text()));

  responses.forEach((response) => assert.equal(response.status, 200));
  pages.forEach((html, index) => {
    assert.match(html, new RegExp(`/images/health-library/${slugs[index]}\\.webp`));
    assert.match(html, /Treating doctor/);
    assert.match(html, /Hospital facilities/);
    assert.match(html, /Frequently asked questions/);
    assert.match(html, /When Should You Consult a Doctor/);
    assert.match(html, /Book an Appointment/);
    assert.match(html, /Call \+91 73510 28221/);
    assert.match(html, /Medical information sources/);
  });
});

test("renders indexable SEO metadata, doctor profiles, sitemap, breadcrumbs, redirects and custom 404", async () => {
  const [homeResponse, doctorResponse, sitemapResponse, robotsResponse, missingResponse] = await Promise.all([
    fetchPath("/"),
    fetchPath("/doctors/dr-subhash-singh"),
    fetchPath("/sitemap.xml"),
    fetchPath("/robots.txt"),
    fetchPath("/missing-patient-page"),
  ]);
  const home = await homeResponse.text();
  const doctor = await doctorResponse.text();
  const sitemap = await sitemapResponse.text();
  const robots = await robotsResponse.text();
  const missing = await missingResponse.text();

  assert.match(home, /<title>Anand Hospital Moradabad \| Surgery, Gynaecology &amp; 24×7 Care<\/title>/);
  assert.match(home, /rel="canonical" href="https:\/\/www\.anandhospitalmbd\.org"/);
  assert.match(home, /property="og:title"/);
  assert.match(home, /name="twitter:card"/);
  assert.match(home, /"@type":"Hospital"/);

  assert.equal(doctorResponse.status, 200);
  assert.match(doctor, /Dr Subhash Singh \| Laparoscopic Surgeon in Moradabad/);
  assert.match(doctor, /laparoscopic surgeon near Rampur Road/);
  assert.match(doctor, /"@type":"Physician"/);
  assert.match(doctor, /"@type":"BreadcrumbList"/);

  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /application\/xml/);
  assert.match(sitemap, /health-library\/gallbladder-stone-surgery/);
  assert.match(sitemap, /doctors\/dr-nidhi-thakur/);
  assert.match(robots, /Sitemap: https:\/\/www\.anandhospitalmbd\.org\/sitemap\.xml/);

  assert.equal(missingResponse.status, 404);
  assert.match(missing, /We couldn’t find that page/);
  assert.match(missing, /<title>Page Not Found \| Anand Hospital<\/title>/);
  assert.match(missing, /<meta name="robots" content="noindex, follow"\/>/);
  assert.doesNotMatch(missing, /rel="canonical"/);

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("redirect-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const redirect = await worker.fetch(new Request("http://localhost/our-doctors?source=old"), {}, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get("location"), "https://www.anandhospitalmbd.org/doctors?source=old");
});

test("adds the public-site security baseline", async () => {
  const response = await fetchPath();

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  const contentSecurityPolicy = response.headers.get("content-security-policy") ?? "";
  assert.match(contentSecurityPolicy, /frame-ancestors 'none'/);
  assert.match(contentSecurityPolicy, /script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
  assert.match(contentSecurityPolicy, /connect-src[^;]*https:\/\/cloudflareinsights\.com/);
});

test("answers chatbot questions through the grounded Llama endpoint", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("chat-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  let invocation;

  const response = await worker.fetch(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Doctors ke baare mein bataiye", history: [] }),
    }),
    {
      AI: {
        run: async (model, input) => {
          invocation = { model, input };
          return { response: "Anand Hospital mein chhe listed doctors hain." };
        },
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { answer: "Anand Hospital mein chhe listed doctors hain." });
  assert.equal(invocation.model, "@cf/meta/llama-3.1-8b-instruct-fp8");
  assert.match(invocation.input.messages[0].content, /Use ONLY the ANAND HOSPITAL WEBSITE KNOWLEDGE/);
});
