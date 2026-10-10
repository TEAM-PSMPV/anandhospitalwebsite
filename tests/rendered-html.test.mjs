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
  assert.match(html, /Dr Rajeev Kumar/);
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
  assert.match(servicesHtml, /ICU Facility/);
  assert.doesNotMatch(servicesHtml, />Blood Bank</);
  assert.match(servicesHtml, /\/images\/facilities\/imaging-services\.webp/);
  assert.match(servicesHtml, /href="\/services\/critical-care"/);
  assert.match(servicesHtml, /id="patient-support"/);
  assert.match(servicesHtml, /href="\/gallery#deluxe"/);
  assert.doesNotMatch(servicesHtml, /\/images\/facilities\/home-care\.webp/);
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
  assert.match(doctor, /"@type":"Person"/);
  assert.match(doctor, /"hasCredential"/);
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
          return { response: "Anand Hospital mein chhe listed doctors hain." + String.fromCodePoint(0x2014) + "Reception se confirm karein." };
        },
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { answer: "Anand Hospital mein chhe listed doctors hain.–Reception se confirm karein." });
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
    assert.doesNotMatch(html, /\u2014|&mdash;|&#8212;|&#x2014;/i, `${url}: no em dashes`);
    assert.ok(html.includes(`rel="canonical" href="${url}"`), url);
    assert.match(html, /property="og:title"/, url);
    assert.match(html, /name="twitter:card"/, url);
    assert.match(html, /<h1[ >]/, url);
    if (new URL(url).pathname === "/") {
      assert.doesNotMatch(html, /aria-label="Breadcrumb"|"@type":"BreadcrumbList"/);
      for (const profile of ["https://instagram.com/anandhospital.mbd", "https://linkedin.com/company/anand-hospital-moradabad", "https://x.com/anandhospitalmb", "https://facebook.com/profile.php?id=61595003672609", "https://www.youtube.com/@anandhospitalmbd"]) assert.ok(html.includes(profile), profile);
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
  assert.match(services, /id="hospital-facilities"/);
  assert.match(services, /id="diagnostics"/);
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

const procedureSlugs = [
  'general-surgery', 'laparoscopic-surgery', 'gallbladder-surgery', 'gallstone-surgery',
  'hernia-surgery', 'appendix-surgery', 'piles-treatment', 'cancer-surgery',
  'obstetrics-gynaecology', 'high-risk-pregnancy', 'pregnancy-care', 'maternity-care',
  'pcos-treatment', 'infertility-evaluation', 'hysteroscopy', 'laparoscopic-gynaecology',
  'emergency-care', 'icu-critical-care', '24x7-emergency', 'emergency-surgery',
];

test('all procedure pages render complete care guides and appear in both sitemaps', async () => {
  const xmlResponse = await fetchPath('/sitemap.xml');
  const xml = await xmlResponse.text();
  const htmlSitemap = await (await fetchPath('/sitemap')).text();
  const directory = await (await fetchPath('/services')).text();
  assert.equal(xmlResponse.status, 200);
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.equal(new Set(urls).size, urls.length, 'sitemap must not contain duplicate URLs');
  for (const slug of procedureSlugs) {
    const path = `/services/${slug}`;
    const response = await fetchPath(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<h1[^>]*>[^<]*Moradabad/, path);
    assert.match(html, /id="evaluation-team"/, path);
    assert.match(html, /id="warning-signs"/, path);
    assert.match(html, /Cost \/ Ayushman eligibility/, path);
    assert.match(html, /Frequently asked questions/, path);
    assert.match(html, /href="\/appointment"/, path);
    assert.match(html, /tel:\+917351028221/, path);
    assert.match(html, /maps\.google\.com\/maps\?/, path);
    assert.match(html, /\/images\/procedures\/[a-z-]+\.webp/, path);
    assert.match(html, /Illustrative image/, path);
    assert.ok(urls.includes(`https://www.anandhospitalmbd.org${path}`), path);
    assert.ok(htmlSitemap.includes(`href="${path}"`), path);
    if (!["gallstone-surgery", "pregnancy-care", "icu-critical-care", "24x7-emergency", "emergency-surgery"].includes(slug)) assert.ok(directory.includes(`href="${path}"`), path);
    assert.match(html, new RegExp(`rel="canonical"[^>]*href="https://www.anandhospitalmbd.org${path}"|href="https://www.anandhospitalmbd.org${path}"[^>]*rel="canonical"`), path);
  }
  const gallbladder = await (await fetchPath('/services/gallbladder-surgery')).text();
  for (const heading of ['Gallbladder &amp; Gallstone Surgery in Moradabad', 'Symptoms that may indicate gallstones', 'When gallbladder surgery may be advised', 'What is laparoscopic cholecystectomy?', 'Laparoscopic vs open surgery', 'Dr Subhash Singh', 'Tests commonly required', 'Anaesthesia', 'Expected hospital stay', 'Possible risks', 'Diet after gallbladder surgery', 'When can I return to normal activity?']) assert.ok(gallbladder.includes(heading), heading);
});

test('complete doctor profiles use supplied credentials, individual schedules and honest content attribution', async () => {
  const profiles = [
    ['dr-subhash-singh', '23457'], ['dr-nidhi-thakur', '46181'],
    ['dr-bhoopendra-kumar-sharma', '117362'], ['dr-rajeev-kumar', '75493'],
    ['dr-garima-singh', '39431'], ['dr-rangit-pandey', '43348'],
  ];
  const sitemap = await (await fetchPath('/sitemap.xml')).text();
  const htmlSitemap = await (await fetchPath('/sitemap')).text();
  for (const [slug, registration] of profiles) {
    const path = `/doctors/${slug}`;
    const response = await fetchPath(path);
    const html = await response.text();
    assert.doesNotMatch(html, /\u2014|&mdash;|&#8212;|&#x2014;/i, `${path}: no em dashes`);
    assert.equal(response.status, 200, path);
    for (const id of ['credentials', 'clinical-interests', 'professional-development', 'consultation', 'educational-articles', 'videos', 'patient-information', 'profile-faqs', 'reviewer-credentials', 'recognition-gallery']) assert.ok(html.includes(`id="${id}"`), `${path}: ${id}`);
    assert.ok(html.includes(registration), `${path}: registration`);
    assert.match(html, /\/images\/doctors\/profiles\/[a-z]+\.webp/, path);
    assert.match(html, /appointment\?doctor=/, path);
    assert.ok(sitemap.includes(`<loc>https://www.anandhospitalmbd.org${path}</loc>`), path);
    assert.ok(htmlSitemap.includes(`href="${path}"`), path);
    assert.doesNotMatch(html, /"reviewedBy"|"reviewedDate"/, path);
    if (slug === 'dr-subhash-singh' || slug === 'dr-nidhi-thakur') {
      assert.ok(html.includes('Monday–Saturday'));
      assert.ok(html.includes('Sunday OPD is closed.'));
      assert.ok(html.includes('emergency cases 24×7'));
      assert.ok(html.includes('11:00 AM–3:00 PM IST'));
    } else assert.ok(html.includes('Please confirm this doctor’s timings with reception.'));
  }
  const old = await fetchPath('/doctors/dr-rajiv-kumar/');
  assert.equal(old.status, 301);
  assert.equal(old.headers.get('location'), 'https://www.anandhospitalmbd.org/doctors/dr-rajeev-kumar');
  const nidhi = await (await fetchPath('/doctors/dr-nidhi-thakur')).text();
  const subhash = await (await fetchPath('/doctors/dr-subhash-singh')).text();
  const surgeryArticles = ['gallbladder-stone-surgery', 'laparoscopic-cholecystectomy', 'hernia-surgery', 'appendix-surgery', 'piles-fissure-fistula-treatment', 'breast-cancer-surgery'];
  const womensArticles = ['pcos', 'hysterectomy', 'ovarian-cyst-treatment', 'pcos-treatment', 'high-risk-pregnancy-care', 'normal-delivery', 'caesarean-delivery', 'infertility-evaluation', 'hysteroscopy'];
  for (const [slugs, doctorPath, profile] of [[surgeryArticles, '/doctors/dr-subhash-singh', subhash], [womensArticles, '/doctors/dr-nidhi-thakur', nidhi]]) {
    for (const slug of slugs) {
      const html = await (await fetchPath(`/health-library/${slug}`)).text();
      assert.ok(html.includes(`href="${doctorPath}"`), slug);
      assert.ok(html.includes(`href="${doctorPath}#reviewer-credentials"`), slug);
      assert.ok(profile.includes(`href="/health-library/${slug}"`), slug);
    }
  }
  for (const slug of procedureSlugs.filter(slug => !['emergency-care','24x7-emergency','icu-critical-care'].includes(slug))) {
    const profile = ['general-surgery','laparoscopic-surgery','gallbladder-surgery','gallstone-surgery','hernia-surgery','appendix-surgery','piles-treatment','cancer-surgery','emergency-surgery'].includes(slug) ? subhash : nidhi;
    assert.ok(profile.includes(`href="/services/${slug}"`), slug);
  }
  assert.equal((nidhi.match(/aria-label="View [^"]+"/g) ?? []).length, 11);
  assert.equal((subhash.match(/aria-label="View [^"]+"/g) ?? []).length, 3);
});

 test('appointment page uses confirmed OPD hours and Sunday closure', async () => {
  const html = await (await fetchPath('/appointment')).text();
  assert.ok(html.includes('11:00 AM–3:00 PM IST'));
  assert.ok(html.includes('OPD closed'));
  assert.ok(html.includes('including Sundays'));
  assert.doesNotMatch(html, /9:00 AM|6:00 PM|10:15 AM/);
});

test('service directory groups care once and keeps one emergency action', async () => {
  const html = await (await fetchPath('/services')).text();
  for (const id of ['medical-services', 'treatments-procedures', 'diagnostics', 'hospital-facilities', 'patient-support']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.equal((html.match(/class="services-emergency"/g) ?? []).length, 1);
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
  const treatments = html.split('id="treatments-procedures"')[1].split('class="services-facilities"')[0];
  for (const slug of ['laparoscopic-surgery', 'gallbladder-surgery', 'cancer-surgery', 'hysteroscopy', 'infertility-evaluation']) {
    assert.ok(treatments.includes(`href="/services/${slug}"`), slug);
  }
  for (const slug of ['general-surgery', 'gallstone-surgery', 'emergency-care', 'emergency-surgery', '24x7-emergency']) {
    assert.ok(!treatments.includes(`href="/services/${slug}"`), `duplicate entry: ${slug}`);
  }
  assert.match(html, /Cancer Surgery Evaluation/);
  assert.doesNotMatch(html, /Ayushman Card Facility Available/);
  assert.match(html, /\/icons\/set-5\/simple\/right-arrow.svg/);
  assert.match(html, /\/icons\/set-5\/simple\/down-arrow.svg/);
  assert.doesNotMatch(html, /right-arrow-next\.svg|left-arrow-back\.svg|> →</);
});

test("new postpartum and PCOS guide has medical sources and credited real photography", async () => {
  const response = await fetchPath("/health-library/postpartum-pcos-weight-management");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Obesity and Weight Management After Childbirth or with PCOS/);
  assert.match(html, /Postpartum recovery and breastfeeding come first/);
  assert.match(html, /Medical information sources/);
  assert.match(html, /www\.acog\.org/);
  assert.match(html, /pmc\.ncbi\.nlm\.nih\.gov/);
  assert.match(html, /Illustrative stock photograph/);
  assert.match(html, /Anna Pelzer/);
  assert.match(html, /on Unsplash/);
  const index = await (await fetchPath("/health-library")).text();
  assert.match(index, /href="\/health-library\/postpartum-pcos-weight-management"/);
  const { readFile } = await import("node:fs/promises");
  const creditSource = await readFile(new URL("../app/health-library/photo-credits.ts", import.meta.url), "utf8");
  const credits = JSON.parse(creditSource.slice(creditSource.indexOf("= ") + 2).trim().replace(/;$/, ""));
  assert.equal(Object.keys(credits).length, 21);
  for (const [asset, credit] of Object.entries(credits)) {
    assert.match(credit.url, /^https:\/\/unsplash\.com\/photos\//);
    const bytes = await readFile(new URL(`../public${asset}`, import.meta.url));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.ok(bytes.length < 350000, `${asset} must stay compressed`);
  }
});
