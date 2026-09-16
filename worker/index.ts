/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { doctors, services } from "../app/data";
import { healthArticles } from "../app/health-library/articles";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  AI: {
    run(model: string, input: Record<string, unknown>): Promise<{ response?: string }>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

type ChatTurn = { role: "assistant" | "user"; content: string };

const hospitalKnowledge = `
ANAND HOSPITAL WEBSITE KNOWLEDGE
Identity: Anand Hospital is a multispecialty hospital established in 2007. It provides affordable, ethical, patient-centred healthcare in Moradabad and is open 24 hours every day.
Address: Near Miglani Cinema, Rampur Road, Moradabad [244001].
Appointment and emergency phone: +91 7351028221. Follow-up patient help: +91 9528261199. Email: info@anandhospitalmbd.org.
Appointments: Patients can submit the appointment form with their name, phone, doctor, department, preferred date and a short message. The reception team then calls to confirm doctor availability and appointment details. No account is required. For rescheduling, cancellation, consultation fees or required documents, contact reception. The website lists OPD timings as Monday-Saturday 9:00 AM-6:00 PM and Sunday 9:00 AM-1:00 PM; a contact strip also lists 10:15 AM-3:00 PM, so advise the patient to call and confirm current doctor availability.
Emergency: Emergency and critical-care support is available 24x7. For a medical emergency, visit the hospital immediately or call +91 7351028221.
Doctors: Dr Subhash Singh — Consultant General Surgeon; MBBS, MS; former Lecturer at PGIMS Rohtak; general and laparoscopic surgery. Dr Nidhi Thakur — Consultant Obstetrician & Gynaecologist; MBBS (KGMU), DGO (LLRM Medical College); 20+ years in high-risk obstetrics, gynaecology, laparoscopy, hysteroscopy and infertility care; former Senior Resident at PGIMS Rohtak. Dr Bhoopendra Kumar Sharma — Consultant Urologist & Assistant Professor; MBBS, MS (General Surgery), MCh (Urology). Dr Rajiv Kumar — Consultant Paediatrician & Neonatologist; MBBS, MD Paediatrics; 12 years in paediatrics, neonatology, NICU, PICU and paediatric emergency care. Dr Garima Singh — Consultant Anaesthesiologist; MBBS, MD (Anaesthesiology); 18 years in perioperative anaesthesia, regional blocks and labour analgesia. Dr Rangit Pandey — Consultant Anaesthesiologist; MBBS (KGMC Lucknow), MD (Anaesthesia & Critical Care); former senior resident at UCMS & GTB Hospital, former consultant at Kailash Hospital, and former senior faculty and ICU in-charge at SRMS.
Medical services: Emergency Care (rapid assessment, stabilisation, critical-care coordination and admission support); General Medicine (fever and infections, diabetes, hypertension and general consultations); General Surgery (general and laparoscopic procedures, cancer surgery and post-operative care); Paediatrics (child consultations, newborn and infant care, vaccinations and preventive care); Obstetrics & Gynaecology (obstetric, gynaecology, women's health and maternity care); Urology (consultation, surgical urology, stone management and follow-up); Anaesthesiology (pre-anaesthetic assessment, planning, perioperative monitoring and pain management); RMO/Critical Care (continuous monitoring, critical support, post-operative observation and emergency coordination).
Facilities and patient care: pathology lab, X-ray and ultrasound imaging, pharmacy, high-tech ICU, health checkups, diet and nutrition guidance, deluxe rooms, home care, reception support, Ayushman Bharat card support for eligible patients, operation theatre, NICU, wards, waiting area and parking.
Health Library topics: heart-health habits; type 2 diabetes symptoms and management; balanced nutrition and immune health; PCOS causes, symptoms and treatment; childhood vaccination; and stress management. These articles are general education and not a diagnosis or substitute for a clinician.
Hospital values: compassion, patient first, integrity, excellence, learning and community. Mission: accessible, ethical, quality healthcare with compassion and respect. Vision: to become the most trusted healthcare institution in Western Uttar Pradesh.
`;

const chatbotSystemPrompt = `You are Anand Hospital Assistant, powered by Llama 3.1. Answer entirely inside the chat.
Use ONLY the ANAND HOSPITAL WEBSITE KNOWLEDGE below. Never invent hospital facts, prices, availability, diagnoses, medicines, or treatment advice. If the answer is not present, say you do not have that information and offer the hospital phone number when useful. Do not tell the user to browse or visit a webpage and do not include website links.
Default to friendly, natural Hinglish written in Latin script. If the user writes in another language or explicitly requests one, answer in that language. Keep answers concise and directly useful. For emergencies, clearly advise immediate in-person emergency care and provide +91 7351028221. For symptoms or medical decisions, give only general website information and advise consultation with a qualified clinician.

${hospitalKnowledge}`;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  let payload: { message?: unknown; history?: unknown };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request." }, 400);
  }

  const message = typeof payload.message === "string" ? payload.message.trim().slice(0, 1000) : "";
  if (!message) return jsonResponse({ error: "Please enter a question." }, 400);

  const history: ChatTurn[] = Array.isArray(payload.history)
    ? payload.history.slice(-8).flatMap((turn): ChatTurn[] => {
        if (!turn || typeof turn !== "object") return [];
        const role = "role" in turn && (turn.role === "assistant" || turn.role === "user") ? turn.role : null;
        const content = "content" in turn && typeof turn.content === "string" ? turn.content.trim().slice(0, 1000) : "";
        return role && content ? [{ role, content }] : [];
      })
    : [];

  try {
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
      messages: [
        { role: "system", content: chatbotSystemPrompt },
        ...history,
        { role: "user", content: message },
      ],
      max_tokens: 320,
      temperature: 0.2,
    });
    const answer = result.response?.trim();
    if (!answer) throw new Error("Empty model response");
    return jsonResponse({ answer });
  } catch (error) {
    console.error("Anand Hospital chatbot error", error);
    return jsonResponse({ error: "Assistant abhi available nahi hai. Kripya thodi der baad dobara try karein." }, 503);
  }
}

