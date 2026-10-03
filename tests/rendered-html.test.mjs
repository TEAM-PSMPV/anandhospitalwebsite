import assert from "node:assert/strict";
import test from "node:test";

test("appointment intake validates, forwards once with a stable ID, and handles failures", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));
  const env = { APPOINTFLOW_URL: "https://appointflow.example", APPOINTFLOW_API_KEY: "test-server-secret" };
  const payload = { externalId: "website-12345678-1234-1234-1234-123456789abc", name: "Test Patient", phone: "9876543210", doctor: "Dr Subhash Singh", department: "General Surgery", date: "2026-10-01", address: "Test address", message: "Morning preferred" };
  const request = (body = payload, origin = "https://www.anandhospitalmbd.org") => new Request("https://www.anandhospitalmbd.org/api/appointments", {
    method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body),
  });
  const originalFetch = globalThis.fetch;
  const calls = [];
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url.href, "https://appointflow.example/api/intake");
      assert.equal(options.headers.authorization, "Bearer test-server-secret");
      assert.equal(options.redirect, "manual");
      const forwarded = JSON.parse(options.body);
      assert.equal(forwarded.patientName, payload.name);
      assert.equal(forwarded.phone, "+919876543210");
      assert.equal(forwarded.address, payload.address);
      assert.equal(forwarded.source, "website");
      assert.match(forwarded.message, /Dr Subhash Singh/);
      assert.match(forwarded.message, /General Surgery/);
      assert.match(forwarded.message, /2026-10-01/);
      assert.match(forwarded.message, /Morning preferred/);
      calls.push(forwarded.externalId);
      return Response.json({ request: { id: "req_test", status: "new" } }, { status: 202 });
    };
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await worker.fetch(request(), env, {});
      assert.equal(response.status, 202);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.deepEqual(await response.json(), { received: true });
    }
    assert.deepEqual(calls, [payload.externalId, payload.externalId]);
    assert.equal((await worker.fetch(request({ ...payload, phone: "bad" }), env, {})).status, 422);
    assert.equal((await worker.fetch(request({ ...payload, date: "2026-02-30" }), env, {})).status, 422);
    assert.equal((await worker.fetch(request({ ...payload, name: " " }), env, {})).status, 422);
    assert.equal((await worker.fetch(request(payload, "https://another.example"), env, {})).status, 403);
    assert.equal((await worker.fetch(request(), {}, {})).status, 503);
    assert.equal((await worker.fetch(new Request("https://www.anandhospitalmbd.org/api/appointments"), env, {})).status, 405);
    assert.equal(calls.length, 2);
    globalThis.fetch = async () => Response.json({ error: "sensitive upstream details" }, { status: 401 });
    const rejected = await worker.fetch(request(), env, {});
    assert.equal(rejected.status, 502);
    assert.equal((await rejected.clone().json()).code, "APPOINTFLOW_HTTP_401");
    assert.doesNotMatch(await rejected.text(), /sensitive|test-server-secret/);
    globalThis.fetch = async () => new Response("error code: 1042", { status: 403 });
    const blocked = await worker.fetch(request(), env, {});
    assert.equal((await blocked.json()).code, "APPOINTFLOW_HTTP_403_CF_1042");
    globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: "https://another.example" } });
    const redirected = await worker.fetch(request(), env, {});
    assert.equal(redirected.status, 502);
    assert.equal((await redirected.json()).code, "APPOINTFLOW_HTTP_302");
    globalThis.fetch = async () => Response.json({ request: null }, { status: 202 });
    assert.equal((await worker.fetch(request(), env, {})).status, 502);
    globalThis.fetch = async () => { throw new Error("Network timeout"); };
    assert.equal((await worker.fetch(request(), env, {})).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

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
  assert.match(appointmentHtml, /\/images\/group-photo\.webp/);
  assert.match(appointmentHtml, /<label>Doctor<select/);
  assert.match(appointmentHtml, /<label>Department<select/);
  assert.match(prefilledAppointmentHtml, /<option value="Dr Subhash Singh" selected="">/);
  assert.match(prefilledAppointmentHtml, /<option value="General Surgery" selected="">/);

  assert.equal(servicesResponse.status, 200);
  assert.match(servicesHtml, /Critical Care High Tech ICU/);
  assert.doesNotMatch(servicesHtml, />Blood Bank</);
  assert.match(servicesHtml, /\/images\/facilities\/imaging-services\.webp/);
  assert.match(servicesHtml, /href="\/gallery#icu"/);
  assert.match(servicesHtml, /\/images\/facilities\/health-checkups-ot\.webp/);
  assert.match(servicesHtml, /href="\/gallery#deluxe"/);
  assert.match(servicesHtml, /\/images\/facilities\/home-care\.webp/);
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

test("awards gallery renders all distinct recognitions, segregated recipients, photographic views and metadata", async () => {
  const response = await fetchPath("/awards");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /rel="canonical" href="https:\/\/www\.anandhospitalmbd\.org\/awards"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /id="nidhi"/);
  assert.match(html, /id="subhash"/);
  assert.match(html, /id="other"/);
  assert.equal((html.match(/class="award-card"/g) ?? []).length, 21);
  assert.equal((html.match(/type="image\/avif"/g) ?? []).length, 23); // 21 award covers plus two footer logos.
  assert.equal((html.match(/class="award-views"/g) ?? []).length, 21);
  assert.equal((html.match(/class="award-card-photo"/g) ?? []).length, 21);
  assert.match(html, /Certificate Course in Hysteroscopy/);
  assert.match(html, /Fellowship in GI Endoscopy/);
  assert.match(html, /These photographs do not identify a recipient/);
  assert.match(html, /width="\d+" height="\d+"[^>]*loading="lazy"/);
  const doctors = await (await fetchPath("/doctors")).text();
  assert.match(doctors, /class="award-cascade"/);
  assert.match(doctors, /aria-label="Next award"/);
  assert.match(doctors, /href="\/awards"/);
  const sitemap = await (await fetchPath("/sitemap.xml")).text();
  assert.match(sitemap, /<loc>https:\/\/www\.anandhospitalmbd\.org\/awards<\/loc>/);
});

