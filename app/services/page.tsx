import Link from "next/link";
import type { Metadata } from "next";
import { services } from "../data";
import { Assistance, Icon, type IconName, SiteShell } from "../site-shell";
import Image from "next/image";
import { ArrowIcon } from "../arrow-icon";
import { DoctorCards } from "../doctor-cards";
import { Breadcrumbs, createPageMetadata, hospitalKeywords, surgeryKeywords, womensHealthKeywords } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Hospital Services in Moradabad | Anand Hospital", description: "Explore surgery, maternity, emergency, ICU, paediatrics, urology and other hospital services at Anand Hospital in Moradabad.", path: "/services", keywords: [...hospitalKeywords, ...surgeryKeywords, ...womensHealthKeywords] });

import { treatmentGroups } from "../service-directory";

type Facility = { id: string; title: string; description: string; icon: IconName; image?: string; imageAlt?: string; href?: string; action?: string };
const facilityGroups: { id: string; title: string; tone: "blue" | "green"; items: Facility[] }[] = [
  { id: "diagnostics", title: "Diagnostics", tone: "blue", items: [
    { id: "pathology-lab", title: "Pathology Lab", description: "Laboratory testing to support your clinician’s assessment. Contact reception for test availability and preparation.", icon: "path-lab" },
    { id: "imaging-services", title: "Imaging Services", description: "X-ray and ultrasound imaging. Reception can confirm availability and guide your visit.", icon: "ultrasound", image: "/images/facilities/imaging-services.webp", imageAlt: "Imaging equipment at Anand Hospital in Moradabad" },
  ] },
  { id: "hospital-facilities", title: "Hospital Facilities", tone: "blue", items: [
    { id: "icu-facility", title: "ICU Facility", description: "A dedicated facility for close observation and monitoring. Learn about the ICU & Critical Care service.", icon: "critical-care", image: "/images/facilities/critical-care-icu.webp", imageAlt: "Critical care facility at Anand Hospital in Moradabad", href: "/services/critical-care", action: "Explore Critical Care" },
    { id: "deluxe-rooms", title: "Deluxe Rooms", description: "Private patient rooms for recovery. Ask reception about room availability.", icon: "deluxe-beds", image: "/images/facilities/deluxe-room.webp", imageAlt: "Deluxe patient room at Anand Hospital in Moradabad", href: "/gallery#deluxe", action: "View Gallery" },
    { id: "reception", title: "Reception & Waiting Area", description: "A place for patients and families to find guidance and plan their hospital visit.", icon: "hospital-set-3", image: "/images/facilities/reception-area.webp", imageAlt: "Reception and waiting area at Anand Hospital in Moradabad", href: "/gallery#facilities", action: "View Gallery" },
    { id: "operation-theatre", title: "Operation Theatre", description: "The hospital’s surgical facility. Your specialist can explain the care planned for your procedure.", icon: "general-surgery", image: "/images/facilities/ot.webp", imageAlt: "Operation theatre at Anand Hospital in Moradabad", href: "/services/general-surgery", action: "Explore General Surgery" },
  ] },
  { id: "patient-support", title: "Patient Support", tone: "green", items: [
    { id: "health-checkups", title: "Health Checkups", description: "Ask about preventive health consultations and the checks suitable for you.", icon: "health-checkup" },
    { id: "diet-nutrition", title: "Diet & Nutrition", description: "Contact the care team about dietary guidance during treatment and recovery.", icon: "diet-and-nutrition" },
    { id: "pharmacy", title: "Pharmacy", description: "Ask reception about prescribed medicine availability and pharmacy assistance.", icon: "pharmacy" },
    { id: "home-care", title: "Home Care", description: "Discuss your care needs with reception to confirm current home-care options and arrangements.", icon: "home-care" },
  ] },
];

