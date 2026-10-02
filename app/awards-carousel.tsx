"use client";

import { useState } from "react";
import Link from "next/link";
import { awards } from "./awards-data";
import { AwardPhoto } from "./award-image";

export function AwardsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const move = (step: number) => setActiveIndex((current) => (current + step + awards.length) % awards.length);
  const award = awards[activeIndex];
  return <article className="recognition-awards" aria-roledescription="carousel" aria-label="Awards and felicitations">
    <header className="awards-carousel-heading"><h2>Awards &amp; Felicitations</h2><Link href="/awards">View All <b aria-hidden="true">→</b></Link></header>
    <div className="awards-carousel-stage" onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}>
      <button className="award-arrow" type="button" aria-label="Previous award" onClick={() => move(-1)}>‹</button>
      <div className="award-cascade">
        <div className="award-cascade-back second" aria-hidden="true" />
        <div className="award-cascade-back first" aria-hidden="true" />
        <Link className="award-cascade-front" key={award.id} href={`/awards#${award.id}`} aria-label={`View ${award.title}`}><AwardPhoto image={award.images[0]} alt={`${award.title} — ${award.group === "other" ? "recipient unconfirmed" : award.recipient}`} thumbnail /></Link>
      </div>
      <button className="award-arrow" type="button" aria-label="Next award" onClick={() => move(1)}>›</button>
    </div>
    <div className="award-carousel-caption" aria-live="polite" aria-atomic="true"><h3>{award.title}</h3><p>{award.group === "other" ? "Other awards and felicitations · Recipient unconfirmed" : award.recipient}</p><small>{activeIndex + 1} / {awards.length}</small></div>
    <div className="award-carousel-dots" aria-label="Choose an award">{awards.map((item, index) => <button type="button" key={item.id} aria-label={`Show ${item.title} (${item.id})`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => setActiveIndex(index)} />)}</div>
  </article>;
}
