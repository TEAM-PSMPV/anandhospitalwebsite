import type { MetadataRoute } from "next";
import { sitePolicies, policyPath } from "./policy-data";
import { doctors, services } from "./data";
import { healthArticles } from "./health-library/articles";
import { doctorSlug, siteUrl } from "./seo";

const updated = new Date("2026-10-02T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/doctors", "/services", "/appointment", "/health-library", "/testimonials", "/awards", "/gallery", "/site-information", "/feedback", "/sitemap"];
  return [
    ...staticPages.map((path) => ({ url: `${siteUrl}${path}`, lastModified: updated, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.8 })),
    ...sitePolicies.map((policy) => ({ url: `${siteUrl}${policyPath(policy.slug)}`, lastModified: updated, changeFrequency: "yearly" as const, priority: 0.4 })),
    ...doctors.map((doctor) => ({ url: `${siteUrl}/doctors/${doctorSlug(doctor.name)}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...services.map((service) => ({ url: `${siteUrl}/services/${service.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...healthArticles.map((article) => ({ url: `${siteUrl}/health-library/${article.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: article.treatingDoctor ? 0.8 : 0.7 })),
  ];
}
