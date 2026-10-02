import Link from "next/link";
import { SiteShell } from "../site-shell";
import { Breadcrumbs, createPageMetadata, siteUrl } from "../seo";
import { galleryPhotos } from "../gallery-data";
import { awards } from "../awards-data";
import { doctors } from "../data";
import { GalleryCollection } from "../gallery-collection";
import type { GalleryItem } from "../gallery-photo";
import { CareConfidence } from "../care-confidence";

export const metadata = createPageMetadata({ title: "Hospital Gallery | ICU & Deluxe Rooms in Moradabad", description: "Explore Anand Hospital ICU, deluxe rooms, facilities, medical team and awards. Ayushman Card support for eligible patients in Moradabad.", path: "/gallery", keywords: ["Anand Hospital gallery", "ICU hospital in Moradabad", "deluxe hospital rooms Moradabad", "Ayushman hospital in Moradabad"] });
const groups = [
  { id: "icu", title: "ICU & wards", text: "Monitoring facilities aur round-the-clock hospital support. Aapki care needs ke hisaab se clinical team admission plan karti hai." },
  { id: "deluxe", title: "Deluxe rooms", text: "Recovery ke dauraan comfort aur personal space. Availability aur room charges reception se confirm karein." },
  { id: "facilities", title: "Inside Anand Hospital", text: "Reception se diagnostics tak — hospital ki facilities ko apni visit se pehle dekhein." },
  { id: "team", title: "People behind your care", text: "Experienced specialists aur hospital team, patients aur families ke saath." },
  { id: "awards", title: "Awards & continued learning", text: "Professional recognition, service appreciation aur continued medical education. Full details ke liye awards collection dekhein." },
];
const doctorPhotos: GalleryItem[] = doctors.map((doctor) => ({ id: doctor.name, group: "team", title: doctor.name, description: doctor.role, src: doctor.photo, avif: doctor.photo.replace(/\.(png|webp)$/, ".avif"), thumbnail: doctor.photo, width: 1122, height: 1402 }));
const awardPhotos: GalleryItem[] = awards.flatMap((award) => award.images.map((photo, index) => ({ ...photo, thumbnailAvif: photo.thumbnail.replace(/\.webp$/, ".avif"), id: `${award.id}-${index}`, group: "awards", title: `${award.title} — view ${index + 1}`, description: award.group === "other" ? "Recipient unconfirmed; displayed in the additional awards collection." : `${award.recipient} · ${award.issuer}` })));
const photos: GalleryItem[] = [...galleryPhotos, ...doctorPhotos, ...awardPhotos];
export default function Gallery() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Anand Hospital Gallery", url: `${siteUrl}/gallery`, hasPart: photos.map((photo) => ({ "@type": "ImageObject", contentUrl: `${siteUrl}${photo.src}`, name: photo.title, caption: photo.description, width: photo.width, height: photo.height })) };
  return <SiteShell><Breadcrumbs items={[{ name: "Gallery", href: "/gallery" }]} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="hospital-gallery-hero"><div className="container"><p className="kicker">Get to know your hospital</p><h1>Care ki jagah.<br /><span>Bharose ka ehsaas.</span></h1><div className="gallery-hero-bottom"><p>Anand Hospital ko andar se dekhein — ICU, deluxe rooms, facilities aur aapki care ke peeche ki team. Near Miglani Cinema, Rampur Road, Moradabad.</p><Link className="button button-blue" href="/appointment">Apni visit plan karein →</Link></div><nav aria-label="Gallery collections">{groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.title}<span>{photos.filter((photo) => photo.group === group.id).length}</span></a>)}</nav></div></section>
    <CareConfidence />
    {groups.map((group) => <section className="hospital-gallery-collection" id={group.id} key={group.id}><div className="container"><header><div><p className="kicker">Hospital gallery</p><h2>{group.title}</h2><p>{group.text}</p></div>{group.id === "awards" && <Link className="button button-outline" href="/awards">Award details →</Link>}</header><GalleryCollection label={group.title} photos={photos.filter((photo) => photo.group === group.id)} /></div></section>)}
    <section className="gallery-next-step"><div className="container"><div><p className="kicker">We’re here to help</p><h2>Ab apni care ka next step lein.</h2><p>Doctor availability, rooms aur Ayushman coverage ke liye hospital team se baat karein.</p></div><div><Link className="button button-blue" href="/appointment">Request Appointment</Link><a className="button button-outline" href="tel:+917351028221">Call +91 73510 28221</a></div></div></section>
  </SiteShell>;
}
