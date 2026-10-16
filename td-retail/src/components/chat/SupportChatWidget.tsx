"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { getMerchantById } from "@/config/merchants";
import { ChatMessage, MerchantId } from "@/types";
import {
  MessageSquare,
  X,
  Send,
  UserCheck,
  ShieldAlert,
  CheckCircle,
  Info,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Loader2,
} from "lucide-react";

export function SupportChatWidget({
  currentMerchantId,
}: {
  currentMerchantId: MerchantId;
}) {
  const {
    isOpen,
    activeMerchantId,
    activeOrderId,
    initialMessage,
    openChat,
    closeChat,
  } = useChat();

  const effectiveMerchantId = isOpen ? activeMerchantId : currentMerchantId;
  const merchant = getMerchantById(effectiveMerchantId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when opened or merchant/order changes
  useEffect(() => {
    if (isOpen) {
      const defaultIntro =
        effectiveMerchantId === "merchant_a"
          ? `Hello! I am the **Aura Soundworks AI Support Concierge**, powered by TD Retail. I can help you track orders, verify our 30-day listening guarantee, or recommend acoustic pairings.`
          : `Hello! I am the **Terra Botanica AI Support Concierge**, powered by TD Retail. I can help you track shipments, review our 14-day freshness return policy, or explain our organic ingredients.`;

      const orderContextMsg = activeOrderId
        ? ` I have linked your active order **${activeOrderId}** to our session.`
        : "";

      setMessages([
        {
          id: "welcome-msg",
          sender: "agent",
          text: defaultIntro + orderContextMsg,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          toolOutcomes: activeOrderId
            ? [
                {
                  name: "Order Context Attached",
                  detail: `Pre-loaded order ${activeOrderId} into conversation.`,
                  status: "success",
                },
              ]
            : undefined,
        },
      ]);

      if (initialMessage) {
        handleSendMessage(initialMessage);
      }
    }
  }, [isOpen, effectiveMerchantId, activeOrderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "customer",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: effectiveMerchantId,
          message: text,
          orderId: activeOrderId,
          history: messages.map((m) => ({
            role: m.sender === "customer" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();

      if (data.status === "escalated") {
        setIsEscalated(true);
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: data.status,
        toolOutcomes: data.toolOutcomes,
        supportReference: data.supportReference,
        canEscalate: data.canEscalate,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error("Support chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "system",
          text: "We encountered a temporary connection issue. Your message has been logged for support review.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: effectiveMerchantId,
          message: "Customer requested human assistance.",
          orderId: activeOrderId,
          isEscalation: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsEscalated(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `esc-${Date.now()}`,
            sender: "agent",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "escalated",
            toolOutcomes: data.toolOutcomes,
            supportReference: data.supportReference,
            canEscalate: false,
          },
        ]);
      }
    } catch (e) {
      console.error("Failed to escalate:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    activeOrderId ? "Where is my order?" : "Check order status",
    "What is your return policy?",
    effectiveMerchantId === "merchant_a"
      ? "Tell me about the 2-Year Warranty"
      : "Are the candles 100% organic?",
    "Speak with a human agent",
  ];

  const isMerchantA = effectiveMerchantId === "merchant_a";

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() =>
            openChat({
              merchantId: currentMerchantId,
              orderId: activeOrderId,
            })
          }
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white ${
            isMerchantA
              ? "bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 shadow-amber-500/10"
              : "bg-emerald-700 hover:bg-emerald-800 border border-emerald-500/40 text-white shadow-emerald-700/20"
          }`}
          aria-label="Open Customer Support Chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-sm font-semibold tracking-wide">
            Support Chat
          </span>
          {activeOrderId && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 font-mono">
              #{activeOrderId.slice(-6)}
            </span>
          )}
        </button>
      )}

      {/* Embedded Support Chat Modal / Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-all animate-in fade-in slide-in-from-bottom-6 duration-200 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div
            className={`px-5 py-4 flex items-center justify-between text-white ${
              isMerchantA
                ? "bg-slate-900 border-b border-amber-500/30"
                : "bg-emerald-800 border-b border-emerald-600/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                  isMerchantA
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-600 text-emerald-100 border border-emerald-400/30"
                }`}
              >
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm tracking-wide">
                    {merchant?.name} Support
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/15 text-white/90 font-medium">
                    TD Retail AI
                  </span>
                </div>
                <p className="text-[11px] text-white/70 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {isEscalated ? "Priority Human Queue" : "Instant Resolution Engine"}
                </p>
              </div>
            </div>

            <button
              onClick={closeChat}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Linked Order Banner */}
          {activeOrderId && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Linked Order:{" "}
                <strong className="text-slate-900 dark:text-white font-mono">
                  {activeOrderId}
                </strong>
              </span>
              <span className="text-[10px] text-slate-500">
                Verified Context
              </span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((msg) => {
              const isUser = msg.sender === "customer";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                      isUser
                        ? isMerchantA
                          ? "bg-amber-600 text-white rounded-br-xs"
                          : "bg-emerald-600 text-white rounded-br-xs"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Tool Outcomes / Automated Lookups */}
                    {msg.toolOutcomes && msg.toolOutcomes.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                        {msg.toolOutcomes.map((t, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-[11px] p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-semibold">{t.name}: </span>
                              <span>{t.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Support Reference Badge */}
                    {msg.supportReference && (
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span>Ref: {msg.supportReference}</span>
                        {msg.status && (
                          <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {msg.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span>TD Retail AI is querying merchant resolution systems...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-1.5 text-xs no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Escalation Action Button */}
          {!isEscalated && (
            <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300">
              <span>Need human assistance?</span>
              <button
                onClick={handleEscalate}
                disabled={isLoading}
                className="font-medium underline hover:text-amber-950 dark:hover:text-amber-200 transition"
              >
                Request Human Agent
              </button>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${merchant?.name} support...`}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-amber-500 dark:focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`p-2.5 rounded-xl text-white transition disabled:opacity-40 ${
                isMerchantA
                  ? "bg-amber-600 hover:bg-amber-700 active:bg-amber-800"
                  : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
              }`}
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
