"use client";

import { useState } from "react";

const testimonials = [
  {
    name: "Akshay Kishor",
    text: "My sister-in-law’s delivery was performed by Dr. Nidhi. The operation was very successful, and both mother and baby are in very good health. The hospital has great facilities, the staff is very well-behaved, and everything was managed within our budget. I highly recommend Anand Hospital.",
  },
  {
    name: "Moazzam Ali",
    text: "My wife had a complicated Caesarean delivery under Dr. Nidhi Thakur. She guided us beautifully, remained supportive and explained everything transparently. The medical staff was highly supportive, and my wife had no post-surgery complications. We are very happy with the hospital’s professional and skilled doctors.",
  },
  {
    name: "Sita",
    text: "I was admitted for a rasoli operation performed by Dr. Subhash, and my operation was successful. My family has trusted Anand Hospital for years—my children were delivered here, and my husband and mother-in-law were also treated here. I strongly recommend Dr. Subhash and Anand Hospital.",
  },
  {
    name: "Lakshmi",
    text: "I brought my daughter here for a stomach operation to remove a mass of hair she had swallowed during childhood. The doctor performed the operation very well, and we are very happy and satisfied with the treatment she received.",
  },
  {
    name: "Nephew of Rufeza",
    text: "My aunt Rufeza is receiving treatment under Dr. Nidhi Thakur. Dr. Nidhi is very experienced and has a wonderful nature. My aunt is receiving very good treatment, and the staff provides excellent service. I would guide others to come here for treatment.",
  },
  {
    name: "Babita",
    text: "I underwent an operation for a uterus tumor under Dr. Nidhi Thakur. The operation went very well, and I recovered completely within 20 days. Dr. Nidhi provided excellent treatment, the staff took wonderful care of me, and the overall environment and experience were exceptionally good.",
  },
  {
    name: "Hasrun",
    text: "I am undergoing a one-month treatment to help me conceive. I am very satisfied with the treatment I am receiving from the doctors, I feel comfortable here, and the staff’s behavior is very good.",
  },
] as const;

export function PatientTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = testimonials[activeIndex];
  const showPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % testimonials.length);

  return <article className="recognition-testimonials">
    <header><h2>Patient Testimonials</h2><span>View All Testimonials <b aria-hidden="true">→</b></span></header>
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
