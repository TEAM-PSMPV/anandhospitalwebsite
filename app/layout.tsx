import type { Metadata, Viewport } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://anandhospitalmbd.org"),
  title: {
    default: "Anand Hospital | Surgical & Women's Healthcare in Moradabad",
    template: "%s | Anand Hospital",
  },
  description:
    "Anand Hospital near Miglani Cinema, Rampur Road, Moradabad provides general, laparoscopic and cancer surgery, obstetric and gynaecological care. Open 24 hours.",
  keywords: [
    "Anand Hospital",
    "hospital in Moradabad",
    "surgeon in Moradabad",
    "gynecologist in Moradabad",
    "laparoscopic surgery Moradabad",
  ],
  authors: [{ name: "Anand Hospital" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Anand Hospital",
    title: "Anand Hospital | Healthcare in Moradabad",
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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
