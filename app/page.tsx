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
  icon: IconName;
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
                <li>Modern Infrastructure</li>
                <li>Affordable Treatment</li>
                <li>Personalised Care</li>
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
              <Icon name="calendar" />
              <span>
                <strong>Appointments</strong>
                <small>Book your visit online</small>
              </span>
            </Link>
            <Link href="/search">
              <Icon name="questions" />
              <span>
                <strong>Questions ?</strong>
                <small>Find answers to common queries</small>
              </span>
            </Link>
            <Link href="/about">
              <Icon name="feedback" />
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
