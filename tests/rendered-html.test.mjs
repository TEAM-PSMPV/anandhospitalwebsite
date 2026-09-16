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

test("renders the homepage conversion and location content", async () => {
  const response = await fetchPath();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Laparoscopic Surgery and Women’s Healthcare in Moradabad/);
  assert.match(html, /Book an Appointment/);
  assert.match(html, /Call Emergency/);
  assert.match(html, /Verified Google rating · 229 reviews/);
  assert.match(html, /Dr Subhash Singh/);
  assert.match(html, /Dr Nidhi Thakur/);
  assert.match(html, /Map showing Anand Hospital on Rampur Road/);
  assert.match(html, /Parking is available at the hospital/);
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

test("adds the public-site security baseline", async () => {
  const response = await fetchPath();

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  const contentSecurityPolicy = response.headers.get("content-security-policy") ?? "";
  assert.match(contentSecurityPolicy, /frame-ancestors 'none'/);
  assert.match(contentSecurityPolicy, /script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
  assert.match(contentSecurityPolicy, /connect-src[^;]*https:\/\/cloudflareinsights\.com/);
  assert.match(contentSecurityPolicy, /frame-src[^;]*https:\/\/www\.google\.com/);
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
