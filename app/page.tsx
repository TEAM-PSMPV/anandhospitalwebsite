import Link from "next/link";
import { Assistance, Icon, SiteShell, type IconName } from "./site-shell";
import { HomeHero } from "./home-hero";

const topActions: ReadonlyArray<{
  icon: IconName;
  title: string;
  text: string;
  href: string;
}> = [
  {
    icon: "doctors",
    title: "Find Doctor",
    text: "Search our specialists and book an appointment.",
    href: "/doctors",
  },
  {
    icon: "services",
    title: "Find Services",
    text: "Explore our healthcare services and medical specialties.",
    href: "/services",
  },
  {
    icon: "calendar",
    title: "Appointments",
    text: "Schedule your visit quickly and easily online.",
    href: "/appointment",
  },
];

const pathways: ReadonlyArray<{
  icon: "medical-care" | "live-healthy" | "questions";
  title: string;
  text: string;
  links: ReadonlyArray<readonly [string, string]>;
}> = [
  {
    icon: "medical-care",
    title: "Get care",
    text: "Comprehensive healthcare services for you and your family.",
    links: [
      ["OPD Consultation", "/doctors"],
      ["Diagnostics", "/services"],
      ["Treatment", "/services"],
    ],
  },
  {
    icon: "live-healthy",
    title: "Live Healthy",
    text: "Expert advice and resources to help you live a healthier life.",
    links: [
      ["Health Tips", "/health-library"],
      ["Wellness Programs", "/health-library"],
      ["Preventive Care", "/health-library"],
    ],
  },
  {
    icon: "questions",
    title: "Need Help ?",
    text: "We are here to assist you with any questions or concerns.",
    links: [
      ["24x7 Support", "tel:+917351028221"],
      ["Emergency Assistance", "tel:+917351028221"],
      ["Contact Us", "mailto:info@anandhospitalmbd.org"],
    ],
  },
];

const reasons: ReadonlyArray<{ icon: IconName; title: string; text: string }> =
  [
    {
      icon: "heart",
      title: "Patient-centered care",
      text: "Your health and comfort are our top priorities.",
    },
    {
      icon: "pulse",
      title: "Advanced Technology",
      text: "State-of-the-art equipment for accurate diagnosis and treatment.",
    },
    {
      icon: "doctors",
      title: "Experienced Doctors",
      text: "Highly qualified and dedicated doctors with years of expertise.",
    },
    {
      icon: "trusted-community",
      title: "Trusted by Community",
      text: "Serving the community with trust, compassion and excellence.",
    },
  ];

function QuickActionIcon({ name }: { name: "appointments" | "questions" | "feedback" }) {
  const paths = {
    appointments: <><rect x="3.5" y="5.5" width="17" height="15" rx="2" /><path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" /></>,
    questions: <><path d="M5 17.5 3.5 21l4.2-1.7a9 9 0 1 0-2.7-1.8Z" /><path d="M9.5 9a2.8 2.8 0 0 1 5.2 1.4c0 2-2.7 2.2-2.7 4M12 17.5h.01" /></>,
    feedback: <><path d="M6 4.5h9.5l3 3v12H6a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" /><path d="M15.5 4.5v3h3M8 11h6M8 14h6M8 17h3" /></>,
  } as const;

  return <svg className="quick-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function CareFeatureIcon({ name }: { name: "infrastructure" | "affordable" | "personalised" }) {
  const paths = {
    infrastructure: <><path d="M4 21V5h10v16M14 9h6v12M2 21h20" /><path d="M7 8h2M7 12h2M7 16h2M17 12h1M17 16h1" /></>,
    affordable: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 9h.01M18 15h.01M5 21h14" /></>,
    personalised: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="9" r="3" /><path d="M6.8 18c1.1-2.7 2.8-4 5.2-4s4.1 1.3 5.2 4" /></>,
  } as const;

  return <svg className="care-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  return (
    <SiteShell>
      <div className="home-page">
        <HomeHero />

        <section className="home-services" aria-label="Hospital actions">
          <div className="container service-tiles">
            {topActions.map((action) => (
              <Link
                href={action.href}
                className="service-tile"
                key={action.title}
              >
                <Icon name={action.icon} />
                <span>
                  <strong>{action.title}</strong>
                  <small>{action.text}</small>
                </span>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </section>

        <section className="care-feature">
          <div className="container care-grid">
            <div
              className="care-image"
              role="img"
              aria-label="Anand Hospital waiting area and reception desk"
            />
            <div>
              <p className="kicker">We Are Here For You</p>
              <h2>
                Get the care you need,
                <br />
                from people you can trust.
              </h2>
              <p>
                At Anand Hospital, we combine advanced technology with
                compassionate care to ensure the best possible outcomes for our
                patients and their families.
              </p>
              <ul className="check-list">
                <li><CareFeatureIcon name="infrastructure" />Modern Infrastructure</li>
                <li><CareFeatureIcon name="affordable" />Affordable Treatment</li>
                <li><CareFeatureIcon name="personalised" />Personalised Care</li>
              </ul>
              <Link className="button button-blue" href="/services">
                Get Help <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </section>

        <section className="pathways">
          <div className="container pathway-grid">
            {pathways.map((path) => (
              <article key={path.title}>
                <Icon name={path.icon} />
                <div className="pathway-copy">
                  <h2>{path.title}</h2>
                  <p>{path.text}</p>
                </div>
                <div className="pathway-links">
                  {path.links.map(([label, href]) => (
                    <Link href={href} key={label}>
                      {label}
                      <Icon name="arrow" />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="why">
          <div className="container">
            <h2>Why Anand Hospital ?</h2>
            <div className="why-grid">
              {reasons.map((reason) => (
                <article key={reason.title}>
                  <Icon name={reason.icon} />
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <div className="container">
            <Link href="/appointment">
              <QuickActionIcon name="appointments" />
              <span>
                <strong>Appointments</strong>
                <small>Book your visit online</small>
              </span>
            </Link>
            <Link href="/search">
              <QuickActionIcon name="questions" />
              <span>
                <strong>Questions ?</strong>
                <small>Find answers to common queries</small>
              </span>
            </Link>
            <Link href="/about">
              <QuickActionIcon name="feedback" />
              <span>
                <strong>Feedbacks</strong>
                <small>Share your feedback to help us improve</small>
              </span>
            </Link>
          </div>
        </section>

        <Assistance />
      </div>
    </SiteShell>
  );
}
