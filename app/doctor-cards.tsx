import Image from "next/image";
import { doctors } from "./data";
import { Icon } from "./site-shell";

export function DoctorCards() {
  return <div className="doctor-grid">{doctors.map((doctor, index) => <article className={"featured" in doctor && doctor.featured ? "featured-doctor" : ""} key={doctor.name}><div className="doctor-avatar">{"photo" in doctor && doctor.photo ? <Image src={doctor.photo} alt={doctor.name} width={1122} height={1402} /> : <Icon name="doctors" />}<span>0{index + 1}</span></div><div><small>{doctor.department}</small><h3>{doctor.name}</h3><p><b>Qualifications:</b> {doctor.qualification}</p><p><b>Experience:</b> {doctor.experience}</p><span>{doctor.role}</span></div></article>)}</div>;
}
