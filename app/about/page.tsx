import Image from "next/image";
import Link from "next/link";
import { Assistance, Icon, SiteShell } from "../site-shell";
import { CountingStat } from "./counting-stat";
import { DoctorCards } from "../doctor-cards";

const values = [["heart", "Compassion"], ["community", "Patient first"], ["shield", "Integrity"], ["star", "Excellence"], ["learning", "Learning"], ["community", "Community"]] as const;

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
    <article className="mission-card"><Icon name="target" /><div><h3>Our Mission</h3><p>To deliver accessible, ethical and quality healthcare with compassion and respect.</p></div></article>
    <article className="vision-card"><Icon name="eye" /><div><h3>Our Vision</h3><p>To become the most trusted healthcare institution in Western Uttar Pradesh.</p></div></article>
    <div className="values"><h2>Our Core Values</h2><div>{values.map(([icon,label])=><span key={label}><Icon name={icon}/><b>{label}</b></span>)}</div></div>
  </div></section>

  <section className="leadership doctor-section viewport-section"><div className="container"><p className="kicker">Our Medical Team</p><h2>Experienced people. Shared purpose.</h2><DoctorCards /></div></section>

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
