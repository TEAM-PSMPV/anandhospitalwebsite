import { ArrowIcon } from "./arrow-icon";
import Link from "next/link";
import Image from "next/image";
export function FacilitySlideshow() {
  return <section className="gallery-discovery"><div className="container"><div><p className="kicker">Explore our hospital</p><h2>Visit se pehle,<br />hospital ko jaan lein.</h2><p>ICU, deluxe rooms, diagnostics, reception aur care team – sab ek clean gallery mein. Apni visit ka next step confidence ke saath plan karein.</p><Link className="button button-blue" href="/gallery">Explore Hospital Gallery <ArrowIcon direction="right" /></Link></div><Link href="/gallery" aria-label="Explore Anand Hospital facilities"><Image src="/images/facilities/reception-area.webp" width={1448} height={1086} sizes="(max-width: 760px) 100vw, 50vw" alt="Anand Hospital reception and waiting area" /></Link></div></section>;
}
