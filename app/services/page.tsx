import Link from "next/link";
import { services } from "../data";
import { Assistance, Icon, type IconName, SiteShell } from "../site-shell";
import Image from "next/image";
import { FacilitySlideshow } from "../facility-slideshow";

const facilityGroups: ReadonlyArray<{ title: string; tone: "blue" | "green"; items: ReadonlyArray<{ title: string; description: string; icon: IconName }> }> = [
  { title: "Diagnostics & Facilities", tone: "blue", items: [
    { title: "Pathology Lab", description: "Accurate and timely lab testing with advanced equipment.", icon: "path-lab" },
    { title: "Imaging Services", description: "X-Ray and ultrasound imaging for precise diagnosis.", icon: "ultrasound" },
    { title: "Pharmacy", description: "Well-stocked pharmacy with genuine medicines and expert guidance.", icon: "pharmacy" },
    { title: "Blood Bank", description: "Safe and reliable blood storage and transfusion services.", icon: "blood-bank" },
  ] },
  { title: "Patient Care Services", tone: "green", items: [
    { title: "Health Checkups", description: "Preventive health packages tailored for individuals and families.", icon: "health-checkup" },
    { title: "Diet & Nutrition", description: "Personalized diet plans for better health and wellness.", icon: "diet-and-nutrition" },
    { title: "Deluxe Room", description: "Comfortable private rooms designed for a restful recovery.", icon: "deluxe-beds" },
    { title: "Home Care", description: "Professional medical care in the comfort of your home.", icon: "home-care" },
    { title: "Reception Area", description: "A welcoming reception team to guide patients and families.", icon: "hospital-set-3" },
    { title: "Ayushman Card Facility Available", description: "Ayushman Bharat card support is available for eligible patients.", icon: "ayushman" },
  ] },
];

export default function Services() {
  return <SiteShell>
    <div className="services-page">
      <section className="services-hero">
        <div className="container services-hero-grid">
          <div className="services-hero-copy">
            <h1>Our Healthcare Services</h1>
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

      <section className="services-specialties" aria-label="Medical specialties">
        <div className="container services-specialty-grid">
          {services.map((item) => <article id={item.slug} key={item.name}>
            <Icon name={item.icon} />
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <Link href={`/services/${item.slug}`}>Learn More <Icon name="arrow" /></Link>
          </article>)}
        </div>
      </section>

      <section className="services-emergency">
        <div className="container services-emergency-inner">
          <Icon name="emergency" />
          <div><h2>Emergency Care — Available 24x7</h2><p>Our emergency team is always ready to provide immediate care when you need it the most.</p></div>
          <a href="tel:+917351028221"><Icon name="phone" /><span>Call Emergency<strong>+91 7351028221</strong></span></a>
        </div>
      </section>

      <section className="services-contact" aria-label="Hospital contact information">
        <div className="container services-contact-grid">
          <a href="tel:+917351028221"><Icon name="phone" /><span><strong>Book Appointment</strong>+91 7351028221</span></a>
          <a href="tel:+919528261199"><Icon name="phone" /><span><strong>Follow-up Patient Help</strong>+91 9528261199</span></a>
          <a href="mailto:info@anandhospitalmbd.org"><Icon name="mail" /><span><strong>Email</strong>info@anandhospitalmbd.org</span></a>
          <div><Icon name="clock" /><span><strong>OPD Timings</strong>10:15 AM to 03:00 PM</span></div>
        </div>
      </section>

      <section className="services-facilities">
        <div className="container services-facility-groups">
          {facilityGroups.map((group) => <div className={`services-facility-group ${group.tone}`} key={group.title}>
            <h2>{group.title}</h2>
            <div>{group.items.map((item) => <article key={item.title}>
              <div className="services-facility-image">{item.title === "Reception Area" ? <Image src="/images/facilities/reception-area.png" alt="Anand Hospital reception area" width={1448} height={1086} /> : item.title.startsWith("Ayushman") ? <><Image src="/images/facilities/ayushman-card-facility.png" alt="Ayushman Card facility" width={1448} height={1086} /><Icon name={item.icon} /></> : <Icon name={item.icon} />}</div>
              <div className="services-facility-copy"><h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href="/appointment">Learn More <Icon name="arrow" /></Link></div>
            </article>)}</div>
          </div>)}
        </div>
      </section>
      <FacilitySlideshow />
    </div>
    <Assistance />
  </SiteShell>;
}
