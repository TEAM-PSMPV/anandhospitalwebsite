"use client";

import { useState } from "react";
import { doctors } from "../data";

const departmentOptions = Array.from(new Set(doctors.map((doctor) => doctor.department)));

export function AppointmentForm({ requestedDoctor = "", requestedDepartment = "" }: { requestedDoctor?: string; requestedDepartment?: string }) {
  const matchingDoctor = doctors.find((doctor) => doctor.name === requestedDoctor);
  const initialDepartment = matchingDoctor?.department ?? (departmentOptions.includes(requestedDepartment) ? requestedDepartment : "");
  const [sent, setSent] = useState(false);
  const [doctorName, setDoctorName] = useState(matchingDoctor?.name ?? "");
  const [department, setDepartment] = useState(initialDepartment);

  const selectDoctor = (name: string) => {
    setDoctorName(name);
    const selectedDoctor = doctors.find((doctor) => doctor.name === name);
    if (selectedDoctor) setDepartment(selectedDoctor.department);
  };

  return sent ? <div className="form-success" role="status">
    <h2>Request received.</h2>
    <p>Thank you. The reception team will contact you to confirm the appointment.</p>
    <button className="button button-blue" onClick={() => setSent(false)}>Make another request</button>
  </div> : <form id="appointment-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
    <label>Patient name<input required name="name" placeholder="Enter patient name" /></label>
    <label>Phone number<input required name="phone" inputMode="tel" placeholder="Enter phone number" /></label>
    <label>Doctor<select required name="doctor" value={doctorName} onChange={(event) => selectDoctor(event.target.value)}><option value="" disabled>Select doctor</option>{doctors.map((doctor) => <option key={doctor.name} value={doctor.name}>{doctor.name}</option>)}</select></label>
    <label>Department<select required name="department" value={department} onChange={(event) => setDepartment(event.target.value)}><option value="" disabled>Select department</option>{departmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
    <label>Preferred date<input required name="date" type="date" /></label>
    <label className="full">How can we help?<textarea name="message" placeholder="Brief appointment details" /></label>
    <button className="button button-blue" type="submit">Submit Request</button>
    <small className="full">For a medical emergency, please visit the hospital immediately.</small>
  </form>;
}