const webVitalNames = new Set(["CLS", "FCP", "INP", "LCP", "TTFB"]);

async function handleWebVitals(request: Request): Promise<Response> {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);
  try {
    const metric = await request.json() as { name?: unknown; value?: unknown; rating?: unknown; id?: unknown; navigationType?: unknown; path?: unknown };
    if (typeof metric.name !== "string" || !webVitalNames.has(metric.name) || typeof metric.value !== "number" || !Number.isFinite(metric.value)) {
      return jsonResponse({ error: "Invalid metric." }, 400);
    }
    console.log("web-vital", JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: typeof metric.rating === "string" ? metric.rating : undefined,
      id: typeof metric.id === "string" ? metric.id.slice(0, 100) : undefined,
      navigationType: typeof metric.navigationType === "string" ? metric.navigationType : undefined,
      path: typeof metric.path === "string" ? metric.path.slice(0, 300) : undefined,
    }));
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
  } catch {
    return jsonResponse({ error: "Invalid request." }, 400);
  }
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-src 'self' https://www.instagram.com",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "upgrade-insecure-requests",
  ].join("; "),
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

const publicSiteUrl = "https://www.anandhospitalmbd.org";
const sitemapPaths = [
  "", "/about", "/doctors", "/services", "/appointment", "/health-library", "/testimonials",
  ...doctors.map(({ name }) => `/doctors/${name.toLowerCase().replace(/^dr\s+/, "dr-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`),
  ...services.map(({ slug }) => `/services/${slug}`),
  ...healthArticles.map(({ slug }) => `/health-library/${slug}`),
];

function sitemapResponse(): Response {
  const urls = sitemapPaths.map((path) => `<url><loc>${publicSiteUrl}${path}</loc><lastmod>2026-09-16</lastmod></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const redirectAliases: Record<string, string> = {
      "/book-appointment": "/appointment",
      "/appointments": "/appointment",
      "/our-doctors": "/doctors",
      "/doctor": "/doctors",
      "/our-services": "/services",
      "/departments": "/services",
      "/health-tips": "/health-library",
      "/blog": "/health-library",
      "/dr-subhash-singh": "/doctors/dr-subhash-singh",
      "/dr-nidhi-thakur": "/doctors/dr-nidhi-thakur",
      "/gallbladder-surgery": "/health-library/gallbladder-stone-surgery",
      "/hernia-surgery": "/health-library/hernia-surgery",
      "/appendix-surgery": "/health-library/appendix-surgery",
      "/pcos-treatment": "/health-library/pcos-treatment",
    };
    const canonicalHost = "www.anandhospitalmbd.org";
    let redirectPath = redirectAliases[url.pathname];
    if (!redirectPath && url.pathname.length > 1 && url.pathname.endsWith("/")) redirectPath = url.pathname.replace(/\/+$/, "");
    if (redirectPath || url.hostname === "anandhospitalmbd.org" || (url.hostname === canonicalHost && url.protocol !== "https:")) {
      url.protocol = "https:";
      url.hostname = canonicalHost;
      if (redirectPath) url.pathname = redirectPath;
      return withSecurityHeaders(Response.redirect(url.toString(), 301));
    }

    if (url.pathname === "/api/chat") {
      return withSecurityHeaders(await handleChat(request, env));
    }

    if (url.pathname === "/robots.txt") {
      return withSecurityHeaders(new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /search\nSitemap: ${publicSiteUrl}/sitemap.xml\nHost: ${publicSiteUrl}\n`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } }));
    }

    if (url.pathname === "/sitemap.xml") return withSecurityHeaders(sitemapResponse());

    if (url.pathname === "/api/web-vitals") {
      return withSecurityHeaders(await handleWebVitals(request));
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const imageResponse = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(imageResponse);
    }

    return withSecurityHeaders(await handler.fetch(request, env, ctx));
  },
};

export default worker;
