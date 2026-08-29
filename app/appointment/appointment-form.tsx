"use client";

import { useState } from "react";

export function AppointmentForm() {
  const [sent, setSent] = useState(false);

  return sent ? <div className="form-success" role="status">
    <h2>Request received.</h2>
    <p>Thank you. The reception team will contact you to confirm the appointment.</p>
    <button className="button button-blue" onClick={() => setSent(false)}>Make another request</button>
  </div> : <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
    <label>Patient name<input required name="name" placeholder="Enter patient name" /></label>
    <label>Phone number<input required name="phone" inputMode="tel" placeholder="Enter phone number" /></label>
    <label>Department<select required defaultValue=""><option value="" disabled>Select department</option><option>General Medicine</option><option>General Surgery</option><option>Obstetrics &amp; Gynaecology</option><option>Urology</option><option>Pediatrics</option></select></label>
    <label>Preferred date<input required name="date" type="date" /></label>
    <label className="full">How can we help?<textarea name="message" placeholder="Brief appointment details" /></label>
    <button className="button button-blue" type="submit">Submit Request</button>
    <small className="full">For a medical emergency, please visit the hospital immediately.</small>
  </form>;
}
