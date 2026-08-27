"use client";

import Image from "next/image";
import { useState } from "react";

const facilities = [
  ["Reception Area", "/images/facilities/reception-area.png"], ["Waiting Area", "/images/facilities/waiting-area.png"],
  ["Operation Theatre", "/images/facilities/ot.png"], ["NICU", "/images/facilities/nicu.png"],
  ["Imaging Services", "/images/facilities/imaging-services.png"], ["Ward 1", "/images/facilities/ward-1.png"],
  ["Ward 2", "/images/facilities/ward-2.png"], ["Parking", "/images/facilities/parking.png"],
  ["Ayushman Card Facility", "/images/facilities/ayushman-card-facility.png"],
] as const;

export function FacilitySlideshow() {
  const [active, setActive] = useState(0);
  const move = (step: number) => setActive((active + step + facilities.length) % facilities.length);
  const [name, image] = facilities[active];
  return <section className="facility-slideshow" aria-labelledby="facilities-slideshow-title"><div className="container"><p className="kicker center">Explore Our Hospital</p><h2 id="facilities-slideshow-title">Our Facilities</h2><div className="facility-slide"><h3>{name}</h3><Image src={image} alt={name} width={1448} height={1086} /><button className="previous" onClick={() => move(-1)} aria-label="Previous facility">‹</button><button className="next" onClick={() => move(1)} aria-label="Next facility">›</button></div></div></section>;
}
