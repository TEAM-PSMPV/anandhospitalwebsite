"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  href?: string;
  linkLabel?: string;
};

type ChatOption = {
  label: string;
  prompt: string;
  response: string;
  href: string;
  linkLabel: string;
};

const options: readonly ChatOption[] = [
  { label: "Book Appointment", prompt: "Appointment book karna hai", response: "Bilkul. Aap Book Appointment page par visit schedule kar sakte hain.", href: "/appointment", linkLabel: "Book Appointment" },
  { label: "View Doctors", prompt: "Doctors dekhne hain", response: "Yahan Anand Hospital ke doctors aur unki approved professional details milengi.", href: "/doctors", linkLabel: "View Doctors" },
  { label: "See Services", prompt: "Hospital services dekhni hain", response: "Aap hospital ki available services aur specialty areas yahan dekh sakte hain.", href: "/services", linkLabel: "See Services" },
  { label: "Health Library", prompt: "Health Library padhni hai", response: "Health tips, disease guides, nutrition aur wellness content ke liye Health Library dekhein.", href: "/health-library", linkLabel: "Read Health Library" },
] as const;

const initialMessages: ChatMessage[] = [
  { id: 1, role: "assistant", text: "Namaste! Main Anand Hospital website assistant hoon. Aap kya dekhna chahenge?" },
];

function answerFor(query: string): Omit<ChatMessage, "id" | "role"> {
  const normalized = query.toLowerCase().trim();
  if (/appointment|book|booking|mulaqat|visit/.test(normalized)) return { text: "Appointment book karne ke liye online request form use karein.", href: "/appointment", linkLabel: "Book Appointment" };
  if (/doctor|doctors|specialist|daktar|chikitsak/.test(normalized)) return { text: "Aap doctors, departments aur unki approved details Doctors page par dekh sakte hain.", href: "/doctors", linkLabel: "View Doctors" };
  if (/service|services|department|treatment|seva|ilaaj|ilaj/.test(normalized)) return { text: "Hospital ki available services aur specialty areas yahan listed hain.", href: "/services", linkLabel: "See Services" };
  if (/health|library|tips|wellness|nutrition|sehat|swasth/.test(normalized)) return { text: "Health tips aur wellness information ke liye Health Library visit karein.", href: "/health-library", linkLabel: "Read Health Library" };
  if (/about|hospital|story|mission|vision|jaankari|jankari/.test(normalized)) return { text: "Anand Hospital ki story, mission, team aur FAQs About Us page par milenge.", href: "/about", linkLabel: "About Anand Hospital" };
  if (/faq|question|sawal|timing|location|address/.test(normalized)) return { text: "Common questions aur hospital information ke liye FAQs dekhein.", href: "/about#faq", linkLabel: "View FAQs" };
  if (/emergency|urgent|help|madad/.test(normalized)) return { text: "Emergency assistance ke liye hospital ko call karein. Website par emergency care information bhi available hai.", href: "tel:+917351028221", linkLabel: "Call Hospital" };
  if (/search|find|dhoond|dhund/.test(normalized)) return { text: "Website par kisi page ya topic ko dhoondhne ke liye Search use karein.", href: "/search", linkLabel: "Search Website" };
  if (/home|homepage|shuru/.test(normalized)) return { text: "Main aapko Anand Hospital homepage par le ja sakta hoon.", href: "/", linkLabel: "Go to Home" };
  return { text: "Main Anand Hospital website ki navigation mein help kar sakta hoon. Appointment, Doctors, Services ya Health Library mein se koi option choose karein." };
}

export function SiteChatbot() {
  const chatbotRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const addExchange = (prompt: string, response: Omit<ChatMessage, "id" | "role">) => {
    setMessages((current) => {
      const nextId = current.length + 1;
      return [...current, { id: nextId, role: "user", text: prompt }, { id: nextId + 1, role: "assistant", ...response }];
    });
  };

  const chooseOption = (option: ChatOption) => {
    addExchange(option.prompt, { text: option.response, href: option.href, linkLabel: option.linkLabel });
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;
    addExchange(query, answerFor(query));
    setInput("");
  };

  const resetChat = () => {
    setMessages(initialMessages);
    setInput("");
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  return <>{isOpen && <div className="chatbot-backdrop" aria-hidden="true" />}<aside ref={chatbotRef} className={isOpen ? "site-chatbot is-open" : "site-chatbot"} aria-label="Anand Hospital website assistant">
    {isOpen && <section className="chatbot-panel" role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
      <header className="chatbot-header"><div><span className="chatbot-status" aria-hidden="true" /><div><h2 id="chatbot-title">Anand Hospital Assistant</h2><p>English + Hinglish help</p></div></div><div className="chatbot-header-actions"><button className="chatbot-reset" type="button" onClick={resetChat}>Reset</button><button className="chatbot-close" type="button" aria-label="Close chatbot" onClick={() => setIsOpen(false)}>×</button></div></header>
      <div className="chatbot-messages" aria-live="polite">
        {messages.map((message) => <div className={`chatbot-message chatbot-message--${message.role}`} key={message.id}><p>{message.text}</p>{message.href && message.linkLabel && (message.href.startsWith("tel:") ? <a href={message.href}>{message.linkLabel} <span aria-hidden="true">→</span></a> : <Link href={message.href} onClick={() => setIsOpen(false)}>{message.linkLabel} <span aria-hidden="true">→</span></Link>)}</div>)}
      </div>
      <div className="chatbot-options" aria-label="Quick options">{options.map((option) => <button type="button" key={option.label} onClick={() => chooseOption(option)}>{option.label}</button>)}</div>
      <form className="chatbot-form" onSubmit={submitMessage}><label className="sr-only" htmlFor="chatbot-input">Ask the Anand Hospital assistant</label><input id="chatbot-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Apna sawaal type karein..." autoComplete="off" /><button type="submit" aria-label="Send message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" /></svg></button></form>
    </section>}
    <button className="chatbot-launcher" type="button" aria-label={isOpen ? "Close Anand Hospital assistant" : "Open Anand Hospital assistant"} aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>{isOpen ? <span aria-hidden="true">×</span> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M7 10h10M7 13h7" /></svg>}</button>
  </aside></>;
}
