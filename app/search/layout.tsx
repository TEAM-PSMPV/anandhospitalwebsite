import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({ title: "Search Anand Hospital", description: "Search Anand Hospital doctors, services and health information.", path: "/search", noIndex: true });

export default function SearchLayout({ children }: { children: ReactNode }) { return children; }
