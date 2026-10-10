import { ArrowIcon } from "./arrow-icon";
import Image from 'next/image';
import Link from 'next/link';
import { Assistance, SiteShell } from './site-shell';
import { Breadcrumbs, siteUrl } from './seo';
import { procedures, sectionId, type Procedure } from './procedure-data';

export function ProcedurePage({ page }: { page: Procedure }) {
  const related = procedures.filter(item => item.group === page.group && item.slug !== page.slug);
  const sections = [{ heading: 'Introduction', paragraphs: [page.intro] }, ...page.sections];
  const isEmergency = page.group === 'Emergency Care';
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'MedicalWebPage', name: page.title,
    url: `${siteUrl}/services/${page.slug}`, description: page.intro,
    dateModified: '2026-10-05', about: { '@type': 'MedicalEntity', name: page.name },
    publisher: { '@type': 'Hospital', name: 'Anand Hospital', telephone: '+91-7351028221',
      address: { '@type': 'PostalAddress', streetAddress: 'Near Miglani Cinema, Rampur Road', addressLocality: 'Moradabad', postalCode: '244001', addressCountry: 'IN' } },
  };
  return <SiteShell><article className="service-detail-page procedure-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="service-detail-hero"><div className="container service-detail-hero-grid"><div>
      <p className="procedure-eyebrow">{page.group} · Anand Hospital</p><h1>{page.title}</h1><p>{page.intro}</p>
      <div className="service-detail-actions">{isEmergency ? <a className="button button-white" href="tel:+917351028221">Call Emergency</a> : <Link className="button button-white" href="/appointment">Book Consultation</Link>}<a className="button button-outline" href={isEmergency ? '#visit' : 'tel:+917351028221'}>{isEmergency ? 'Hospital Directions' : 'Call Hospital'}</a></div>
    </div><figure className="procedure-hero-figure"><div className="service-detail-hero-photo"><Image src={page.image} alt={page.imageAlt} width={1200} height={900} sizes="(max-width: 767px) 100vw, 40vw" priority unoptimized /></div><figcaption>Illustrative image · <a href={imageCredit(page.image).url} target="_blank" rel="noreferrer">{imageCredit(page.image).name} / Unsplash</a></figcaption></figure></div></section>
    <Breadcrumbs items={[{ name: 'Services', href: '/services' }, { name: page.name, href: `/services/${page.slug}` }]} />
    <nav className="service-local-nav" aria-label="Care guide sections"><div className="container"><a href="#guide">Understand Your Care</a><a href="#evaluation-team">Your Clinical Team</a><a href="#warning-signs">Warning Signs</a><a href="#faqs">FAQs</a><a href="#visit">Plan Your Visit</a></div></nav>
    <div className="container procedure-layout" id="guide">
      <aside className="procedure-contents"><nav aria-label="On this page"><h2>On this page</h2><ol>{sections.map(section => <li key={section.heading}><a href={`#${sectionId(section.heading)}`}>{section.heading}</a></li>)}<li><a href="#evaluation-team">Who evaluates you?</a></li><li><a href="#warning-signs">Emergency warning signs</a></li><li><a href="#cost">Cost / Ayushman eligibility</a></li><li><a href="#faqs">Frequently asked questions</a></li></ol></nav><p>Information supports your consultation. Your clinician will recommend care after examining you.</p></aside>
      <div className="procedure-copy">{sections.map(section => <section className="procedure-section" id={sectionId(section.heading)} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map(text => <p key={text}>{text}</p>)}{section.points && <ul>{section.points.map(text => <li key={text}>{text}</li>)}</ul>}</section>)}
        <section className="procedure-section procedure-team" id="evaluation-team"><p className="kicker">Who evaluates you?</p><h2>{page.doctor.name}</h2><p>{page.doctor.role}</p><p>Consultation includes your symptoms, examination, earlier reports and the treatment options that fit your health. Anaesthesia, paediatric, medical or other specialist input is coordinated when needed. Confirm consultation availability with reception.</p><Link className="button button-blue" href={page.doctor.href}>Meet the {isEmergency ? 'Hospital Team' : 'Doctor'}</Link></section>
        <section className="procedure-section procedure-warning" id="warning-signs"><h2>Emergency warning signs</h2><ul>{page.warnings.map(text => <li key={text}>{text}</li>)}</ul><a href="tel:+917351028221">Call hospital: +91 7351028221</a><p>Seek immediate emergency assessment for severe symptoms. Do not wait for an online booking response.</p></section>
        <section className="procedure-section" id="cost"><h2>Cost / Ayushman eligibility</h2><p>There is no single price that applies to every patient. Consultation, investigations, the treatment or operation, anaesthesia, room category, medicines and the need for ICU or a longer stay can change the estimate. Ask reception for a written estimate after clinical assessment and clarify inclusions, exclusions and follow-up charges.</p><p>Anand Hospital lists an Ayushman Card facility. Eligibility, the hospital’s current empanelment for the relevant package, covered treatment and required authorisation must be checked before planned admission. A card alone does not confirm that every test or procedure is covered. Bring your card and identification, and ask the desk to explain any applicable charges.</p><Link href="/site-information/ayushman-and-payments">Ayushman and payment information</Link></section>
        <section className="procedure-section" id="faqs"><h2>Frequently asked questions</h2><div className="procedure-faqs">{page.faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
        <section className="procedure-section procedure-sources"><h2>Further patient information</h2><p>General educational resources; treatment and local hospital arrangements are confirmed during consultation. Page updated 5 October 2026.</p><ul>{page.sources.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></li>)}</ul></section>
      </div>
    </div>
    <section className="service-detail-section service-detail-why" id="visit"><div className="container procedure-visit-grid"><div><p className="kicker">Plan your visit</p><h2>{isEmergency ? 'Reach emergency care.' : 'Book a consultation.'}</h2><p>Bring your reports and medicine list. Reception will confirm the clinician’s availability and appointment details.</p><div className="service-detail-actions"><Link className="button button-blue" href="/appointment">Book Consultation</Link><a className="button button-outline" href="tel:+917351028221">+91 7351028221</a></div><address>Anand Hospital<br />Near Miglani Cinema, Rampur Road<br />Moradabad, Uttar Pradesh 244001</address><p>Hospital emergency care is available 24 hours.</p></div><div className="procedure-map"><iframe title="Map showing Anand Hospital, Rampur Road, Moradabad" src="https://maps.google.com/maps?q=Anand%20Hospital%20Near%20Miglani%20Cinema%20Rampur%20Road%20Moradabad%20244001&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a href="https://maps.google.com/?q=Anand+Hospital+Near+Miglani+Cinema+Rampur+Road+Moradabad+244001" target="_blank" rel="noreferrer">Open map and get directions</a></div></div></section>
    <section className="service-detail-section"><div className="container"><p className="kicker">Related care</p><h2>Explore {page.group.toLowerCase()}</h2><div className="procedure-related">{related.map(item => <Link key={item.slug} href={`/services/${item.slug}`}>{item.name}<ArrowIcon /></Link>)}</div></div></section>
  </article><Assistance /></SiteShell>;
}
function imageCredit(path: string) {
  if (path.includes('pregnancy-care')) return { name: 'Suhyeon Choi', url: 'https://unsplash.com/photos/NIZeg731LxM' };
  if (path.includes('emergency-monitoring')) return { name: 'Maxim Tolchinskiy', url: 'https://unsplash.com/photos/HoneMAhhCXI' };
  return { name: 'National Cancer Institute', url: path.includes('womens-consultation') ? 'https://unsplash.com/photos/tl447mekwuQ' : 'https://unsplash.com/photos/KrsoedfRAf4' };
}
