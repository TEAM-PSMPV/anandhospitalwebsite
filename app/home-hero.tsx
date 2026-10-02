import Link from "next/link";
import Image from "next/image";

export function HomeHero() {
  return (
    <section className="home-hero" aria-label="Anand Hospital medical team">
      <div className="hero-media">
        <Image
          className="hero-image-desktop"
          src="/images/herobanner.webp"
          width={1910}
          height={681}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          alt="Anand Hospital medical team"
          priority
          sizes="100vw"
        />
        <Image
          className="hero-image-mobile"
          src="/images/mobileherobanner.webp"
          width={716}
          height={1114}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          alt="Dr Subhash and Dr Nidhi of Anand Hospital"
          priority
          sizes="100vw"
        />
      </div>
      <div className="container">
        <div className="hero-content">
          <h1><span>Personalized</span><span>Expert</span><span>care.</span></h1>
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
