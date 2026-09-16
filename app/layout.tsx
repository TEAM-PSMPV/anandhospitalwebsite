import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "./globals.css";
import { hospitalKeywords, siteUrl, surgeryKeywords, womensHealthKeywords } from "./seo";
import { WebVitals } from "./web-vitals";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anandhospitalmbd.org"),
  title: {
    default: "Anand Hospital Moradabad | Surgery, Gynaecology & 24×7 Care",
    template: "%s | Anand Hospital",
  },
  description:
    "Anand Hospital near Miglani Cinema, Rampur Road, Moradabad provides general, laparoscopic and cancer surgery, obstetric and gynaecological care. Open 24 hours.",
  keywords: ["Anand Hospital", ...hospitalKeywords, ...surgeryKeywords, ...womensHealthKeywords],
  authors: [{ name: "Anand Hospital" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Anand Hospital",
    title: "Anand Hospital Moradabad | Surgery, Gynaecology & 24×7 Care",
    description:
      "Specialist surgical and women's healthcare near Miglani Cinema, Rampur Road, Moradabad. Open 24 hours.",
    images: [{ url: "/brand/anand-hospital-logo.webp", alt: "Anand Hospital logo" }],
  },
  twitter: {
    card: "summary",
    title: "Anand Hospital | Healthcare in Moradabad",
    description: "Specialist surgical and women's healthcare. Open 24 hours.",
    images: ["/brand/anand-hospital-logo.webp"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION] } : undefined,
  },
  other: { "codex-preview": "development" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#023767",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const hospitalStructuredData = {
    "@context": "https://schema.org", "@type": "Hospital", "@id": `${siteUrl}/#hospital`, name: "Anand Hospital", url: siteUrl,
    logo: `${siteUrl}/brand/anand-hospital-logo.webp`, image: `${siteUrl}/images/anand-hospital-hero-1910x681.png`, telephone: "+91-7351028221", email: "info@anandhospitalmbd.org", openingHours: "Mo-Su 00:00-23:59",
    address: { "@type": "PostalAddress", streetAddress: "Near Miglani Cinema, Rampur Road", addressLocality: "Moradabad", addressRegion: "Uttar Pradesh", postalCode: "244001", addressCountry: "IN" },
    medicalSpecialty: ["GeneralSurgery", "Obstetric", "Gynecologic", "Pediatric", "Urologic", "Emergency"],
  };
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalStructuredData).replace(/</g, "\\u003c") }} />{children}<WebVitals /></body>
    </html>
  );
}
