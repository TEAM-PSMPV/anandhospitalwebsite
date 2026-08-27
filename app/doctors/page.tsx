import Link from "next/link";
import { Assistance, Icon, SiteShell } from "../site-shell";
import { DoctorCards } from "../doctor-cards";

export default function Doctors() { return <SiteShell>
  <section className="medical-hero"><div className="container medical-hero-grid"><div>
    <p className="kicker">Expert care, close to home</p><h1>Doctors, Departments<br/>&amp; Services</h1><p>Experienced specialists delivering quality healthcare with compassion and care.</p>
    <div className="trust-row dark"><span><Icon name="doctors"/>Experienced<br/>Specialists</span><span><Icon name="pulse"/>Advanced<br/>Technology</span><span><Icon name="heart"/>Patient First<br/>Approach</span><span><Icon name="shield"/>24×7 Emergency<br/>Care</span></div>
    <Link className="button button-blue" href="/appointment">Book Appointment <Icon name="arrow"/></Link>
  </div><div className="medical-photo" /></div></section>

  <section className="doctor-section viewport-section" id="medical-team"><div className="container"><p className="kicker">Meet Our Doctors</p><h2>Specialists committed to your health.</h2><DoctorCards /></div></section>

  <section className="reasons viewport-section"><div className="container"><p className="kicker center">Why Choose Our Medical Team</p><div className="reason-grid">{[["Experienced specialists","doctors"],["Patient-first care","heart"],["Modern technology","pulse"],["24×7 support","shield"]].map(([label,icon])=><article key={label}><Icon name={icon as "heart"}/><h3>{label}</h3><p>Clear guidance, thoughtful care and trusted clinical expertise.</p></article>)}</div></div></section>

  <section className="recognition"><div className="container recognition-grid"><article><p className="kicker">Awards, Certifications &amp; Fellowships</p><div className="award-row">{[1,2,3,4].map(i=><span key={i}><Icon name="star"/></span>)}</div></article><article><p className="kicker">Patient Testimonials</p><blockquote>“The team explained every step clearly and treated our family with genuine care.”<cite>— Anand Hospital patient</cite></blockquote></article></div></section>
  <Assistance />
</SiteShell> }
