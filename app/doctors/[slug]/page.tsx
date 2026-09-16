import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { doctors } from "../../data";
import { Assistance, Icon, SiteShell } from "../../site-shell";
import { Breadcrumbs, createPageMetadata, doctorSlug, siteUrl, surgeryKeywords, womensHealthKeywords } from "../../seo";

type Props = { params: Promise<{ slug: string }> };

const profileDetails: Record<string, { intro: string; focus: string[]; links: [string, string][] }> = {
  "dr-subhash-singh": {
    intro: "Dr Subhash Singh provides consultation and surgical planning for general and laparoscopic conditions at Anand Hospital, near Miglani Cinema on Rampur Road, Moradabad.",
    focus: ["General and laparoscopic surgery", "Gallbladder and gallstone surgery", "Open and laparoscopic hernia repair", "Appendix and emergency surgical assessment", "Piles, fissure and fistula evaluation", "Breast and cancer surgery where clinically suitable"],
    links: [["Gallbladder stone surgery", "/health-library/gallbladder-stone-surgery"], ["Laparoscopic cholecystectomy", "/health-library/laparoscopic-cholecystectomy"], ["Hernia surgery", "/health-library/hernia-surgery"], ["Appendix surgery", "/health-library/appendix-surgery"], ["Piles, fissure and fistula treatment", "/health-library/piles-fissure-fistula-treatment"], ["Breast and cancer surgery", "/health-library/breast-cancer-surgery"]],
  },
  "dr-nidhi-thakur": {
    intro: "Dr Nidhi Thakur provides obstetric, gynaecological, laparoscopic, hysteroscopy and infertility care at Anand Hospital, near Miglani Cinema on Rampur Road, Moradabad.",
    focus: ["High-risk pregnancy and obstetric care", "Normal and Caesarean delivery planning", "Gynaecology and women’s health", "Laparoscopic gynaecological assessment", "Hysteroscopy", "PCOS and infertility evaluation"],
    links: [["High-risk pregnancy care", "/health-library/high-risk-pregnancy-care"], ["Normal delivery", "/health-library/normal-delivery"], ["Caesarean delivery", "/health-library/caesarean-delivery"], ["PCOS treatment", "/health-library/pcos-treatment"], ["Infertility evaluation", "/health-library/infertility-evaluation"], ["Hysteroscopy", "/health-library/hysteroscopy"], ["Hysterectomy", "/health-library/hysterectomy"], ["Ovarian cyst treatment", "/health-library/ovarian-cyst-treatment"]],
  },
};

export function generateStaticParams() { return doctors.map((doctor) => ({ slug: doctorSlug(doctor.name) })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const doctor = doctors.find((item) => doctorSlug(item.name) === slug);
  if (!doctor) return {};
  const targeted = slug === "dr-subhash-singh" ? surgeryKeywords : slug === "dr-nidhi-thakur" ? womensHealthKeywords : [`${doctor.role} in Moradabad`, doctor.department];
  const title = slug === "dr-subhash-singh" ? "Dr Subhash Singh | Laparoscopic Surgeon in Moradabad" : slug === "dr-nidhi-thakur" ? "Dr Nidhi Thakur | Gynaecologist in Moradabad" : `${doctor.name} | ${doctor.role} in Moradabad`;
  return createPageMetadata({ title, description: `${doctor.name}, ${doctor.role} at Anand Hospital Moradabad. ${doctor.qualification}. Request an appointment with the hospital team.`, path: `/doctors/${slug}`, keywords: targeted, image: doctor.photo, imageAlt: doctor.name });
}

export default async function DoctorProfilePage({ params }: Props) {
  const slug = (await params).slug;
  const doctor = doctors.find((item) => doctorSlug(item.name) === slug);
  if (!doctor) notFound();
  const details = profileDetails[slug] ?? { intro: `${doctor.name} provides specialist care at Anand Hospital in Moradabad.`, focus: [doctor.department, doctor.role], links: [] };
  const appointment = `/appointment?${new URLSearchParams({ doctor: doctor.name, department: doctor.department }).toString()}#appointment-form`;
  const structuredData = {
    "@context": "https://schema.org", "@type": "Physician", name: doctor.name, image: `${siteUrl}${doctor.photo}`,
    medicalSpecialty: doctor.department, jobTitle: doctor.role, description: doctor.experience,
    worksFor: { "@type": "Hospital", name: "Anand Hospital", url: siteUrl },
    address: { "@type": "PostalAddress", streetAddress: "Near Miglani Cinema, Rampur Road", addressLocality: "Moradabad", postalCode: "244001", addressCountry: "IN" },
  };

  return <SiteShell>
    <Breadcrumbs items={[{ name: "Doctors", href: "/doctors" }, { name: doctor.name, href: `/doctors/${slug}` }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <main className="doctor-detail-page">
      <section className="doctor-detail-hero"><div className="container doctor-detail-hero-grid"><Image src={doctor.photo} alt={doctor.name} width={1122} height={1402} priority sizes="(max-width: 760px) 70vw, 360px"/><div><p className="kicker">{doctor.department}</p><h1>{doctor.name}</h1><p className="doctor-detail-role">{doctor.role}</p><p>{details.intro}</p><dl><div><dt>Qualifications</dt><dd>{doctor.qualification}</dd></div><div><dt>Experience</dt><dd>{doctor.experience}</dd></div></dl><div className="doctor-detail-actions"><Link className="button button-blue" href={appointment}>Book an Appointment</Link><a className="button button-outline" href="tel:+917351028221">Call Hospital</a></div></div></div></section>
      <section className="doctor-detail-content"><div className="container doctor-detail-columns"><div><h2>Clinical focus</h2><ul>{details.focus.map((item) => <li key={item}><Icon name="shield" />{item}</li>)}</ul></div><div><h2>Related patient guides</h2>{details.links.length ? <nav>{details.links.map(([label, href]) => <Link href={href} key={href}>{label}<Icon name="arrow" /></Link>)}</nav> : <p>Contact the hospital to discuss the most appropriate consultation for your needs.</p>}</div></div></section>
      <section className="doctor-detail-hospital"><div className="container"><h2>Care at Anand Hospital</h2><p>Consultations are supported by hospital diagnostics, operation theatre and anaesthesia services, inpatient facilities, critical-care coordination and 24×7 emergency care. Treatment suitability and referrals are decided after individual assessment.</p></div></section>
    </main>
    <Assistance />
  </SiteShell>;
}
