import { services } from "./data";
// Share the same curated entries between the service page and its navigation.
export const treatmentGroups = [
  { title: "General Surgery", entries: [
    ["Laparoscopic Surgery", "laparoscopic-surgery"], ["Gallbladder & Gallstone Care", "gallbladder-surgery"],
    ["Hernia Surgery", "hernia-surgery"], ["Appendix Surgery", "appendix-surgery"],
    ["Piles Treatment", "piles-treatment"], ["Cancer Surgery Evaluation", "cancer-surgery"],
  ] },
  { title: "Obstetrics & Gynaecology", entries: [
    ["Hysteroscopy", "hysteroscopy"], ["Laparoscopic Gynaecology", "laparoscopic-gynaecology"],
    ["High-Risk Pregnancy Care", "high-risk-pregnancy"], ["Maternity Care", "maternity-care"],
    ["PCOS Treatment", "pcos-treatment"], ["Infertility Evaluation", "infertility-evaluation"],
  ] },
].map(group => ({ title: group.title, items: group.entries.map(([name, slug]) => ({ name, href: `/services/${slug}` })) }));

export const serviceNavigationGroups = [
  { title: "Medical Specialties", items: services.filter(item => !["emergency-care", "critical-care"].includes(item.slug)).map(item => ({ name: item.name, href: `/services/${item.slug}` })) },
  { title: "Emergency & Critical Care", items: services.filter(item => ["emergency-care", "critical-care"].includes(item.slug)).map(item => ({ name: item.name, href: `/services/${item.slug}` })) },
  { title: "Treatments & Procedures", items: treatmentGroups.flatMap(group => group.items) },
  { title: "Diagnostics", items: [{ name: "Pathology Lab", href: "/services#pathology-lab" }, { name: "Imaging Services", href: "/services#imaging-services" }] },
  { title: "Patient Support", items: [
    { name: "Health Checkups", href: "/services#health-checkups" }, { name: "Diet & Nutrition", href: "/services#diet-nutrition" },
    { name: "Pharmacy", href: "/services#pharmacy" }, { name: "Home Care", href: "/services#home-care" },
    { name: "Ayushman Card Information", href: "/site-information/ayushman-and-payments" },
  ] },
];
