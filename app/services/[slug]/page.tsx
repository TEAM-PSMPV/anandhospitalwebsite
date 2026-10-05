import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "../../data";
import { Assistance, Icon, SiteShell } from "../../site-shell";
import Image from "next/image";
import { Breadcrumbs, createPageMetadata, hospitalKeywords, surgeryKeywords, womensHealthKeywords } from "../../seo";

import { procedures } from "../../procedure-data";
import { ProcedurePage } from "../../procedure-page";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...new Set([...services, ...procedures].map(item => item.slug))].map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const procedure = procedures.find(item => item.slug === slug);
  const service = services.find((item) => item.slug === slug);
  if (procedure) return createPageMetadata({ title: `${procedure.title} | Anand Hospital`, description: procedure.intro, path: `/services/${procedure.slug}`, keywords: procedure.group === "Surgery" ? surgeryKeywords : procedure.group === "Women’s Health" ? womensHealthKeywords : hospitalKeywords, image: procedure.image });
  if (!service) return {};
  const keywords = service.slug === "general-surgery" ? surgeryKeywords : service.slug === "obstetrics-gynaecology" ? womensHealthKeywords : hospitalKeywords;
  return createPageMetadata({ title: `${service.name} in Moradabad | Anand Hospital`, description: `${service.description} Learn about ${service.name.toLowerCase()} at Anand Hospital, Near Miglani Cinema, Rampur Road, Moradabad 244001.`, path: `/services/${service.slug}`, keywords, image: service.heroImage });
}

const supportingIcons = ["a-female-doctor", "alcohol-disinfection", "doctor-set-3", "hospital-set-3", "male-doctor", "medical-examination-female", "medical-examination-male", "thermometer", "trusted-community", "holding-hands"] as const;

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const procedure = procedures.find(item => item.slug === slug);
  if (procedure) return <ProcedurePage page={procedure} />;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const start = services.findIndex((item) => item.slug === slug);
  const icons = Array.from({ length: 4 }, (_, index) => supportingIcons[(start + index) % supportingIcons.length]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Anand Hospital",
    medicalSpecialty: service.name,
    address: { "@type": "PostalAddress", streetAddress: "Near Miglani Cinema, Rampur Road", addressLocality: "Moradabad", postalCode: "244001", addressCountry: "IN" },
    telephone: "+91-7351028221",
  };

  return <SiteShell>

    <article className="service-detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="service-detail-hero"><div className="container service-detail-hero-grid"><div>
        <h1>{service.name}</h1><p>{service.description}</p>
        <div className="service-detail-actions"><Link className="button button-white" href="/appointment">Book Appointment</Link><a className="button button-outline" href="tel:+917351028221">Call Hospital</a></div>
      </div><div className="service-detail-hero-photo"><Image src={service.heroImage} alt={`${service.name} facility at Anand Hospital`} width={1448} height={1086} /></div></div></section>
<Breadcrumbs items={[{ name: "Services", href: "/services" }, { name: service.name, href: `/services/${service.slug}` }]} />

      <nav className="service-local-nav" aria-label={`${service.name} page sections`}><div className="container"><a href="#care">Care We Provide</a><a href="#why-anand">Why Anand Hospital</a><a href="#visit">Plan Your Visit</a></div></nav>

      <section className="service-detail-section" id="care"><div className="container service-detail-copy"><p className="kicker">Find the care you need</p><h2>{service.name} at Anand Hospital</h2><p>{service.overview}</p><div className="service-care-grid">{service.care.map((item, index) => <article key={item}><Icon name={icons[index]} /><h3>{item}</h3><p>Personalised evaluation and coordinated care from our hospital team in Moradabad.</p></article>)}</div></div></section>

      {(slug === "general-surgery" || slug === "obstetrics-gynaecology") && <section className="service-detail-section"><div className="container service-detail-copy"><h2>{slug === "general-surgery" ? "General and laparoscopic surgery in Moradabad" : "Gynaecology and maternity care in Moradabad"}</h2><p>{slug === "general-surgery" ? "Dr Subhash Singh provides consultation for gallbladder and gallstone surgery, hernia repair, appendix surgery, piles and selected cancer surgery at Anand Hospital near Rampur Road. The surgical approach, including minimally invasive options, depends on individual assessment." : "Dr Nidhi Thakur provides women’s healthcare, pregnancy and high-risk obstetric care, delivery planning, PCOS and infertility evaluation, hysteroscopy and laparoscopic gynaecology at Anand Hospital near Rampur Road."}</p><Link className="button button-blue" href={slug === "general-surgery" ? "/doctors/dr-subhash-singh" : "/doctors/dr-nidhi-thakur"}>Meet {slug === "general-surgery" ? "Dr Subhash Singh" : "Dr Nidhi Thakur"}</Link></div></section>}
      <section className="service-detail-section service-detail-why" id="why-anand"><div className="container"><p className="kicker">Why choose Anand Hospital?</p><h2>Care built around patients and families.</h2><div className="service-reason-grid">{[["Experienced clinical team", "doctor-set-3"], ["Round-the-clock hospital support", "hospital-set-3"], ["Careful examination", "medical-examination-female"], ["Community-focused care", "trusted-community"]].map(([label, icon]) => <article key={label}><Icon name={icon as typeof supportingIcons[number]} /><h3>{label}</h3><p>Clear communication, thoughtful coordination and accessible care close to home.</p></article>)}</div></div></section>

      <section className="service-detail-section" id="visit"><div className="container service-visit"><div><p className="kicker">Plan your visit</p><h2>Talk with our hospital team.</h2><p>Anand Hospital is open 24 hours near Miglani Cinema, Rampur Road, Moradabad [244001].</p></div><Link className="button button-blue" href="/appointment">Request an Appointment</Link></div></section>
    </article>
    <Assistance />
  </SiteShell>;
}
