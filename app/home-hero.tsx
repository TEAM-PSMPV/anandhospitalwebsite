import Link from "next/link";
import Image from "next/image";

export function HomeHero() {
  return (
    <section className="home-hero" aria-label="Anand Hospital medical team">
      <div className="hero-media">
        <Image
          className="hero-image-desktop"
          src="/images/anand-hospital-hero-1910x681.png"
          alt="Anand Hospital medical team"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <Image
          className="hero-image-mobile"
          src="/images/mobile-hero-banner.png"
          alt="Dr Subhash and Dr Nidhi of Anand Hospital"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
      </div>
      <div className="container">
        <div className="hero-content">
          <h1>Personalized Expert care.</h1>
          <div className="hero-actions">
            <Link className="button button-white" href="/doctors">
              Find a Doctor
            </Link>
            <Link className="button button-outline" href="/appointment">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
