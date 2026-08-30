import Link from "next/link";
import Image from "next/image";
import { Assistance, Icon, InteriorHero, SiteShell, type IconName } from "../site-shell";

const healthTopics: { title: string; description: string; icon: IconName }[] = [
  { title: "Health Tips", description: "Practical tips for everyday wellness", icon: "emergency" },
  { title: "Disease Guide", description: "Understand conditions, symptoms and care", icon: "shield" },
  { title: "Nutrition", description: "Healthy eating and balanced living", icon: "diet-and-nutrition" },
  { title: "Women’s Health", description: "Every stage, every solution", icon: "female" },
  { title: "Child Health", description: "Care and guidance for your child", icon: "pediatrics" },
  { title: "Wellness", description: "Mind, body and lifestyle balance", icon: "wellness" },
];

const featuredArticles = [
  { category: "HEART HEALTH", title: "10 Simple Steps to Keep Your Heart Healthy", description: "Small daily habits can make a big difference in your heart health.", image: "/images/health-library/heart-health-cover.png", imageAlt: "Heart model, blood pressure monitor, berries, oats and walking shoes representing heart-healthy habits" },
  { category: "DIABETES CARE", title: "Understanding Type 2 Diabetes: Symptoms & Management", description: "Learn about causes, early signs and effective ways to manage diabetes.", image: "/images/health-library/diabetes-care-cover.png", imageAlt: "Glucose meter, measuring tape and a balanced meal representing diabetes care" },
  { category: "NUTRITION", title: "Superfoods for a Stronger Immune System", description: "Boost your immunity naturally with these power-packed foods.", image: "/images/health-library/immune-superfoods-cover.png", imageAlt: "Colorful fruits, vegetables, nuts and spices associated with nutritious eating" },
  { category: "WOMEN’S HEALTH", title: "PCOS: Causes, Symptoms and Treatment Options", description: "An expert guide to understanding PCOS and managing it effectively.", image: "/images/health-library/pcos-wellness-cover.png", imageAlt: "Flax seeds, pumpkin seeds, walnuts, berries and leafy greens arranged beside a teal awareness ribbon" },
  { category: "CHILD HEALTH", title: "Childhood Vaccination: What Every Parent Should Know", description: "Vaccines protect your child today for a healthier tomorrow.", image: "/images/health-library/child-vaccination-cover.png", imageAlt: "A pediatric clinician caring for a child during a routine vaccination visit with a parent present" },
  { category: "WELLNESS", title: "Managing Stress: Tips for a Healthier Mind", description: "Simple strategies to reduce stress and improve mental well-being.", image: "/images/health-library/stress-management-cover.png", imageAlt: "A person practicing calm breathing beside a sunlit window" },
];

export default function HealthLibrary(){return <SiteShell>
  <InteriorHero className="health-library-hero" title="Live Healthy" text="Practical, clinician-guided information for healthier everyday decisions."/>
  <div className="health-library-search-wrap"><form className="health-library-search" action="/search" method="get"><button type="submit" aria-label="Search health topics"><Icon name="search"/></button><label className="sr-only" htmlFor="health-topic-search">Search health topics</label><input id="health-topic-search" name="q" type="search" placeholder="Search health topics, conditions and wellness advice"/></form></div>
  <section className="library-top viewport-section" aria-label="Health topics"><div className="container"><div className="topic-grid">{healthTopics.map((topic)=><article key={topic.title}><Icon name={topic.icon}/><h3>{topic.title}</h3><p>{topic.description}</p><Link href="#articles" aria-label={`Explore ${topic.title}`}><Icon name="arrow"/></Link></article>)}</div></div></section>
  <section className="articles health-featured-articles" id="articles"><div className="container"><header className="health-featured-heading"><h2>Featured Health Articles</h2><Link href="#articles">View All Articles <Icon name="arrow"/></Link></header><div className="featured-article-grid">{featuredArticles.map((article)=><article className="health-feature-card" key={article.title}><Image className="health-article-image" src={article.image} alt={article.imageAlt} width={1536} height={1024}/><span>{article.category}</span><h3>{article.title}</h3><p>{article.description}</p><Link href="/appointment">Read Article <Icon name="arrow"/></Link></article>)}</div></div></section>
  <section className="health-library-extras" aria-labelledby="popular-health-topics"><div className="container">
    <h2 id="popular-health-topics">Popular Health Topics</h2>
    <nav className="health-topic-chips" aria-label="Popular health topics">{["Hypertension","Diabetes","Obesity","Heart Health","COVID-19","Mental Health","Pregnancy","Bone Health","Sleep","Immunity"].map((topic)=><Link href="#articles" key={topic}>{topic}</Link>)}</nav>
    <aside className="health-library-disclaimer"><Icon name="shield"/><div><h3>Disclaimer</h3><p>The content provided in this Health Library is for educational purposes only and is not a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified healthcare professional for any health concerns.</p></div></aside>
    <div className="health-library-newsletter"><span className="health-library-newsletter-icon"><Icon name="mail"/></span><div className="health-library-newsletter-copy"><h3>Stay Informed, Stay Healthy</h3><p>Subscribe to our newsletter for the latest health tips, expert advice and updates from Anand Hospital.</p></div><form action="mailto:info@anandhospitalmbd.org" method="post" encType="text/plain"><label className="sr-only" htmlFor="health-library-email">Email address</label><input id="health-library-email" name="email" type="email" placeholder="Enter your email address" required/><button type="submit">Subscribe</button></form></div>
  </div></section>
  <Assistance/>
</SiteShell>}
