import Link from "next/link";
import { Assistance, Icon, InteriorHero, SiteShell } from "../site-shell";

export default function HealthLibrary(){return <SiteShell>
  <InteriorHero title="Live Healthy" text="Practical, clinician-guided information for healthier everyday decisions."/>
  <section className="library-top viewport-section"><div className="container"><p className="kicker center">Health Topics</p><h2>Information for every stage of life.</h2><div className="topic-grid">{[["General wellness","Everyday habits that support long-term health.","heart"],["Women’s health","Guidance for reproductive, maternity and lifelong health.","community"],["Child health","Support for growth, nutrition and preventive care.","doctors"]].map(([t,d,i])=><article key={t}><Icon name={i as "heart"}/><h3>{t}</h3><p>{d}</p><Link href="#articles">Explore topics <Icon name="arrow"/></Link></article>)}</div></div></section>
  <section className="articles viewport-section" id="articles"><div className="container"><p className="kicker">Latest Health Articles</p><h2>Clear guidance from trusted clinicians.</h2><div className="article-grid">{["Preparing for a hospital visit","A practical guide to preventive checkups","Women’s health at every life stage","Everyday nutrition for growing children"].map((t,i)=><article key={t}><div><span>Health guide · {i+3} min read</span><Icon name={i%2?"heart":"pulse"}/></div><h3>{t}</h3><p>Simple, useful information to help you make confident health decisions.</p><Link href="/appointment">Read article <Icon name="arrow"/></Link></article>)}</div></div></section>
  <Assistance/>
</SiteShell>}
