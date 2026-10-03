import { ArrowIcon } from "../arrow-icon";
import Link from "next/link";
import { doctors, services } from "../data";
import { healthArticles } from "../health-library/articles";
import { sitePolicies, policyPath } from "../policy-data";
import { SiteShell } from "../site-shell";
import { Breadcrumbs, createPageMetadata, doctorSlug } from "../seo";
export const metadata = createPageMetadata({ title: "Website Sitemap | Anand Hospital Moradabad", description: "Find all Anand Hospital pages, grouped by doctors, services, hospital galleries, health information and website policies.", path: "/sitemap" });
const groups = [
  { id: "hospital", title: "Hospital & patient information", links: [["Home", "/"], ["About Anand Hospital", "/about"], ["Doctors & Departments", "/doctors"], ["Our Services", "/services"], ["Request an Appointment", "/appointment"], ["Hospital Gallery", "/gallery"], ["Awards & Felicitations", "/awards"], ["Patient Testimonials", "/testimonials"], ["Search the Website", "/search"], ["Website Sitemap", "/sitemap"]] },
  { id: "doctors", title: "Our doctors", links: doctors.map((doctor) => [doctor.name, `/doctors/${doctorSlug(doctor.name)}`]) },
  { id: "services", title: "Medical services", links: services.map((service) => [service.name, `/services/${service.slug}`]) },
  { id: "surgery", title: "Surgery & women’s health guides", links: healthArticles.filter((article) => article.treatingDoctor).map((article) => [article.title, `/health-library/${article.slug}`]) },
  { id: "health", title: "Health Library & wellbeing", links: [["Health Library", "/health-library"], ...healthArticles.filter((article) => !article.treatingDoctor).map((article) => [article.title, `/health-library/${article.slug}`])] },
  { id: "policies", title: "Site information & policies", links: [["Site Information & Policies", "/site-information"], ...sitePolicies.map((policy) => [policy.title, policyPath(policy.slug)]), ["Send Us Feedback", "/feedback"]] },
];
export default function SitemapPage() { return <SiteShell><section className="html-sitemap"><div className="container"><p className="kicker">Every page. One clear path.</p><h1>Website Sitemap</h1><p className="information-lead">Find a specialist, explore care options, see the hospital or understand our website policies.</p></div></section><Breadcrumbs items={[{ name: "Sitemap", href: "/sitemap" }]} /><section className="html-sitemap"><div className="container"><nav className="sitemap-collections" aria-label="Sitemap categories">{groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.title}</a>)}</nav><div className="sitemap-group-grid">{groups.map((group) => <section id={group.id} key={group.id}><h2>{group.title}</h2><ul>{group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}<span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></li>)}</ul></section>)}</div><a className="sitemap-xml" href="/sitemap.xml">View XML sitemap for search engines <ArrowIcon direction="right" /></a></div></section></SiteShell>; }
