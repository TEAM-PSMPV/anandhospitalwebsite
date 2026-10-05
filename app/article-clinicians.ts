import type { HealthArticle } from './health-library/articles';
const surgeon = { name: 'Dr Subhash Singh', role: 'Consultant General Surgeon · MBBS, MS · General and laparoscopic surgery', href: '/doctors/dr-subhash-singh' };
const gynaecologist = { name: 'Dr Nidhi Thakur', role: 'Consultant Obstetrician & Gynaecologist · MBBS (KGMU), DGO (LLRM) · 20+ years of clinical experience', href: '/doctors/dr-nidhi-thakur' };
const paediatrician = { name: 'Dr Rajeev Kumar', role: 'Consultant Paediatrician & Neonatologist · MBBS, MD Paediatrics', href: '/doctors/dr-rajeev-kumar' };
export function articleClinician(article: HealthArticle) {
  if (/GYNAECOLOGY|WOMEN|MATERNITY|FERTILITY/.test(article.category)) return gynaecologist;
  if (/SURGERY|COLORECTAL/.test(article.category)) return surgeon;
  if (article.category === 'CHILD HEALTH') return paediatrician;
  return article.treatingDoctor;
}
