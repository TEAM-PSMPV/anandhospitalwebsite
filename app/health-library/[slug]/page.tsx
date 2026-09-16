import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Assistance, Icon, SiteShell } from "../../site-shell";
import { getHealthArticle, healthArticles } from "@/app/health-library/articles";
import { Breadcrumbs, createPageMetadata } from "../../seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => healthArticles.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getHealthArticle((await params).slug);
  return article ? createPageMetadata({ title: `${article.title} | Anand Hospital Moradabad`, description: article.summary, path: `/health-library/${article.slug}`, keywords: article.keywords, image: article.image }) : {};
}

export default async function HealthArticlePage({ params }: Props) {
  const article = getHealthArticle((await params).slug);
  if (!article) notFound();
  const index = healthArticles.findIndex(({ slug }) => slug === article.slug);
  const related = Array.from({ length: 3 }, (_, offset) => healthArticles[(index + offset + 1) % healthArticles.length]);
  return <SiteShell>
    <Breadcrumbs items={[{ name: "Health Library", href: "/health-library" }, { name: article.title, href: `/health-library/${article.slug}` }]} />
    <article className="health-article-page">
      <header className="health-article-hero"><div className="container health-article-hero-grid"><div className="health-article-hero-copy">
        <Link className="health-article-back" href="/health-library"><span aria-hidden="true">←</span> Health Library</Link>
        <span className="health-article-category">{article.category}</span><h1>{article.title}</h1><p>{article.summary}</p><span className="health-article-time">{article.readingTime}</span>
      </div><Image className="health-article-hero-image" src={article.image} alt={article.imageAlt} width={1536} height={1024} priority /></div></header>
      <div className="container health-article-body"><div className="health-article-prose">
        <p className="health-article-lead">{article.intro}</p>
        {article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map((text) => <p key={text}>{text}</p>)}{section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}</section>)}
        {article.treatingDoctor && <section className="health-article-doctor"><h2>Treating doctor</h2><h3>{article.treatingDoctor.name}</h3><p>{article.treatingDoctor.role}</p><Link href={article.treatingDoctor.href}>View doctor profile <Icon name="arrow" /></Link></section>}
        {article.faqs && <section className="health-article-faq"><h2>Frequently asked questions</h2>{article.faqs.map(({question,answer}) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>}
        <aside className="health-article-callout"><Icon name="medical-care" /><div><h2>When Should You Consult a Doctor?</h2>{article.doctorAdvice.map((text) => <p key={text}>{text}</p>)}</div></aside>
        {article.treatingDoctor && <aside className="health-article-cta"><div><h2>Speak with Anand Hospital</h2><p>Get an individual assessment before deciding on a test, medicine or procedure.</p></div><div><Link className="button button-white" href="/appointment">Book an Appointment</Link><a className="button button-outline" href="tel:+917351028221">Call +91 73510 28221</a></div></aside>}
        {article.sources && <section className="health-article-sources"><h2>Medical information sources</h2><ul>{article.sources.map(({title,url}) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{title}</a></li>)}</ul></section>}
        <p className="health-article-disclaimer"><strong>Medical disclaimer:</strong> This information is provided for general educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a qualified healthcare professional for medical concerns.</p>
      </div></div>
      <section className="health-related" aria-labelledby="related-health-articles"><div className="container"><h2 id="related-health-articles">Related Health Articles</h2><div className="health-related-grid">{related.map((item) => <article key={item.slug}><Image src={item.image} alt={item.imageAlt} width={1536} height={1024} /><div><span>{item.category}</span><h3>{item.title}</h3><Link href={`/health-library/${item.slug}`}>Read Article <Icon name="arrow" /></Link></div></article>)}</div></div></section>
    </article><Assistance />
  </SiteShell>;
}
