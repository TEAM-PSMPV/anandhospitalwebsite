import type { Metadata } from "next";
import Link from "next/link";

export const siteUrl = "https://www.anandhospitalmbd.org";
export const defaultSocialImage = "/brand/anand-hospital-logo.webp";

export const surgeryKeywords = [
  "Dr Subhash Singh",
  "laparoscopic surgeon in Moradabad",
  "general surgeon in Moradabad",
  "gallbladder surgeon in Moradabad",
  "gallstone surgery in Moradabad",
  "laparoscopic gallbladder surgery in Moradabad",
  "hernia surgeon in Moradabad",
  "laparoscopic hernia surgery in Moradabad",
  "appendix surgeon in Moradabad",
  "piles surgeon in Moradabad",
  "cancer surgeon in Moradabad",
  "minimally invasive surgeon in Moradabad",
  "laparoscopic surgeon near Rampur Road",
  "laparoscopic surgeon near me",
];

export const womensHealthKeywords = [
  "Dr Nidhi Thakur",
  "gynaecologist in Moradabad",
  "gynecologist in Moradabad",
  "obstetrician in Moradabad",
  "female gynaecologist in Moradabad",
  "maternity hospital in Moradabad",
  "pregnancy doctor in Moradabad",
  "high-risk pregnancy doctor in Moradabad",
  "normal delivery hospital in Moradabad",
  "C-section hospital in Moradabad",
  "infertility specialist in Moradabad",
  "PCOS doctor in Moradabad",
  "hysteroscopy in Moradabad",
  "laparoscopic gynaecologist in Moradabad",
  "women’s hospital near Rampur Road",
];

export const hospitalKeywords = [
  "hospital near Rampur Road Moradabad",
  "24 hour hospital in Moradabad",
  "emergency hospital in Moradabad",
  "private hospital in Moradabad",
  "affordable hospital in Moradabad",
  "Ayushman hospital in Moradabad",
  "multispeciality hospital in Moradabad",
  "ICU hospital in Moradabad",
  "surgery hospital in Moradabad",
  "family hospital in Moradabad",
  "hospital near Miglani Cinema",
  "hospital open now near me",
];

type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export function createPageMetadata({ title, description, path, keywords = [], image = defaultSocialImage, imageAlt = "Anand Hospital Moradabad", noIndex = false }: MetadataOptions): Metadata {
  const canonical = path === "/" ? siteUrl : `${siteUrl}${path}`;
  return {
    title: { absolute: title },
    description,
    keywords: [...keywords],
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Anand Hospital",
      title,
      description,
      url: canonical,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export type BreadcrumbItem = { name: string; href: string };

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [{ name: "Home", href: "/" }, ...items];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href === "/" ? siteUrl : `${siteUrl}${item.href}`,
    })),
  };

  return <>
    <nav className="seo-breadcrumb" aria-label="Breadcrumb">
      <ol>{allItems.map((item, index) => <li key={item.href}>{index < allItems.length - 1 ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol>
    </nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </>;
}

export const doctorSlug = (name: string) => name.toLowerCase().replace(/^dr\s+/, "dr-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
