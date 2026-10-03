import Link from "next/link";
import { awards } from "../awards-data";
import { AwardPhoto } from "../award-image";
import { Assistance, SiteShell } from "../site-shell";
import { Breadcrumbs, createPageMetadata, siteUrl, surgeryKeywords, womensHealthKeywords } from "../seo";

export const metadata = createPageMetadata({ title: "Awards & Felicitations | Anand Hospital Moradabad", description: "Explore awards, felicitations, fellowships and course certificates of Dr Nidhi Thakur and Dr Subhash Singh at Anand Hospital, Moradabad.", path: "/awards", keywords: [...surgeryKeywords, ...womensHealthKeywords] });

const groups = [
  { id: "nidhi", title: "Dr Nidhi Thakur", description: "Awards, appreciation and continued learning in women’s health.", profile: "/doctors/dr-nidhi-thakur" },
  { id: "subhash", title: "Dr Subhash Singh", description: "Professional recognition, fellowships and continued medical learning.", profile: "/doctors/dr-subhash-singh" },
  { id: "other", title: "Other awards and felicitations", description: "These photographs do not identify a recipient, so they are displayed separately from the doctors’ collections.", profile: null },
] as const;

function formatDate(value: string | null) {
  if (!value) return null;
  return value.replace(/\d{4}-\d{2}-\d{2}/g, (date) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${date}T00:00:00Z`)));
}

export default function AwardsPage() {
  const structuredData = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${siteUrl}/awards#collection`, url: `${siteUrl}/awards`, name: "Awards and Felicitations at Anand Hospital", about: groups.filter((group) => group.profile).map((group) => ({ "@type": "Person", name: group.title, url: `${siteUrl}${group.profile}` })), hasPart: awards.map((award) => ({ "@type": "CreativeWork", name: award.title, description: award.details, url: `${siteUrl}/awards#${award.id}`, image: `${siteUrl}${award.images[0].src}` })) };
  return <SiteShell>

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <section className="awards-page-hero"><div className="container"><p className="kicker">Recognition &amp; continued learning</p><h1>Awards &amp; Felicitations</h1><p>Celebrating service to the community, professional recognition and continued medical education at Anand Hospital, Moradabad.</p><nav aria-label="Award collections">{groups.map((group) => <a key={group.id} href={`#${group.id}`}>{group.title} <span>{awards.filter((award) => award.group === group.id).length}</span></a>)}</nav></div></section>
<Breadcrumbs items={[{ name: "Awards & Felicitations", href: "/awards" }]} />
    {groups.map((group) => <section className="awards-collection" id={group.id} key={group.id}><div className="container"><header className="awards-collection-heading"><div><p className="kicker">{group.id === "other" ? "Additional collection" : "Our specialists"}</p><h2>{group.title}</h2><p>{group.description}</p></div>{group.profile && <Link className="button button-outline" href={group.profile}>View Doctor Profile</Link>}</header><div className="awards-gallery">{awards.filter((award) => award.group === group.id).map((award) => <article className="award-card" id={award.id} key={award.id}><a className="award-card-photo" href={award.images[0].src} target="_blank" rel="noreferrer" aria-label={`Open full photograph of ${award.title}`}><AwardPhoto image={award.images[0]} alt={`${award.title}${group.id === "other" ? "" : ` presented to ${award.recipient}`}`} /></a><div className="award-card-copy"><span className="award-kind">{award.kind}</span><h3>{award.title}</h3><p className="award-issuer">{award.issuer ?? ""}</p>{award.date && <p className="award-date">{formatDate(award.date)}</p>}<p>{award.details}</p>{award.note && <p className="award-note">{award.note}</p>}<details className="award-views"><summary>View all photographs ({award.images.length})</summary><div>{award.images.map((photo, index) => <a href={photo.src} target="_blank" rel="noreferrer" key={photo.src}><AwardPhoto image={photo} alt={`${award.title}, photograph ${index + 1}`} thumbnail /></a>)}</div></details></div></article>)}</div></div></section>)}
    <Assistance />
  </SiteShell>;
}
