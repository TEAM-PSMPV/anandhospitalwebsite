"use client";

import { useState } from "react";
import Link from "next/link";
import { patientTestimonials as testimonials } from "./testimonials-data";

export function PatientTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = testimonials[activeIndex];
  const showPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % testimonials.length);

  return <article className="recognition-testimonials">
    <header><h2>Patient Testimonials</h2><Link href="/testimonials">View All Testimonials <b aria-hidden="true">→</b></Link></header>
    <div className="testimonial-stage">
      <button type="button" aria-label="Previous testimonial" onClick={showPrevious}>‹</button>
      <blockquote aria-live="polite">“{testimonial.text}”<cite>— {testimonial.name}</cite></blockquote>
      <button type="button" aria-label="Next testimonial" onClick={showNext}>›</button>
    </div>
    <div className="testimonial-dots" aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}>
      {testimonials.map((item, index) => <button className={index === activeIndex ? "active" : ""} type="button" aria-label={`Show testimonial from ${item.name}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => setActiveIndex(index)} key={item.name} />)}
    </div>
  </article>;
}
