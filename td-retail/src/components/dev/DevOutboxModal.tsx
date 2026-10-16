"use client";

import React, { useState, useEffect } from "react";
import { DevEmail } from "@/types";
import {
  Mail,
  X,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export function DevOutboxModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<DevEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<DevEmail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/emails");
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        if (data.emails?.length > 0 && !selectedEmail) {
          setSelectedEmail(data.emails[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load dev outbox:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmails();
    }
  }, [isOpen]);

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear the local development outbox?"))
      return;
    try {
      await fetch("/api/dev/emails", { method: "DELETE" });
      setEmails([]);
      setSelectedEmail(null);
    } catch (e) {
      console.error("Failed to clear outbox:", e);
    }
  };

  return (
    <>
      {/* Trigger Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-slate-200 border border-slate-700 text-xs shadow-lg backdrop-blur transition hover:scale-105"
        title="Open simulated email outbox diagnostic inspector"
      >
        <Mail className="w-4 h-4 text-amber-400" />
        <span className="font-medium">Dev Email Outbox</span>
        {emails.length > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
            {emails.length}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl h-[750px] max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">
                    Simulated Email Outbox Inspector
                  </h2>
                  <p className="text-xs text-slate-500">
                    Captures order confirmation emails sent via SendGrid / local fallback
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchEmails}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                  title="Refresh outbox"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
                {emails.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                    title="Clear outbox"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Email List Sidebar */}
              <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40">
                {emails.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    <Mail className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-medium">Outbox is empty</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Complete a checkout on Merchant A or B to trigger an order confirmation email.
                    </p>
                  </div>
                ) : (
                  emails.map((email) => {
                    const isSelected = selectedEmail?.id === email.id;
                    return (
                      <button
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`w-full text-left p-3.5 border-b border-slate-100 dark:border-slate-800/80 transition flex flex-col gap-1 ${
                          isSelected
                            ? "bg-amber-500/10 border-l-4 border-l-amber-500"
                            : "hover:bg-slate-100 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {email.merchantName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(email.sentAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                          {email.subject}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          To: {email.to}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Email Preview Area */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
                {selectedEmail ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Email Headers Meta */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-xs space-y-1.5 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-semibold w-16">
                          SUBJECT:
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">
                          {selectedEmail.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-semibold w-16">
                          TO:
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {selectedEmail.to}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-semibold w-16">
                          FROM:
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {selectedEmail.fromName} &lt;{selectedEmail.from}&gt;
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-semibold w-16">
                          REPLY-TO:
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {selectedEmail.replyTo} (Routes to TD Retail)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-semibold w-16">
                          STATUS:
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          {selectedEmail.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* HTML Iframe Render Preview */}
                    <div className="flex-1 overflow-auto p-4 bg-slate-100 dark:bg-slate-950 flex justify-center">
                      <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                        <iframe
                          srcDoc={selectedEmail.htmlContent}
                          title="Email Render Preview"
                          className="w-full h-[480px] border-0"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                    Select an email to view rendered HTML and headers
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
