"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type ChatOption = {
  label: string;
  prompt: string;
};

const options: readonly ChatOption[] = [
  { label: "Book Appointment", prompt: "Appointment kaise book karun?" },
  { label: "View Doctors", prompt: "Hospital ke doctors ke baare mein bataiye." },
  { label: "See Services", prompt: "Anand Hospital mein kaun-kaun si services hain?" },
  { label: "Emergency Help", prompt: "Emergency mein hospital se kaise contact karun?" },
] as const;

const initialMessages: ChatMessage[] = [
  { id: 1, role: "assistant", text: "Namaste! Main Anand Hospital ka AI assistant hoon. Hospital, doctors, services ya appointment ke baare mein mujhse yahin poochhiye." },
];

export function SiteChatbot() {
  const chatbotRef = useRef<HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(2);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const askAssistant = async (prompt: string) => {
    const query = prompt.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = { id: nextMessageId.current++, role: "user", text: query };
    const history = messages.slice(-8).map((message) => ({ role: message.role, content: message.text }));
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: query, history }),
      });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error || "Chat request failed");
      setMessages((current) => [...current, { id: nextMessageId.current++, role: "assistant", text: data.answer as string }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Assistant abhi available nahi hai.";
      setMessages((current) => [...current, { id: nextMessageId.current++, role: "assistant", text: message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askAssistant(input);
  };

  const resetChat = () => {
    if (isLoading) return;
    nextMessageId.current = 2;
    setMessages(initialMessages);
    setInput("");
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [isOpen, isLoading, messages]);

  return <>{isOpen && <div className="chatbot-backdrop" aria-hidden="true" />}<aside ref={chatbotRef} className={isOpen ? "site-chatbot is-open" : "site-chatbot"} aria-label="Anand Hospital AI assistant">
    {isOpen && <section className="chatbot-panel" role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
      <header className="chatbot-header"><div><span className="chatbot-status" aria-hidden="true" /><div><h2 id="chatbot-title">Anand Hospital Assistant</h2><p>AI-powered · Hinglish by default</p></div></div><div className="chatbot-header-actions"><button className="chatbot-reset" type="button" onClick={resetChat} disabled={isLoading}>Reset</button><button className="chatbot-close" type="button" aria-label="Close chatbot" onClick={() => setIsOpen(false)}>×</button></div></header>
      <div className="chatbot-messages" aria-live="polite" aria-busy={isLoading}>
        {messages.map((message) => <div className={`chatbot-message chatbot-message--${message.role}`} key={message.id}><p>{message.text}</p></div>)}
        {isLoading && <div className="chatbot-message chatbot-message--thinking" aria-label="Assistant is thinking"><span /><span /><span /></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-options" aria-label="Quick questions">{options.map((option) => <button type="button" key={option.label} disabled={isLoading} onClick={() => void askAssistant(option.prompt)}>{option.label}</button>)}</div>
      <form className="chatbot-form" onSubmit={submitMessage}><label className="sr-only" htmlFor="chatbot-input">Ask the Anand Hospital assistant</label><input id="chatbot-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Apna sawaal type karein..." autoComplete="off" maxLength={1000} disabled={isLoading} /><button type="submit" aria-label="Send message" disabled={isLoading || !input.trim()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" /></svg></button></form>
    </section>}
    <button className="chatbot-launcher" type="button" aria-label={isOpen ? "Close Anand Hospital assistant" : "Open Anand Hospital assistant"} aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>{isOpen ? <span aria-hidden="true">×</span> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M7 10h10M7 13h7" /></svg>}</button>
  </aside></>;
}
