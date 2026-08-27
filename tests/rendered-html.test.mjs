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
  assert.match(html, /Dr Nidhi Thakur/);
  assert.match(html, /Dr Rajiv Kumar/);
  assert.doesNotMatch(html, /Talvar Rahul Bala Ratna/);
  assert.match(html, /Near Miglani Cinema/);
  assert.match(html, /Open 24 hours/);
});

test("adds the public-site security baseline", async () => {
  const response = await fetchPath();

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
});
