"use client";
import { useState } from "react";
import { InteriorHero, SiteShell } from "../site-shell";

export default function Appointment(){
  const [sent,setSent]=useState(false);
  return <SiteShell><InteriorHero title="Book an Appointment" text="Tell us what care you need and our reception team will help plan your visit."/>
  <section className="appointment viewport-section"><div className="container appointment-grid"><div><p className="kicker">Plan your visit</p><h2>We’re here to help.</h2><p>Complete the request form and the hospital reception team will contact you to confirm doctor availability.</p><div className="contact-card"><strong>Hospital access</strong><span>Open 24 hours, every day</span><strong>Address</strong><span>Near Miglani Cinema, Rampur Road, Moradabad [244001]</span></div></div>
  {sent?<div className="form-success" role="status"><h2>Request received.</h2><p>Thank you. The reception team will contact you to confirm the appointment.</p><button className="button button-blue" onClick={()=>setSent(false)}>Make another request</button></div>:
  <form onSubmit={e=>{e.preventDefault();setSent(true)}}><label>Patient name<input required name="name" placeholder="Enter patient name"/></label><label>Phone number<input required name="phone" inputMode="tel" placeholder="Enter phone number"/></label><label>Department<select required defaultValue=""><option value="" disabled>Select department</option><option>General Medicine</option><option>General Surgery</option><option>Obstetrics & Gynaecology</option><option>Urology</option><option>Pediatrics</option></select></label><label>Preferred date<input required name="date" type="date"/></label><label className="full">How can we help?<textarea name="message" placeholder="Brief appointment details"/></label><button className="button button-blue" type="submit">Submit Request</button><small className="full">For a medical emergency, please visit the hospital immediately.</small></form>}
  </div></section></SiteShell>
}
