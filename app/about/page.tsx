import Image from "next/image";
import Link from "next/link";
import { Assistance, Icon, SiteShell } from "../site-shell";
import { CountingStat } from "./counting-stat";
import { DoctorCards } from "../doctor-cards";

type CoreValueIconName = "compassion" | "patient-first" | "integrity" | "excellence" | "learning" | "community";

const values: ReadonlyArray<readonly [CoreValueIconName, string]> = [["compassion", "Compassion"], ["patient-first", "Patient first"], ["integrity", "Integrity"], ["excellence", "Excellence"], ["learning", "Learning"], ["community", "Community"]];

function CoreValueIcon({ name }: { name: CoreValueIconName }) {
  const paths = {
    compassion: <><path d="M12 11.2 8.7 8a2.7 2.7 0 0 1 3.8-3.8l.5.5.5-.5A2.7 2.7 0 0 1 17.3 8L14 11.2a1.4 1.4 0 0 1-2 0Z" /><path d="M3.5 16.5h3l3.2 1.7 6.8-2.4c1.5-.5 2.4 1.4 1.1 2.2l-6.8 3.4a3 3 0 0 1-2.6 0l-4.7-2.2M6.5 16.5l3.8-1.5a2.2 2.2 0 0 1 2 .2l1.5.9" /></>,
    "patient-first": <><circle cx="9" cy="6.5" r="3" /><path d="M4.5 17.5v-2.2A4.5 4.5 0 0 1 9 10.8a4.5 4.5 0 0 1 4.5 4.5v2.2M3 20.5h12" /><path d="M18 8.8c-2.4-2.1-5.2 1.6 0 5 5.2-3.4 2.4-7.1 0-5Z" /></>,
    integrity: <><path d="M12 3.2a14.5 14.5 0 0 0 7 2.4v5.5c0 4.4-2.8 7.7-7 9.7-4.2-2-7-5.3-7-9.7V5.6a14.5 14.5 0 0 0 7-2.4Z" /><path d="m8.8 11.8 2.1 2.1 4.5-4.5" /></>,
    excellence: <><path d="M4 19h4v-5H4v5ZM10 19h4V8h-4v11ZM16 19h4v-8h-4v8Z" /><path d="m12 2.8.8 1.7 1.9.3-1.4 1.3.3 1.9L12 7.1 10.4 8l.3-1.9-1.4-1.3 1.9-.3.8-1.7Z" /></>,
    learning: <><rect x="3.5" y="6" width="17" height="13" rx="2.5" /><path d="M7 15c2.3-3.2 4.7-4.5 7.2-4M8 17c2.2-2 4.5-3 7-3.2M15.5 8.5l1.2-1.2a1.4 1.4 0 1 1 2 2l-5.8 5.8-2.4.5.5-2.4 4.5-4.7Z" /></>,
    community: <><circle cx="12" cy="7" r="2.7" /><circle cx="5.5" cy="9" r="2" /><circle cx="18.5" cy="9" r="2" /><path d="M7.5 20v-2.4a4.5 4.5 0 0 1 9 0V20M2.5 19v-2a3 3 0 0 1 3-3 3 3 0 0 1 2.2.9M21.5 19v-2a3 3 0 0 0-3-3 3 3 0 0 0-2.2.9" /></>,
  } as const;

  return <svg className="core-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function About() { return <SiteShell>
  <section className="about-hero"><div className="container about-hero-grid"><div>
    <p className="kicker light">About Anand Hospital</p><h1>Trusted healthcare in Moradabad.</h1><p>Affordable, ethical and patient-centered care for every family.</p>
    <div className="trust-row"><span><Icon name="heart" />Patient<br/>Centered Care</span><span><Icon name="pulse" />Advanced<br/>Technology</span><span><Icon name="doctors" />Experienced<br/>Doctors</span><span><Icon name="shield" />24×7 Emergency<br/>Care</span></div>
    <Link className="button button-white" href="/appointment">Book Appointment <Icon name="arrow" /></Link>
  </div><div className="about-hero-photo" /></div></section>

  <section className="about-story viewport-section"><div className="container story-grid">
    <div><p className="kicker">Our Story</p><h2>Care built on trust, compassion and clinical excellence.</h2><p>Anand Hospital was founded with the vision of providing affordable, ethical and patient-centered healthcare to families in Moradabad. We have grown into a trusted multispecialty hospital while staying close to the community we serve.</p>
      <ul className="check-list"><li>Open 24 hours, every day</li><li>Specialist care under one roof</li></ul>
    </div><Image src="/images/hospital-reception.jpg" alt="Anand Hospital reception area" width={1280} height={960} />
    <div className="purpose-values"><div className="mission-vision-group">
      <article className="mission-card"><Icon name="target" /><div><h3>Our Mission</h3><p>To deliver accessible, ethical and quality healthcare with compassion and respect.</p></div></article>
      <article className="vision-card"><Icon name="eye" /><div><h3>Our Vision</h3><p>To become the most trusted healthcare institution in Western Uttar Pradesh.</p></div></article>
    </div><div className="values"><h2>Our Core Values</h2><div>{values.map(([icon,label])=><span key={label}><CoreValueIcon name={icon}/><b>{label}</b></span>)}</div></div></div>
  </div></section>

  <section className="leadership doctor-section viewport-section"><div className="container"><div className="leadership-heading"><div><p className="kicker">Our Medical Team</p><h2>Experienced people. Shared purpose.</h2></div><Link href="/doctors">View All Doctors <span aria-hidden="true">→</span></Link></div><DoctorCards carousel /></div></section>

  <section className="glance viewport-section"><div className="container"><p className="kicker">Anand Hospital at a Glance</p><div className="stats">{[[19,"+","Years of experience"],[100,"+","Team members"],[8,"","Core services"],[24,"×7","Emergency care"],[2007,"","Established"]].map(([value,suffix,label])=><div key={label}><CountingStat value={value as number} suffix={suffix as string}/><span>{label}</span></div>)}</div></div></section>

  <section className="faq" id="faq"><div className="container"><p className="kicker">Frequently Asked Questions</p><div className="faq-grid">{[
    ["How can I book an appointment?","Use our online appointment page or contact the hospital reception."],
    ["What are OPD timings?","Doctor schedules vary. Please request an appointment for the latest availability."],
    ["Is emergency service available 24×7?","Yes. Anand Hospital is open 24 hours every day."],
    ["Where is Anand Hospital located?","Near Miglani Cinema, Rampur Road, Moradabad [244001]."],
    ["What facilities are available?","Emergency, surgery, maternity, diagnostics and inpatient care are available."],
  ].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
  <Assistance />
</SiteShell> }
