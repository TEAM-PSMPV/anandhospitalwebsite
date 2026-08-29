"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties, type ReactNode, type SVGProps } from "react";
import { services as hospitalServices } from "./data";

export type IconName =
  | "home" | "info" | "services" | "doctors" | "library" | "calendar" | "search"
  | "menu" | "arrow" | "heart" | "shield" | "pulse" | "phone" | "target"
  | "eye" | "star" | "learning" | "community" | "check" | "location" | "mail" | "clock"
  | "medical-care" | "live-healthy" | "questions" | "feedback"
  | "emergency" | "general-medicine" | "general-surgery" | "pediatrics" | "obstetrics"
  | "urology" | "anesthesia" | "critical-care" | "path-lab" | "ultrasound" | "pharmacy"
  | "blood-bank" | "health-checkup" | "diet-and-nutrition" | "deluxe-beds" | "home-care"
  | "a-female-doctor" | "alcohol-disinfection" | "doctor-set-3" | "hospital-set-3" | "male-doctor"
  | "medical-examination-female" | "medical-examination-male" | "thermometer" | "trusted-community" | "holding-hands"
  | "ayushman";

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const suppliedIcons: Partial<Record<IconName, string>> = {
    home: "home.svg", info: "about-us.svg", services: "services.svg", doctors: "doctor.svg",
    library: "health-library.svg", calendar: "calendar.svg", search: "search.svg",
    heart: "patient-centered-care.svg", pulse: "advanced-technology.svg",
    community: "people-community.svg", learning: "health-library.svg",
    "medical-care": "medical-care.svg", "live-healthy": "live-healthy.svg",
    questions: "questions.svg", feedback: "feedback.svg",
    emergency: "set-2/emergency.svg", "general-medicine": "set-2/general-medicine.svg",
    "general-surgery": "set-2/general-surgery.svg", pediatrics: "set-2/pediatrics.svg",
    obstetrics: "set-2/obstetrics.svg", urology: "set-2/urology.svg",
    anesthesia: "set-2/anesthesia.svg", "critical-care": "set-2/critical-care.svg",
    "path-lab": "set-2/path-lab.svg", ultrasound: "set-2/ultrasound.svg",
    pharmacy: "set-2/pharmacy.svg", "blood-bank": "set-2/blood-bank.svg",
    "health-checkup": "set-2/health-checkup.svg", "diet-and-nutrition": "set-2/diet-and-nutrition.svg",
    "deluxe-beds": "set-2/deluxe-beds.svg", "home-care": "set-2/home-care.svg",
    phone: "set-2/call.svg", mail: "set-2/email.svg", location: "set-2/location.svg",
    clock: "set-2/open24hours.svg",
    "a-female-doctor": "set-3/a-female-doctor-wearing-a-surgical-gown-svgrepo-com.svg",
    "alcohol-disinfection": "set-3/alcohol-disinfection-svgrepo-com.svg",
    "doctor-set-3": "set-3/doctor-svgrepo-com.svg", "hospital-set-3": "set-3/hospital.svg",
    "male-doctor": "set-3/male-doctor-wearing-surgical-gown-svgrepo-com.svg",
    "medical-examination-female": "set-3/medical-examination-female-svgrepo-com.svg",
    "medical-examination-male": "set-3/medical-examination-male-svgrepo-com.svg",
    thermometer: "set-3/thermometer-svgrepo-com.svg", "trusted-community": "set-3/trustedbycommunity.svg",
    "holding-hands": "set-3/various-races-holding-hands-svgrepo-com.svg",
    ayushman: "set-3/Ayushman-Bharat-Black.svg",
  };
  const suppliedIcon = suppliedIcons[name];
  if (suppliedIcon) {
    const { className, style } = props;
    return <span className={`site-icon${className ? ` ${className}` : ""}`} style={{ ...style, "--icon-url": `url(/icons/${suppliedIcon})` } as CSSProperties} aria-hidden="true" />;
  }
  const p = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...props };
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8M5.5 9.5V21h13V9.5M9 21v-7h6v7" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></>,
    services: <><circle cx="9" cy="7" r="3" /><path d="M3.5 19c.5-4 2.3-6 5.5-6 2 0 3.4.8 4.3 2.4M17 13l-4.5 4.5 4 4L21 17l-1.5-1.5-2 2-1-1 2-2Z" /></>,
    doctors: <><path d="M4 8h16v12H4zM8 8V5h8v3M9 14h6M12 11v6" /></>,
    library: <><circle cx="12" cy="7" r="3" /><path d="M5 20c.7-4.4 3-6.5 7-6.5s6.3 2.1 7 6.5M8 15l4 3 4-3" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M12 14c-2-2-5 1-2 4l2 2 2-2c3-3 0-6-2-4Z" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    heart: <><path d="M20 5c-2-2-5-2-8 1-3-3-6-3-8-1-3 3-1 7 2 10l6 6 6-6c3-3 5-7 2-10Z" /></>,
    shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></>,
    pulse: <><path d="M3 12h4l2-5 4 10 2-5h6" /></>,
    phone: <><path d="M7 3 4.5 5.5c-.8.8.4 4.4 3.5 7.5s6.7 4.3 7.5 3.5L18 14l-4-2-1.5 1.5c-1-.4-2.6-2-3-3L11 9 9 5Z" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="m14 10 6-6" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    star: <><path d="m12 3 2.4 5 5.6.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.8Z" /></>,
    learning: <><path d="M4 17V7l8-3 8 3v10l-8 3-8-3Z" /><path d="M8 9h8M8 12h6" /></>,
    community: <><circle cx="12" cy="8" r="3" /><circle cx="5" cy="10" r="2" /><circle cx="19" cy="10" r="2" /><path d="M7 20c0-4 1.7-6 5-6s5 2 5 6M2 19c0-2.7 1-4 3-4M22 19c0-2.7-1-4-3-4" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 7 8-7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></>,
    "medical-care": null,
    "live-healthy": null,
    questions: null,
    feedback: null,
    emergency: null,
    "general-medicine": null,
    "general-surgery": null,
    pediatrics: null,
    obstetrics: null,
    urology: null,
    anesthesia: null,
    "critical-care": null,
    "path-lab": null,
    ultrasound: null,
    pharmacy: null,
    "blood-bank": null,
    "health-checkup": null,
    "diet-and-nutrition": null,
    "deluxe-beds": null,
    "home-care": null,
    "a-female-doctor": null, "alcohol-disinfection": null, "doctor-set-3": null, "hospital-set-3": null,
    "male-doctor": null, "medical-examination-female": null, "medical-examination-male": null,
    thermometer: null, "trusted-community": null, "holding-hands": null, ayushman: null,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

