"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { departments, doctors } from "../data";
import { Assistance, Icon, SiteShell } from "../site-shell";

export default function Search() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const destinations = [
    ...departments.map((department) => ({ title: department.name, detail: department.description, href: "/doctors", searchText: "department service specialty" })),
    ...doctors.map((doctor) => ({ title: doctor.name, detail: `${doctor.department} · ${doctor.qualification}`, href: "/doctors#medical-team", searchText: "doctor doctors specialist" })),
    { title: "Book an Appointment", detail: "Request a consultation at Anand Hospital", href: "/appointment", searchText: "book appointment visit" },
    { title: "About Anand Hospital", detail: "Our story, values and facilities", href: "/about", searchText: "about hospital story" },
    { title: "Health Library", detail: "Helpful health information", href: "/health-library", searchText: "health library wellness" },
  ];
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? destinations.filter((item) => `${item.title} ${item.detail} ${item.searchText}`.toLowerCase().includes(normalizedQuery))
    : [];

  return <SiteShell>
    <section className="search-section" aria-labelledby="search-page-title"><div className="container search-page">
      <h1 id="search-page-title">Search Anand Hospital</h1>
      <label className="search-box"><Icon name="search"/><span className="sr-only">Search doctors, departments and services</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What can we help you find?"/>{query && <button onClick={() => setQuery("")} type="button">Clear</button>}</label>
      {normalizedQuery && <><p className="search-count">{results.length} results for “{query.trim()}”</p><div className="search-list">{results.map((item) => <Link href={item.href} key={`${item.title}-${item.detail}`}><span><strong>{item.title}</strong><small>{item.detail}</small></span><Icon name="arrow"/></Link>)}{!results.length && <div className="empty"><h2>No matching results</h2><p>Try a doctor name, department or service.</p></div>}</div></>}
    </div></section>
    <Assistance/>
  </SiteShell>;
}