test("all sitemap pages serve self-canonical, social metadata and indexable HTML", async () => {
  const sitemap = await (await fetchPath("/sitemap.xml")).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(urls.length, new Set(urls).size);
  for (const url of urls) {
    const response = await fetchPath(new URL(url).pathname);
    assert.equal(response.status, 200, url);
    const html = await response.text();
    assert.ok(html.includes(`rel="canonical" href="${url}"`), url);
    assert.match(html, /property="og:title"/, url);
    assert.match(html, /name="twitter:card"/, url);
    assert.match(html, /<h1[ >]/, url);
    if (new URL(url).pathname === "/") {
      assert.doesNotMatch(html, /aria-label="Breadcrumb"|"@type":"BreadcrumbList"/);
      for (const profile of ["https://instagram.com/anandhospital.mbd", "https://linkedin.com/company/anand-hospital-moradabad", "https://x.com/anandhospitalmb", "https://facebook.com/profile.php?id=61595003672609"]) assert.ok(html.includes(profile), profile);
      assert.match(html, /<picture>.*hero-mobile-360\.avif/s);
    } else {
      assert.match(html, /"@type":"BreadcrumbList"/, url);
      assert.ok(html.indexOf('<h1') < html.indexOf('aria-label="Breadcrumb"'), `Breadcrumb must follow the page introduction: ${url}`);
    }
  }
});

test("legacy paths, trailing slashes and HTTP apex normalize in a single 301", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));
  for (const path of ["/our-doctors/", "/our-doctors.html", "/doctors.html", "/doctors/"]) {
    const response = await worker.fetch(new Request(`http://anandhospitalmbd.org${path}?source=legacy`), {}, {});
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), "https://www.anandhospitalmbd.org/doctors?source=legacy");
  }
  const awards = await worker.fetch(new Request("https://www.anandhospitalmbd.org/awards-and-felicitations/"), {}, {});
  assert.equal(awards.status, 301);
  assert.equal(awards.headers.get("location"), "https://www.anandhospitalmbd.org/awards");
});

