import type { Metadata } from "next";
import Link from "next/link";
import { Assistance, SiteShell } from "./site-shell";
import { Breadcrumbs } from "./seo";

export const metadata: Metadata = { title: "Page Not Found | Anand Hospital", robots: { index: false, follow: true } };

export default function NotFound() {
  return <SiteShell>
    <Breadcrumbs items={[{ name: "Page not found", href: "/404" }]} />
    <main className="not-found-page"><div className="container"><p className="kicker">404 error</p><h1>We couldn’t find that page.</h1><p>The page may have moved. Find a doctor, browse hospital services, or contact our 24×7 team.</p><div><Link className="button button-blue" href="/">Return Home</Link><Link className="button button-outline" href="/services">View Services</Link><a className="button button-outline" href="tel:+917351028221">Call Hospital</a></div></div></main>
    <Assistance />
  </SiteShell>;
}
