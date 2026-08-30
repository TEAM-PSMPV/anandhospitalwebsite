import { Icon, SiteShell } from "../site-shell";
import { AppointmentForm } from "./appointment-form";

export default function Appointment(){
  return <SiteShell><section className="appointment-page-hero"><div className="container appointment-page-hero-grid"><div className="appointment-page-hero-copy">
    <h1>Book an Appointment</h1><p>Schedule your visit with our experienced doctors.</p>
    <div className="appointment-page-hero-features"><span><Icon name="heart"/>Patient<br/>Centered Care</span><span><Icon name="pulse"/>Advanced<br/>Technology</span><span><Icon name="doctors"/>Experienced<br/>Doctors</span><span><Icon name="shield"/>24×7 Emergency<br/>Care</span></div>
  </div><div className="appointment-page-hero-image" role="img" aria-label="Anand Hospital medical team" /></div></section>
  <section className="appointment viewport-section"><div className="container appointment-grid">
    <div className="appointment-form-card"><h2>Schedule Your Appointment</h2>
      <AppointmentForm />
    </div>
    <aside className="appointment-next-card" aria-labelledby="appointment-next-title"><h2 id="appointment-next-title">What Happens Next?</h2>
      <ol className="appointment-steps"><li><span>1</span><div><h3>We receive your request</h3><p>Your appointment request is received successfully.</p></div></li><li><span>2</span><div><h3>Confirmation call</h3><p>Our team will call you to confirm your appointment details.</p></div></li><li><span>3</span><div><h3>Visit the hospital</h3><p>Arrive on time and our staff will assist you with a smooth experience.</p></div></li></ol>
      <div className="appointment-info-list"><div><Icon name="clock"/><div><h3>OPD Timings</h3><p><strong>Monday - Saturday:</strong> 9:00 AM - 6:00 PM<br/><strong>Sunday:</strong> 9:00 AM - 1:00 PM</p></div></div><div><Icon name="emergency"/><div><h3>24x7 Emergency Care</h3><p>Our emergency services are available<br/>24x7, every day.</p></div></div><div><Icon name="phone"/><div><h3>Need Help?</h3><p>Call us at <a href="tel:+917351028221">+91 7351028221</a></p></div></div></div>
      <a className="appointment-address" href="https://maps.google.com/?q=Anand+Hospital+Near+Miglani+Cinema+Rampur+Road+Moradabad+244001" target="_blank" rel="noreferrer"><Icon name="location"/><span><strong>Hospital Address</strong>Near Miglani Cinema, Rampur Road,<br/>Moradabad [244001]</span></a>
    </aside>
  </div></section>
  <section className="services-contact appointment-contact-strip" aria-label="Hospital contact information">
    <div className="container services-contact-grid">
      <a href="tel:+917351028221"><Icon name="phone"/><span><strong>Book Appointment</strong>+91 7351028221</span></a>
      <a href="tel:+919528261199"><Icon name="phone"/><span><strong>Follow-up Patient Help</strong>+91 9528261199</span></a>
      <a href="mailto:info@anandhospitalmbd.org"><Icon name="mail"/><span><strong>Email</strong>info@anandhospitalmbd.org</span></a>
      <div><Icon name="clock"/><span><strong>OPD Timings</strong>10:15 AM to 03:00 PM</span></div>
    </div>
  </section>
  <section className="appointment-faq" aria-labelledby="appointment-faq-title"><div className="container">
    <h2 id="appointment-faq-title">Appointment FAQs</h2>
    <div className="appointment-faq-grid">
      <div>{[
        ["How do I book an appointment?", "Complete the appointment request form on this page. The hospital reception team will contact you to confirm doctor availability."],
        ["Can I reschedule or cancel my appointment?", "Please contact the hospital reception team for the latest information about rescheduling or cancelling your appointment."],
        ["Is there a consultation fee?", "Please contact the hospital reception team for the latest consultation fee information."],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      <div>{[
        ["Do I need to create an account to book?", "No account is required. Complete the appointment request form and the reception team will contact you."],
        ["Will I receive a confirmation?", "The hospital reception team will call you to confirm your appointment details and doctor availability."],
        ["What documents should I carry?", "Please contact the hospital reception team to confirm which documents are needed for your visit."],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </div>
  </div></section></SiteShell>
}