export default function Services() {
  return <SiteShell>

    <div className="services-page">
      <section className="services-hero">
        <div className="container services-hero-grid">
          <div className="services-hero-copy">
            <h1>Hospital Services in Moradabad</h1>
            <p>Comprehensive, compassionate care across a wide range of specialties to support your health and well-being.</p>
            <div className="services-trust">
              <span><Icon name="doctors" />Experienced<br />Specialists</span>
              <span><Icon name="pulse" />Advanced<br />Technology</span>
              <span><Icon name="heart" />Patient First<br />Approach</span>
              <span><Icon name="emergency" />24x7<br />Emergency Care</span>
            </div>
            <Link className="services-book" href="/appointment">Book Appointment <Icon name="arrow" /></Link>
          </div>
          <div className="services-hero-image" role="img" aria-label="Anand Hospital NICU" />
        </div>
      </section>
<Breadcrumbs items={[{ name: "Services", href: "/services" }]} />

      <section className="services-specialties" id="medical-services" aria-labelledby="medical-services-heading">
        <div className="container"><h2 id="medical-services-heading">Medical Services</h2><div className="services-specialty-grid">
          {services.map(item => <article id={item.slug} key={item.slug}>
            <Icon name={item.icon} /><h3>{item.name}</h3><p>{item.description}</p>
            <Link href={`/services/${item.slug}`}>Learn More <ArrowIcon /></Link>
          </article>)}
        </div></div>
      </section>
      <section className="service-detail-section procedure-directory" id="treatments-procedures"><div className="container"><p className="kicker">Understand your treatment options</p><h2>Treatments &amp; Procedures</h2><p>Explore evaluation, treatment options, preparation and recovery before your consultation.</p><div className="procedure-directory-grid">{treatmentGroups.map(group => <section key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item.href}><Link href={item.href}>{item.name}<ArrowIcon /></Link></li>)}</ul></section>)}</div></div></section>
      <section className="services-facilities">
        <div className="container services-facility-groups">
          {facilityGroups.map(group => <section id={group.id} className={`services-facility-group ${group.tone}`} key={group.id} aria-labelledby={`${group.id}-heading`}>
            <h2 id={`${group.id}-heading`}>{group.title}</h2><div>{group.items.map(item => <article id={item.id} key={item.id}>
              <div className={`services-facility-image${item.image ? "" : " services-facility-image--icon"}`}>{item.image ? <Image src={item.image} alt={item.imageAlt ?? ""} width={1448} height={1086} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 25vw" /> : <Icon name={item.icon} />}</div>
              <div className="services-facility-copy"><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href ?? "/appointment"}>{item.action ?? "Enquire with Reception"} <ArrowIcon /></Link></div>
            </article>)}</div>
            {group.id === "patient-support" && <aside className="services-ayushman"><h3>Ayushman Card Information</h3><p>Contact reception to confirm current scheme participation, eligibility and documents before planning treatment.</p><Link href="/site-information/ayushman-and-payments">Ayushman &amp; Payment Information <ArrowIcon /></Link></aside>}
          </section>)}
        </div>
      </section>
      <section className="services-doctors"><div className="container"><h2>Meet Our Doctors</h2><p>Find your specialist and request a consultation.</p><DoctorCards carousel /><Link className="button button-blue" href="/doctors">View All Doctors <ArrowIcon /></Link></div></section>
      <section className="services-faq"><div className="container"><h2>Services: Frequently Asked Questions</h2><details><summary>How can I book an appointment?</summary><p>Use the <Link href="/appointment">appointment form</Link> or call <a href="tel:+917351028221">+91 73510 28221</a>. Reception confirms the doctor’s availability and appointment details.</p></details><details><summary>How do I contact emergency care?</summary><p>Hospital emergency care is available 24 hours. Call <a href="tel:+917351028221">+91 73510 28221</a> or visit Anand Hospital near Miglani Cinema, Rampur Road, Moradabad. Use the emergency contact for urgent care.</p></details><details><summary>How can I confirm tests, facilities or Ayushman eligibility?</summary><p>Call reception before your visit to confirm availability, preparation, documents and payment or scheme arrangements.</p></details></div></section>
      <section className="services-emergency">
        <div className="container services-emergency-inner">
          <Icon name="siren" />
          <div><h2>Emergency Care – Available 24x7</h2><p>Our emergency team is always ready to provide immediate care when you need it the most.</p></div>
          <a href="tel:+917351028221"><Icon name="phone" /><span>Call Emergency<strong>+91 7351028221</strong></span></a>
        </div>
      </section>

    </div>
    <Assistance />
  </SiteShell>;
}
