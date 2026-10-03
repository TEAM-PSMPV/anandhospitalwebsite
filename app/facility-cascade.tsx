"use client";

import { ArrowIcon } from "./arrow-icon";

import Link from "next/link";
import { useState } from "react";
import { galleryPhotos } from "./gallery-data";
import { GalleryPhoto } from "./gallery-photo";

export function FacilityCascade({ group }: { group: "icu" | "deluxe" }) {
  const photos = galleryPhotos.filter((photo) => photo.group === group);
  const [active, setActive] = useState(0);
  const photo = photos[active];
  const label = group === "icu" ? "ICU" : "deluxe room";
  const move = (step: number) => setActive((current) => (current + step + photos.length) % photos.length);
  return <div className="facility-cascade" aria-roledescription="carousel" aria-label={`${label} photographs`} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}>
    <div className="facility-cascade-stage"><button className="award-arrow" type="button" aria-label={`Previous ${label} photograph`} onClick={() => move(-1)}><ArrowIcon direction="previous" /></button><div className="award-cascade"><div className="award-cascade-back second" aria-hidden="true" /><div className="award-cascade-back first" aria-hidden="true" /><Link className="award-cascade-front" key={photo.id} href={`/gallery#${group}`} aria-label={`Explore ${label} photographs in the gallery`}><GalleryPhoto photo={photo} /></Link></div><button className="award-arrow" type="button" aria-label={`Next ${label} photograph`} onClick={() => move(1)}><ArrowIcon direction="next" /></button></div>
    <div className="facility-cascade-bottom"><span aria-live="polite">{active + 1} / {photos.length}</span><Link href={`/gallery#${group}`}>Explore Gallery <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div>
  </div>;
}
