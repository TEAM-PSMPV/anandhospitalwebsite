import Link from "next/link";
import { services } from "../data";
import { Assistance, Icon, type IconName, SiteShell } from "../site-shell";
import Image from "next/image";
import { FacilitySlideshow } from "../facility-slideshow";

const facilityGroups: ReadonlyArray<{ title: string; tone: "blue" | "green"; items: ReadonlyArray<{ title: string; description: string; icon: IconName; image: string; imageAlt: string; imageKind?: "icon" }> }> = [
  { title: "Diagnostics & Facilities", tone: "blue", items: [
    { title: "Pathology Lab", description: "Accurate and timely lab testing with advanced equipment.", icon: "path-lab", image: "/icons/set-2/path-lab.svg", imageAlt: "Pathology laboratory", imageKind: "icon" },
    { title: "Imaging Services", description: "X-Ray and ultrasound imaging for precise diagnosis.", icon: "ultrasound", image: "/images/facilities/imaging-services.png", imageAlt: "Anand Hospital imaging services" },
    { title: "Pharmacy", description: "Well-stocked pharmacy with genuine medicines and expert guidance.", icon: "pharmacy", image: "/icons/set-2/pharmacy.svg", imageAlt: "Hospital pharmacy", imageKind: "icon" },
    { title: "Critical Care High Tech ICU", description: "Advanced critical care with continuous monitoring and round-the-clock clinical support.", icon: "critical-care", image: "/images/facilities/critical-care-icu.png", imageAlt: "Anand Hospital critical care team in the high-tech ICU" },
  ] },
  { title: "Patient Care Services", tone: "green", items: [
    { title: "Health Checkups", description: "Preventive health packages tailored for individuals and families.", icon: "health-checkup", image: "/images/facilities/health-checkups-ot.png", imageAlt: "Anand Hospital operation theatre" },
    { title: "Diet & Nutrition", description: "Personalized diet plans for better health and wellness.", icon: "diet-and-nutrition", image: "/icons/set-2/diet-and-nutrition.svg", imageAlt: "Diet and nutrition guidance", imageKind: "icon" },
    { title: "Deluxe Room", description: "Comfortable private rooms designed for a restful recovery.", icon: "deluxe-beds", image: "/images/facilities/deluxe-room.png", imageAlt: "Anand Hospital deluxe patient room" },
    { title: "Home Care", description: "Professional medical care in the comfort of your home.", icon: "home-care", image: "/images/facilities/home-care.png", imageAlt: "Anand Hospital patient care room" },
    { title: "Reception Area", description: "A welcoming reception team to guide patients and families.", icon: "hospital-set-3", image: "/images/facilities/reception-area.png", imageAlt: "Anand Hospital reception area" },
    { title: "Ayushman Card Facility Available", description: "Ayushman Bharat card support is available for eligible patients.", icon: "ayushman", image: "/images/facilities/ayushman-card-facility.png", imageAlt: "Ayushman Card facility at Anand Hospital" },
  ] },
];

const specialtyCardCopy: Partial<Record<(typeof services)[number]["slug"], { name?: string; description?: string }>> = {
  pediatrics: { name: "Pediatrics" },
  anaesthesiology: { description: "Safe and effective anaesthesia care for all surgical procedures." },
};

const specialtyCardIcons: Partial<Record<(typeof services)[number]["slug"], IconName>> = {
  pediatrics: "service-baby",
  "obstetrics-gynaecology": "service-woman",
};

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
          {services.map((item) => {
            const cardCopy = specialtyCardCopy[item.slug];
            return <article id={item.slug} key={item.name}>
              <Icon name={specialtyCardIcons[item.slug] ?? item.icon} />
              <h2>{cardCopy?.name ?? item.name}</h2>
              <p>{cardCopy?.description ?? item.description}</p>
              <Link href={`/services/${item.slug}`}>Learn More <Icon name="arrow" /></Link>
            </article>;
          })}
        </div>
      </section>

      <section className="services-emergency">
        <div className="container services-emergency-inner">
          <Icon name="siren" />
          <div><h2>Emergency Care — Available 24x7</h2><p>Our emergency team is always ready to provide immediate care when you need it the most.</p></div>
          <a href="tel:+917351028221"><Icon name="phone" /><span>Call Emergency<strong>+91 7351028221</strong></span></a>
        </div>
      </section>

      <section className="services-facilities">
        <div className="container services-facility-groups">
          {facilityGroups.map((group) => <div className={`services-facility-group ${group.tone}`} key={group.title}>
            <h2>{group.title}</h2>
            <div>{group.items.map((item) => <article key={item.title}>
              <div className={`services-facility-image${item.imageKind === "icon" ? " services-facility-image--icon" : ""}`}><Image src={item.image} alt={item.imageAlt} width={1448} height={1086} /><Icon name={item.icon} /></div>
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
