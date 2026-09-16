import Link from "next/link";
import Image from "next/image";

export function HomeHero() {
  return (
    <section className="home-hero" aria-label="Anand Hospital medical team">
      <div className="hero-media">
        <Image
          className="hero-image-desktop"
          src="/images/herobanner.jpg"
          alt="Anand Hospital medical team"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <Image
          className="hero-image-mobile"
          src="/images/mobileherobanner.jpg"
          alt="Dr Subhash and Dr Nidhi of Anand Hospital"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
      </div>
      <div className="container">
        <div className="hero-content">
          <p className="hero-eyebrow">Anand Hospital · Moradabad</p>
          <h1>Laparoscopic Surgery and Women’s Healthcare in Moradabad</h1>
          <p className="hero-summary">Experienced surgical, maternity and emergency care at Anand Hospital, Rampur Road <span aria-hidden="true">|</span> Open 24×7.</p>
          <div className="hero-actions">
            <Link className="button button-white" href="/appointment">
              Book an Appointment
            </Link>
            <a className="button button-emergency" href="tel:+917351028221">Call Emergency</a>
            <a className="button button-outline" href="https://maps.google.com/?q=Anand+Hospital+Near+Miglani+Cinema+Rampur+Road+Moradabad+244001" target="_blank" rel="noreferrer">Get Directions</a>
          </div>
          <div className="hero-proof" aria-label="Why patients choose Anand Hospital">
            <ul>
              <li>Established in 2007</li>
              <li>24×7 emergency care</li>
              <li>Ayushman Bharat facility</li>
              <li>Dr Subhash Singh <span>|</span> General and Laparoscopic Surgery</li>
              <li>Dr Nidhi Thakur <span>|</span> 20+ years in Obstetrics and Gynaecology</li>
            </ul>
            <a className="hero-rating" href="https://share.google/iSBgE0dQM37FTrLed" target="_blank" rel="noreferrer" aria-label="View Anand Hospital's verified 4.6 rating from 229 Google reviews">
              <span className="hero-rating-stars" aria-hidden="true">★★★★★</span>
              <strong>4.6</strong>
              <span>Verified Google rating · 229 reviews</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
