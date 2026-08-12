"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AgentAction } from "@/lib/agentEngine";

interface Msg {
  id: number;
  role: "agent" | "user";
  text: string;
}

const FIX_STEPS = [
  "Checking your GoodMash account… ✓ Account found (simulated diagnostic)",
  "Checking membership… ✓ You are an authorized member (simulated diagnostic)",
  "Checking connection status… ⚠ The connection appears to be stuck (simulated diagnostic)",
  "Refreshing session… ✓ Done (simulated diagnostic)",
  "Testing connection… ✓ Connected (simulated diagnostic)",
];

const WELCOME =
  "Sawubona! I'm the GOODMASH AI AGENT — your 24/7 support assistant for accounts, groups, connections, maintenance, payments and troubleshooting. I'm an AI assistant, not a human employee. How can I help you today?";

export function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [phase, setPhase] = useState<"idle" | "ticket">("idle");
  const [ticketRef, setTicketRef] = useState<string | null>(null);
  const idRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  const push = (msg: Omit<Msg, "id">) => {
    idRef.current += 1;
    setMessages((m) => [...m, { id: idRef.current, ...msg }]);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  const openChat = () => {
    setOpen(true);
    if (!hasOpened.current) {
      hasOpened.current = true;
      push({ role: "agent", text: WELCOME });
      setActions(["view-pricing", "create-ticket"]);
    }
  };

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setInput("");
    setActions([]);

    push({ role: "user", text });

    if (phase === "ticket") {
      setPhase("idle");
      setTyping(true);
      await delay(900);
      const ref = `GM-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketRef(ref);
      setTyping(false);
      push({
        role: "agent",
        text: `Your support ticket ${ref} has been created and sent to GoodMash support. It contains only the information needed to help you. A support agent will review it. You can also reach us on WhatsApp at +27 69 331 3143 for urgent help.`,
      });
      return;
    }

    setTyping(true);
    let reply = "";
    let nextActions: AgentAction[] = [];
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      reply = data.reply ?? "";
      nextActions = data.actions ?? [];
    } catch {
      reply =
        "I'm having trouble reaching my assistant service right now. Please try again, or contact support on WhatsApp at +27 69 331 3143.";
      nextActions = ["contact-support"];
    }
    await delay(600);
    setTyping(false);
    push({ role: "agent", text: reply });
    setActions(nextActions);
  };

  const handleAction = async (action: AgentAction) => {
    setActions([]);
    switch (action) {
      case "view-pricing":
        push({
          role: "agent",
          text: "Here's the pricing summary:\n\n• Standard: R10/month app maintenance\n• VIP: R10 base + R5 per additional VIP group\n• VVIP: R10 base + R10 per VVIP group\n\nEvery new account gets 30 days free. This is an app maintenance fee, not the price of mobile data. The full pricing page is below.",
        });
        break;
      case "fix-connection":
        for (const step of FIX_STEPS) {
          setTyping(true);
          await delay(700);
          setTyping(false);
          push({ role: "agent", text: step });
        }
        push({
          role: "agent",
          text: "Your GoodMash connection has been refreshed (demonstration only). If the issue continues, create a support ticket and a human-style agent will follow up.",
        });
        setActions(["create-ticket", "contact-support"]);
        break;
      case "create-ticket":
        setPhase("ticket");
        push({
          role: "agent",
          text: "Of course. In a sentence or two, what are you experiencing? I'll only use the details needed to help you.",
        });
        break;
      case "contact-support":
        push({
          role: "agent",
          text: "You can reach GoodMash.io at:\n• WhatsApp / Calls: +27 69 331 3143\n• Email: teenage2023bt@gmail.com\n• TikTok: @teenage910\n• YouTube: DJTeenage-Virus",
        });
        break;
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={openChat}
        aria-label="Open GoodMash AI Agent chat"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand-800 text-white shadow-xl ring-4 ring-white/70 transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
          <path
            d="M12 3C7 3 3 6.6 3 11c0 1.7.6 3.3 1.6 4.6L3 20l4.6-1.5c1.3.7 2.9 1 4.4 1 5 0 9-3.6 9-8s-4-8.5-9-8.5z"
            fill="currentColor"
          />
          <circle cx="8.5" cy="11" r="1.1" fill="#fff" />
          <circle cx="12" cy="11" r="1.1" fill="#fff" />
          <circle cx="15.5" cy="11" r="1.1" fill="#fff" />
        </svg>
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-500 ring-2 ring-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col bg-white shadow-2xl sm:bottom-5 sm:right-5 sm:h-[560px] sm:max-h-[80dvh] sm:w-[400px] sm:overflow-hidden sm:rounded-3xl sm:ring-1 sm:ring-brand-200">
      <div className="flex items-center justify-between gap-3 bg-brand-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-500 text-brand-950">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <circle cx="12" cy="5" r="2.4" fill="currentColor" />
              <circle cx="5" cy="18" r="2.4" fill="currentColor" />
              <circle cx="19" cy="18" r="2.4" fill="currentColor" />
              <path
                d="M12 5v4.2M10.4 10.1l-3.5 5.9M13.6 10.1l3.5 5.9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-extrabold">GoodMash AI Agent</p>
            <p className="text-xs text-brand-200">Online · 24/7 · AI assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticketRef && (
            <span className="hidden rounded-full bg-brand-800 px-2.5 py-1 text-[10px] font-bold text-gold-400 sm:block">
              {ticketRef}
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-brand-50/60 px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "rounded-br-md bg-brand-800 text-white"
                  : "rounded-bl-md border border-brand-200 bg-white text-ink"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-brand-200 bg-white px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:240ms]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-brand-100 bg-white px-4 py-3">
          {actions.includes("fix-connection") && (
            <ActionChip onClick={() => handleAction("fix-connection")}>
              Fix my connection
            </ActionChip>
          )}
          {actions.includes("create-ticket") && (
            <ActionChip onClick={() => handleAction("create-ticket")}>
              Create support ticket
            </ActionChip>
          )}
          {actions.includes("contact-support") && (
            <ActionChip onClick={() => handleAction("contact-support")}>
              Contact support
            </ActionChip>
          )}
          {actions.includes("view-pricing") && (
            <Link
              href="/pricing"
              className="rounded-full bg-brand-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
            >
              View pricing
            </Link>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-brand-100 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          aria-label="Message the GoodMash AI Agent"
          className="h-11 flex-1 rounded-full border border-brand-200 bg-brand-50 px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="grid h-11 w-11 place-items-center rounded-full bg-brand-800 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
          disabled={!input.trim() || typing}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M4 12l16-7-4.5 16-3.5-7-8-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      <p className="bg-white px-4 pb-2 text-center text-[10px] text-ink-soft">
        GoodMash AI Agent — responses are AI-generated, not from a human
        employee.
      </p>
    </div>
  );
}

function ActionChip({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-brand-300 px-3.5 py-1.5 text-xs font-bold text-brand-800 transition-colors hover:bg-brand-100"
    >
      {children}
    </button>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