test("Core Web Vitals endpoint accepts finite metrics and rejects invalid events", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));
  const request = (body) => new Request("http://localhost/api/web-vitals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  assert.equal((await worker.fetch(request({ name: "LCP", value: 1250, path: "/awards" }), {}, {})).status, 204);
  assert.equal((await worker.fetch(request({ name: "invalid", value: 1 }), {}, {})).status, 400);
  assert.equal((await worker.fetch(new Request("http://localhost/api/web-vitals"), {}, {})).status, 405);
});

test("gallery, patient policies, feedback and complete HTML sitemap render without JavaScript", async () => {
  const gallery = await (await fetchPath('/gallery')).text();
  assert.equal((gallery.match(/"@type":"ImageObject"/g) ?? []).length, 24);
  assert.equal((gallery.match(/aria-roledescription="carousel"/g) ?? []).length, 4);
  assert.doesNotMatch(gallery, /images\/awards\//);
  for (const group of ['icu', 'deluxe', 'facilities', 'team']) assert.ok(gallery.includes(`id="${group}"`));
  assert.doesNotMatch(gallery, /id="awards"/);
  assert.match(gallery, /"@type":"ImageObject"/);
  assert.match(gallery, /type="image\/avif"/);
  const services = await (await fetchPath('/services')).text();
  assert.match(services, /aria-label="Next ICU photograph"/);
  assert.match(services, /aria-label="Next deluxe room photograph"/);
  assert.doesNotMatch(services, /Estb\. in 2007/);
  assert.match(services, /href="https:\/\/www\.teampsmpv\.com\/"/);
  assert.match(services, /teampsmpv-monogram-white\.webp/);
  assert.match(services, /teampsmpv-wordmark-white\.webp/);
  const feedback = await (await fetchPath('/feedback')).text();
  for (const field of ['name', 'email', 'message']) assert.ok(feedback.includes(`name="${field}"`));
  assert.doesNotMatch(feedback, /name="phone"/);
  assert.match(feedback, /sent only when you choose Send/);
  const htmlSitemap = await (await fetchPath('/sitemap')).text();
  const xmlSitemap = await (await fetchPath('/sitemap.xml')).text();
  for (const [,url] of xmlSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) assert.ok(htmlSitemap.includes(`href="${new URL(url).pathname}"`), url);
  const missingPolicy = await fetchPath('/site-information/nonexistent-policy');
  assert.equal(missingPolicy.status, 404);
});

test("doctor image service accepts the requested 120px width and still rejects invalid widths", async () => {
  const { default: worker } = await import(new URL('../dist/server/index.js', import.meta.url));
  let transformedWidth;
  const env = {
    ASSETS: { fetch: async () => new Response(new Uint8Array([1,2,3]), {headers:{'content-type':'image/webp'}}) },
    IMAGES: { input: () => ({ transform: ({width}) => { transformedWidth = width; return { output: async () => ({response: () => new Response(new Uint8Array([1]), {headers:{'content-type':'image/avif'}})}) }; } }) },
  };
  const response = await worker.fetch(new Request('http://localhost/_vinext/image?url=%2Fimages%2Fdoctors%2Fdrgarima.webp&w=120&q=75', {headers:{accept:'image/avif,image/webp'}}), env, {});
  assert.equal(response.status, 200);
  assert.equal(transformedWidth, 120);
  assert.equal(response.headers.get('content-type'), 'image/avif');
  const invalid = await worker.fetch(new Request('http://localhost/_vinext/image?url=%2Fimages%2Fdoctors%2Fdrgarima.webp&w=117&q=75'), env, {});
  assert.equal(invalid.status, 400);
});
