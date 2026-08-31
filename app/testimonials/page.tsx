import { Assistance, SiteShell } from "../site-shell";
import { patientTestimonials } from "../testimonials-data";

const instagramPosts = [
  { id: "Dbpg4yMtPXu", url: "https://www.instagram.com/p/Dbpg4yMtPXu/" },
  { id: "DcIK_w1Nc_7", url: "https://www.instagram.com/p/DcIK_w1Nc_7/" },
  { id: "Db2PHMfN22u", url: "https://www.instagram.com/p/Db2PHMfN22u/" },
  { id: "Dcls6zitgk-", url: "https://www.instagram.com/p/Dcls6zitgk-/" },
] as const;

export default function TestimonialsPage() {
  return <SiteShell>
    <section className="testimonials-page" aria-labelledby="testimonials-page-title">
      <div className="container">
        <header className="testimonials-page-heading">
          <p className="kicker">View Testimonials</p>
          <h1 id="testimonials-page-title">Your Trust, Your Words.</h1>
          <p>Read what patients and their families have shared about their experience at Anand Hospital.</p>
        </header>
        <section className="testimonials-instagram-grid" aria-label="Anand Hospital on Instagram">
          {instagramPosts.map((post) => <div className="testimonials-instagram-card" key={post.id}>
            <iframe
              src={`https://www.instagram.com/p/${post.id}/embed/captioned/`}
              title={`Instagram post by Anand Hospital: ${post.id}`}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
            <a href={post.url} target="_blank" rel="noreferrer">Open this post on Instagram <span aria-hidden="true">↗</span></a>
          </div>)}
        </section>
        <div className="testimonials-page-grid">
          {patientTestimonials.map((testimonial) => <blockquote key={testimonial.name}>
            <p>“{testimonial.text}”</p>
            <cite>— {testimonial.name}</cite>
          </blockquote>)}
        </div>
      </div>
    </section>
    <Assistance />
  </SiteShell>;
}
