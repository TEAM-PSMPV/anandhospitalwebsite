import Link from "next/link";
import { Assistance, Icon, SiteShell } from "../site-shell";
import { DoctorCards } from "../doctor-cards";

export default function Doctors() { return <SiteShell>
  <section className="medical-hero"><div className="container medical-hero-grid"><div>
    <p className="kicker">Expert care, close to home</p><h1>Doctors, Departments<br/>&amp; Services</h1><p>Experienced specialists delivering quality healthcare with compassion and care.</p>
    <div className="trust-row dark"><span><Icon name="doctors"/>Experienced<br/>Specialists</span><span><Icon name="pulse"/>Advanced<br/>Technology</span><span><Icon name="heart"/>Patient First<br/>Approach</span><span><Icon name="shield"/>24×7 Emergency<br/>Care</span></div>
    <Link className="button button-blue" href="/appointment">Book Appointment <Icon name="arrow"/></Link>
  </div><div className="medical-photo" /></div></section>

  <section className="doctor-section viewport-section" id="medical-team"><div className="container"><p className="kicker">Meet Our Doctors</p><h2>Specialists committed to your health.</h2><DoctorCards compactRemainder /></div></section>

  <section className="recognition"><div className="container recognition-grid">
    <article className="recognition-awards"><h2>Awards, Certifications &amp; Fellowships</h2><div className="award-row" aria-label="Awards, certifications and fellowships">{[1,2,3,4].map(i=><span key={i} aria-hidden="true" />)}</div></article>
    <article className="recognition-testimonials"><header><h2>Patient Testimonials</h2><span>View All Testimonials <b aria-hidden="true">→</b></span></header><div className="testimonial-stage"><button type="button" aria-label="Previous testimonial" disabled>‹</button><blockquote>“The team explained every step clearly and treated our family with genuine care.”<cite>— Anand Hospital patient</cite></blockquote><button type="button" aria-label="Next testimonial" disabled>›</button></div><div className="testimonial-dots" aria-label="Testimonial 1 of 1"><span className="active" /></div></article>
  </div></section>
  <Assistance />
</SiteShell> }
