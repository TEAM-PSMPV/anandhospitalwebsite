import Link from "next/link";

const desktopAvif = "/images/optimized/hero-desktop-640.avif 640w, /images/optimized/hero-desktop-960.avif 960w, /images/optimized/hero-desktop-1280.avif 1280w, /images/optimized/hero-desktop-1600.avif 1600w, /images/optimized/hero-desktop-1910.avif 1910w";
const mobileAvif = "/images/optimized/hero-mobile-360.avif 360w, /images/optimized/hero-mobile-480.avif 480w, /images/optimized/hero-mobile-640.avif 640w, /images/optimized/hero-mobile-716.avif 716w";
const desktopSizes = "(min-width: 992px) 82vw, 100vw";

export function HomeHero() {
  return (
    <section className="home-hero" aria-label="Anand Hospital medical team">
      <link rel="preload" as="image" type="image/avif" media="(max-width: 768px)" imageSrcSet={mobileAvif} imageSizes="100vw" fetchPriority="high" />
      <link rel="preload" as="image" type="image/avif" media="(min-width: 769px)" imageSrcSet={desktopAvif} imageSizes={desktopSizes} fetchPriority="high" />
      <div className="hero-media">
        <picture>
          <source media="(max-width: 768px)" type="image/avif" srcSet={mobileAvif} sizes="100vw" />
          <source media="(max-width: 768px)" type="image/webp" srcSet="/images/optimized/hero-mobile-360.webp 360w, /images/optimized/hero-mobile-480.webp 480w, /images/optimized/hero-mobile-640.webp 640w, /images/optimized/hero-mobile-716.webp 716w" sizes="100vw" />
          <source type="image/avif" srcSet={desktopAvif} sizes={desktopSizes} />
          <img
            className="hero-image-desktop hero-image-mobile hero-responsive-image"
            src="/images/optimized/hero-desktop-1910.webp"
            srcSet="/images/optimized/hero-desktop-640.webp 640w, /images/optimized/hero-desktop-960.webp 960w, /images/optimized/hero-desktop-1280.webp 1280w, /images/optimized/hero-desktop-1600.webp 1600w, /images/optimized/hero-desktop-1910.webp 1910w"
            sizes={desktopSizes}
            width={1910}
            height={681}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            alt="Anand Hospital medical team"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
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
