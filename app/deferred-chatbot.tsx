"use client";

import { lazy, Suspense, useState } from "react";

const Chatbot = lazy(() => import("./site-chatbot").then(({ SiteChatbot }) => ({ default: SiteChatbot })));

export function DeferredChatbot() {
  const [activated, setActivated] = useState(false);
  const launcher = <aside className="site-chatbot" aria-label="Anand Hospital AI assistant"><button className="chatbot-launcher" type="button" aria-label="Open Anand Hospital assistant" aria-expanded={false} aria-busy={activated} onClick={() => setActivated(true)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M7 10h10M7 13h7" /></svg></button></aside>;
  return activated ? <Suspense fallback={launcher}><Chatbot initiallyOpen /></Suspense> : launcher;
}
