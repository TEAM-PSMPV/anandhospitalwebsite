import Image from "next/image";
import Link from "next/link";
import { doctors } from "./data";
import { Icon } from "./site-shell";

function StandardDoctorCard({ doctor, index }: { doctor: (typeof doctors)[number]; index: number }) {
  return <article className={"featured" in doctor && doctor.featured ? "featured-doctor" : ""}><div className="doctor-avatar">{"photo" in doctor && doctor.photo ? <Image src={doctor.photo} alt={doctor.name} width={1122} height={1402} /> : <Icon name="doctors" />}<span>0{index + 1}</span></div><div><small>{doctor.department}</small><h3>{doctor.name}</h3><p><b>Qualifications:</b> {doctor.qualification}</p><p><b>Experience:</b> {doctor.experience}</p><span>{doctor.role}</span></div></article>;
}

export function DoctorCards({ compactRemainder = false }: { compactRemainder?: boolean }) {
  if (!compactRemainder) return <div className="doctor-grid">{doctors.map((doctor, index) => <StandardDoctorCard doctor={doctor} index={index} key={doctor.name} />)}</div>;

  return <div className="doctor-collection doctor-collection--profiles">
    <div className="doctor-grid doctor-featured-grid">{doctors.slice(0, 2).map((doctor, index) => <StandardDoctorCard doctor={doctor} index={index} key={doctor.name} />)}</div>
    <div className="doctor-compact-grid">{doctors.slice(2).map((doctor) => <article className="doctor-profile-card" key={doctor.name}>
      <Image unoptimized src={doctor.photo} alt={doctor.name} width={120} height={120} sizes="120px" style={{ width: 120, height: 120, minWidth: 120, maxWidth: 120, minHeight: 120, maxHeight: 120, borderRadius: "50%", objectFit: "cover", objectPosition: "center top" }} />
      <h3>{doctor.name}</h3><small>{doctor.department}</small>
      <div className="doctor-profile-details"><p><b>Qualifications:</b> {doctor.qualification}</p><p><b>Experience:</b> {doctor.experience}</p></div>
      <div className="doctor-profile-stars" aria-hidden="true">★★★★★</div>
      <Link href="/appointment">Book Appointment</Link>
    </article>)}</div>
  </div>;
}
