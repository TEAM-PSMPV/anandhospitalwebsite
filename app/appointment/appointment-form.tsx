"use client";

import { useRef, useState, type FormEvent } from "react";
import { doctors } from "../data";

const departmentOptions = Array.from(new Set(doctors.map((doctor) => doctor.department)));

export function AppointmentForm({ requestedDoctor = "", requestedDepartment = "" }: { requestedDoctor?: string; requestedDepartment?: string }) {
  const matchingDoctor = doctors.find((doctor) => doctor.name === requestedDoctor);
  const initialDepartment = matchingDoctor?.department ?? (departmentOptions.includes(requestedDepartment) ? requestedDepartment : "");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submission = useRef<{ fingerprint: string; externalId: string } | null>(null);
  const submitting = useRef(false);
  const [doctorName, setDoctorName] = useState(matchingDoctor?.name ?? "");
  const [department, setDepartment] = useState(initialDepartment);

  const selectDoctor = (name: string) => {
    setDoctorName(name);
    const selectedDoctor = doctors.find((doctor) => doctor.name === name);
    if (selectedDoctor) setDepartment(selectedDoctor.department);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const fingerprint = JSON.stringify(payload);
    try {
      if (submission.current?.fingerprint !== fingerprint) {
        submission.current = { fingerprint, externalId: `website-${crypto.randomUUID()}` };
      }
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, externalId: submission.current.externalId }),
      });
      const result = await response.json();
      if (response.status !== 202 || result.received !== true) {
        throw new Error(result.error || "We could not send your request. Please try again or call +91 7351028221.");
      }
      setSent(true);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "We could not send your request. Please try again or call +91 7351028221.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return sent ? <div className="form-success" role="status">
    <h2>Request received.</h2>
    <p>Thank you for booking up the Appointment - Our Internal Staff will call and confirm in a while.</p>
    <p>After verifying your details, our staff will add you to the queue and share your token number with you by phone.</p>
    <button className="button button-blue" onClick={() => { submission.current = null; setSent(false); }}>Make another request</button>
  </div> : <form id="appointment-form" onSubmit={submit} aria-busy={busy}>
    <label>Patient name<input required name="name" maxLength={100} autoComplete="name" placeholder="Enter patient name" /></label>
    <label>Phone number<input required name="phone" type="tel" maxLength={24} autoComplete="tel" inputMode="tel" placeholder="Enter phone number" /></label>
    <label>Doctor<select required name="doctor" value={doctorName} onChange={(event) => selectDoctor(event.target.value)}><option value="" disabled>Select doctor</option>{doctors.map((doctor) => <option key={doctor.name} value={doctor.name}>{doctor.name}</option>)}</select></label>
    <label>Department<select required name="department" value={department} onChange={(event) => setDepartment(event.target.value)}><option value="" disabled>Select department</option>{departmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
    <label>Preferred date<input required name="date" type="date" /></label>
    <label className="full">Address (optional)<input name="address" maxLength={300} autoComplete="street-address" placeholder="Enter patient address" /></label>
    <label className="full">How can we help?<textarea name="message" maxLength={200} placeholder="Brief appointment details" /></label>
    {error && <p className="full" role="alert">{error}</p>}
    <button className="button button-blue" type="submit" disabled={busy}>{busy ? "Sending request…" : "Submit Request"}</button>
    <small className="full">For a medical emergency, please visit the hospital immediately.</small>
  </form>;
}
