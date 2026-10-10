import { doctors } from "./data";
const doctorLink = (doctor: (typeof doctors)[number]) => ({ name: doctor.name, href: `/doctors/${doctor.name.toLowerCase().replace(/^dr\s+/, "dr-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}` });
export const doctorNavigationGroups = [...new Set(doctors.map(doctor => doctor.department))].map(department => ({ title: department, items: doctors.filter(doctor => doctor.department === department).map(doctorLink) }));
export const aboutNavigationGroups = [
  { title: "Our Hospital", items: [{ name: "About Anand Hospital", href: "/about" }, { name: "Hospital History", href: "/about#history" }, { name: "Hospital Gallery", href: "/gallery" }, { name: "Awards & Felicitations", href: "/awards" }] },
  { title: "Our Doctors", items: [{ name: "All Doctors", href: "/doctors" }, ...doctors.map(doctorLink)] },
  { title: "Patient Experiences & Support", items: [{ name: "Patient Testimonials", href: "/testimonials" }, { name: "Patient FAQs", href: "/about#faq" }, { name: "Ayushman & Payment Information", href: "/site-information/ayushman-and-payments" }, { name: "Website Feedback", href: "/feedback" }] },
];
