import Link from "next/link";
import { SiteShell } from "../site-shell";
import { Breadcrumbs, createPageMetadata, siteUrl } from "../seo";
import { galleryPhotos } from "../gallery-data";
import { GalleryCascade } from "../gallery-cascade";
import { ArrowIcon } from "../arrow-icon";

export const metadata = createPageMetadata({ title: "Hospital Gallery | ICU & Deluxe Rooms in Moradabad", description: "Explore 24 photographs of Anand Hospital ICU, wards, deluxe rooms, hospital facilities and medical team in Moradabad.", path: "/gallery", keywords: ["Anand Hospital gallery", "ICU hospital in Moradabad", "deluxe hospital rooms Moradabad", "Ayushman hospital in Moradabad"] });
const groups = [
  { id: "icu", title: "ICU & wards", text: "Explore our intensive care unit, neonatal unit and inpatient wards. The hospital team coordinates admission and monitoring around each patient’s care needs.", action: "Explore critical care", href: "/services/critical-care" },
  { id: "deluxe", title: "Space to rest. Comfort to recover.", text: "Take a look inside our deluxe rooms, with personal space for your recovery. Contact reception to confirm room availability and charges.", action: "Plan your stay", href: "/appointment" },
  { id: "facilities", title: "Inside Anand Hospital", text: "From reception and waiting areas to our operation theatre, parking and Ayushman Card facility — get familiar with the hospital before your visit.", action: "Explore our services", href: "/services" },
  { id: "team", title: "People behind your care", text: "Meet the specialists and hospital team who support patients and families at Anand Hospital, Moradabad.", action: "Meet our doctors", href: "/doctors" },
];
export default function Gallery() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Anand Hospital Gallery", url: `${siteUrl}/gallery`, hasPart: galleryPhotos.map((photo) => ({ "@type": "ImageObject", contentUrl: `${siteUrl}${photo.src}`, name: photo.title, caption: photo.description, width: photo.width, height: photo.height })) };
  return <SiteShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="hospital-gallery-hero"><div className="container"><p className="kicker">Get to know your hospital</p><h1>Care ki jagah.<br /><span>Bharose ka ehsaas.</span></h1><div className="gallery-hero-bottom"><p>Anand Hospital ko andar se dekhein — ICU, deluxe rooms, facilities aur aapki care ke peeche ki team. Near Miglani Cinema, Rampur Road, Moradabad.</p><Link className="button button-blue" href="/appointment">Apni visit plan karein <ArrowIcon /></Link></div><nav aria-label="Gallery collections">{groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.id === "deluxe" ? "Deluxe rooms" : group.title}<span>{galleryPhotos.filter((photo) => photo.group === group.id).length}</span></a>)}</nav></div></section>
    <Breadcrumbs items={[{ name: "Gallery", href: "/gallery" }]} />
    {groups.map((group, index) => <section className={`professional-gallery-section${index % 2 ? " image-first" : ""}`} id={group.id} key={group.id} aria-labelledby={`gallery-heading-${group.id}`}><div className="professional-gallery-layout"><div className="professional-gallery-copy"><h2 id={`gallery-heading-${group.id}`}>{group.title}</h2><span className="professional-gallery-rule" aria-hidden="true" /><p>{group.text}</p><Link className="button button-blue" href={group.href}>{group.action} <ArrowIcon /></Link></div><GalleryCascade label={group.id === "deluxe" ? "Deluxe rooms" : group.title} photos={galleryPhotos.filter((photo) => photo.group === group.id)} /></div></section>)}
  </SiteShell>;
}
