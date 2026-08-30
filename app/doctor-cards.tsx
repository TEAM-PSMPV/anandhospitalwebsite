"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { doctors } from "./data";
import { Icon } from "./site-shell";

function StandardDoctorCard({ doctor, index }: { doctor: (typeof doctors)[number]; index: number }) {
  return <article className={"featured" in doctor && doctor.featured ? "featured-doctor" : ""}><div className="doctor-avatar">{"photo" in doctor && doctor.photo ? <Image src={doctor.photo} alt={doctor.name} width={1122} height={1402} /> : <Icon name="doctors" />}<span>0{index + 1}</span></div><div><small>{doctor.department}</small><h3>{doctor.name}</h3><p><b>Qualifications:</b> {doctor.qualification}</p><p><b>Experience:</b> {doctor.experience}</p><span>{doctor.role}</span></div></article>;
}

function CompactDoctorCard({ doctor }: { doctor: (typeof doctors)[number] }) {
  return <article className="doctor-profile-card">
    <Image unoptimized src={doctor.photo} alt={doctor.name} width={120} height={120} sizes="120px" style={{ width: 120, height: 120, minWidth: 120, maxWidth: 120, minHeight: 120, maxHeight: 120, borderRadius: "50%", objectFit: "cover", objectPosition: "center top" }} />
    <h3>{doctor.name}</h3><small>{doctor.department}</small>
    <div className="doctor-profile-details"><p><b>Qualifications:</b> {doctor.qualification}</p><p><b>Experience:</b> {doctor.experience}</p></div>
    <div className="doctor-profile-stars" aria-hidden="true">★★★★★</div>
    <Link href="/appointment">Book Appointment</Link>
  </article>;
}

export function DoctorCards({ compactRemainder = false, compactAll = false, carousel = false }: { compactRemainder?: boolean; compactAll?: boolean; carousel?: boolean }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const slideDoctors = (direction: -1 | 1) => {
    const viewport = carouselRef.current;
    const track = viewport?.querySelector<HTMLElement>(".doctor-carousel-track");
    const card = track?.querySelector<HTMLElement>(".doctor-profile-card");
    if (!viewport || !track || !card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardsPerStep = card.offsetWidth > viewport.clientWidth * 0.75 ? 1 : 2;
    viewport.scrollBy({ left: direction * (card.offsetWidth + gap) * cardsPerStep, behavior: "smooth" });
  };

  if (carousel) return <div className="doctor-collection doctor-collection--profiles doctor-carousel">
    <button className="doctor-carousel-arrow doctor-carousel-arrow--previous" type="button" aria-label="Show previous doctors" onClick={() => slideDoctors(-1)}>‹</button>
    <div className="doctor-carousel-viewport" ref={carouselRef} tabIndex={0} aria-label="Anand Hospital doctors">
      <div className="doctor-compact-grid doctor-carousel-track">{doctors.map((doctor) => <CompactDoctorCard doctor={doctor} key={doctor.name} />)}</div>
    </div>
    <button className="doctor-carousel-arrow doctor-carousel-arrow--next" type="button" aria-label="Show next doctors" onClick={() => slideDoctors(1)}>›</button>
  </div>;
  if (compactAll) return <div className="doctor-collection doctor-collection--profiles"><div className="doctor-compact-grid">{doctors.map((doctor) => <CompactDoctorCard doctor={doctor} key={doctor.name} />)}</div></div>;
  if (!compactRemainder) return <div className="doctor-grid">{doctors.map((doctor, index) => <StandardDoctorCard doctor={doctor} index={index} key={doctor.name} />)}</div>;

  return <div className="doctor-collection doctor-collection--profiles">
    <div className="doctor-grid doctor-featured-grid">{doctors.slice(0, 2).map((doctor, index) => <StandardDoctorCard doctor={doctor} index={index} key={doctor.name} />)}</div>
    <div className="doctor-compact-grid">{doctors.slice(2).map((doctor) => <CompactDoctorCard doctor={doctor} key={doctor.name} />)}</div>
  </div>;
}
