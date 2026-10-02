import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../../site-shell";
import { Breadcrumbs, createPageMetadata } from "../../seo";
import { sitePolicies, policyPath } from "../../policy-data";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return sitePolicies.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug } = await params; const policy = sitePolicies.find((item) => item.slug === slug); return policy ? createPageMetadata({ title: `${policy.title} | Anand Hospital`, description: policy.description, path: policyPath(policy.slug) }) : {}; }
export default async function PolicyPage({ params }: Props) {
  const { slug } = await params; const policy = sitePolicies.find((item) => item.slug === slug); if (!policy) notFound();
  return <SiteShell><Breadcrumbs items={[{ name: "Site Information", href: "/site-information" }, { name: policy.title, href: policyPath(slug) }]} /><article className="policy-page"><header className="policy-hero"><div className="container"><p className="kicker">{policy.eyebrow}</p><h1>{policy.title}</h1><p>{policy.description}</p><small>Updated 2 October 2026</small></div></header><div className="container policy-layout"><aside><nav aria-label="On this page"><span>On this page</span>{policy.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>)}</nav><Link href="/site-information">All policies →</Link></aside><div className="policy-prose">{policy.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((text) => <p key={text}>{text}</p>)}</section>)}<section className="policy-help"><h2>A question about this page?</h2><p>Contact the hospital for patient-care matters, or share a website question with the development team.</p><div><a href="mailto:info@anandhospitalmbd.org">Email Anand Hospital</a><Link href="/feedback">Send Website Feedback →</Link></div></section></div></div></article></SiteShell>;
}
