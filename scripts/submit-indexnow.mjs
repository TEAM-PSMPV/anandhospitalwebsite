const key = process.env.INDEXNOW_KEY?.trim();
if (!key) {
  console.log("INDEXNOW_KEY is not configured; skipping IndexNow submission.");
  process.exit(0);
}

const host = "www.anandhospitalmbd.org";
const sitemapResponse = await fetch(`https://${host}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Could not fetch the production sitemap (${sitemapResponse.status}).`);
const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error("The production sitemap contains no URLs.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
if (![200, 202].includes(response.status)) throw new Error(`IndexNow rejected the submission (${response.status}).`);
console.log(`Submitted ${urlList.length} production URLs to IndexNow.`);