const nav = [
  ["home", "Home", "/"], ["info", "About Us", "/about"], ["services", "Services", "/services"],
  ["doctors", "Doctors", "/doctors"], ["library", "Health Library", "/health-library"],
  ["calendar", "Book Appointment", "/appointment"], ["search", "Search", "/search"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const closeNavigation = () => { setOpen(false); setServicesOpen(false); };
  return <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <header className="site-header">
      <div className="header-inner container-wide">
        <Link className="brand" href="/" aria-label="Anand Hospital home">
          <Image src="/brand/anand-hospital-logo.svg" width={160} height={136} alt="Anand Hospital" priority />
        </Link>
        <nav className={`${open ? "nav is-open" : "nav"}${servicesOpen ? " services-view" : ""}`} aria-label="Main navigation">
          {nav.map(([icon, label, href]) => label === "Services" ? <div className={servicesOpen ? "nav-services is-open" : "nav-services"} key={label}>
            <button className={pathname.startsWith("/services") ? "active" : ""} type="button" aria-expanded={servicesOpen} aria-controls="services-navigation-menu" onClick={() => setServicesOpen((current) => !current)}><Icon name={icon} /><span className="nav-services-label"><span>{label}</span><Image className="nav-dropdown-arrow" src="/icons/set-3/dropdown-arrow.svg" width={16} height={16} alt="" /></span></button>
            <div className="services-menu" id="services-navigation-menu"><div className="services-menu-list"><p>Services &amp; Specialty Areas</p>{hospitalServices.map((service) => <Link href={`/services/${service.slug}`} key={service.slug} onClick={closeNavigation}>{service.shortName}</Link>)}<Link className="services-menu-all" href="/services" onClick={closeNavigation}>See all Services</Link></div><div className="services-menu-art"><Image src="/images/facilities/reception-area.png" width={1448} height={1086} alt="Anand Hospital reception area" /></div></div>
          </div> : <Link className={pathname === href ? "active" : ""} href={href} key={label} onClick={closeNavigation}><Icon name={icon} /><span>{label}</span></Link>)}
        </nav>
        <button className={open ? "menu-button is-open" : "menu-button"} type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => { setOpen((current) => !current); setServicesOpen(false); }}>{open ? <svg className="menu-close-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg> : <Icon name="menu" />}</button>
      </div>
    </header>
    <main id="main">{children}</main>
    <SocialStrip />
    <Footer />
  </>;
}

function SocialStrip() {
  const links = [
    ["LinkedIn", "https://www.linkedin.com/search/results/companies/?keywords=Anand%20Hospital%20Moradabad", "/icons/set-4/linkedin.svg"],
    ["Instagram", "https://www.instagram.com/anandhospital.mbd/", "/icons/set-4/instagram.svg"],
    ["Facebook", "https://www.facebook.com/search/top?q=anand%20hospital%20moradabad", "/icons/set-4/facebook.svg"],
    ["YouTube", "https://www.youtube.com/results?search_query=Anand+Hospital+Moradabad", "/icons/set-4/youtube.svg"],
  ] as const;
  return <aside className="social-strip" aria-label="Anand Hospital social media"><div className="container"><nav>{links.map(([name, href, icon]) => <a href={href} target="_blank" rel="noreferrer" aria-label={`Anand Hospital on ${name}`} key={name}><Image src={icon} width={36} height={36} alt="" /></a>)}</nav></div></aside>;
}

function Footer() {
  const footerGroups = [
    { title: "Actions", links: [["Home", "/"], ["About Us", "/about"], ["Doctors & Departments", "/doctors"], ["Health Library", "/health-library"], ["Book Appointment", "/appointment"], ["Contact Us", "mailto:info@anandhospitalmbd.org"]] },
    { title: "Doctors & Departments", links: [["General Medicine", "/services#general-medicine"], ["General surgery", "/services#general-surgery"], ["Pediatrics", "/services#pediatrics"], ["RMO", "/doctors"], ["Anesthesiology", "/services#anesthesiology"], ["Urology", "/services#urology"], ["Obs & Gynaecology", "/services#obstetrics-gynaecology"]] },
    { title: "Health Library", links: [["Health Tips", "/health-library"], ["Disease Guide", "/health-library"], ["Nutrition", "/health-library"], ["Wellness", "/health-library"]] },
    { title: "Patient Information", links: [["Insurance", "/about"], ["Health Packages", "/services"], ["Patient Testimonials", "/about"], ["FAQs", "/about#faq"], ["Privacy Policy", "/about"], ["Terms & Conditions", "/about"]] },
  ] as const;

  return <footer className="site-footer">
    <div className="footer-main">
      <div className="container-wide footer-grid">
        <div className="footer-brand">
          <Link className="footer-logo" href="/" aria-label="Anand Hospital home">
            <Image src="/brand/anand-hospital-footer-logo.webp" width={320} height={320} alt="Anand Hospital" />
          </Link>
          <p>Providing compassionate, affordable and quality healthcare for families in Moradabad. Your health and well-being are our top priority.</p>
        </div>
        {footerGroups.map((group) => <nav className="footer-links" aria-label={group.title} key={group.title}><h2>{group.title}</h2>{group.links.map(([label, href]) => <Link href={href} key={label}><span aria-hidden="true">›</span>{label}</Link>)}</nav>)}
      </div>
    </div>
    <div className="footer-contact">
      <div className="container-wide footer-contact-grid">
        <a href="https://maps.google.com/?q=Anand+Hospital+Near+Miglani+Cinema+Rampur+Road+Moradabad+244001" target="_blank" rel="noreferrer"><Icon name="location" /><span>Near Miglani Cinema, Rampur Road,<br />Moradabad [244001]</span></a>
        <a href="tel:+917351028221" aria-label="Call Anand Hospital"><Icon name="phone" /></a>
        <a href="mailto:info@anandhospitalmbd.org"><Icon name="mail" /><span>info@anandhospitalmbd.org</span></a>
        <div><Icon name="clock" /><span>Open 24x7</span></div>
      </div>
    </div>
    <div className="footer-copyright">Estb. in 2007 · Copyright © 2007-2026 Anand Hospital. All rights reserved.</div>
  </footer>;
}

export function InteriorHero({ title, text }: { title: string; text: string }) {
  return <section className="interior-hero"><div className="container"><h1>{title}</h1><p>{text}</p></div></section>;
}

export function Assistance() {
  return <section className="cta-wrap"><div className="container cta">
    <div className="cta-copy"><span className="cta-photo" aria-hidden="true" /><div><h2>Need Medical Assistance?</h2><p>Book an Appointment Today</p></div></div>
    <div className="cta-actions"><Link className="button button-white" href="/appointment">Book Appointment</Link><a className="button button-outline" href="tel:+917351028221">Call Hospital <Icon name="phone" /></a></div>
  </div></section>;
}
