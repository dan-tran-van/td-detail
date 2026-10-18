'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CornerDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Conversation, Message } from '@/lib/types';

export default function MerchantEscalationsPage() {
  const [escalations, setEscalations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [resolveOnReply, setResolveOnReply] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  const fetchEscalations = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const initialId = urlParams.get('id');

      const res = await fetch('/api/merchant/escalations');
      if (res.ok) {
        const data = await res.json();
        const list: Conversation[] = data.escalations || [];
        setEscalations(list);

        // Select initial if provided or first
        if (initialId) {
          const match = list.find((c) => c.id === initialId);
          if (match) {
            setSelectedConv(match);
          } else if (list.length > 0) {
            setSelectedConv(list[0]);
          }
        } else if (list.length > 0 && !selectedConv) {
          setSelectedConv(list[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/merchant/escalations?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
    } else {
      setMessages([]);
    }
  }, [selectedConv?.id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/merchant/escalations/${selectedConv.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyText.trim(),
          resolve: resolveOnReply,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setReplyText('');

        // Refresh escalation list
        await fetchEscalations();

        if (resolveOnReply) {
          // If resolved, it might no longer be in the escalations list
          setSelectedConv(null);
        }
      }
    } catch (err) {
      console.error('Failed to submit human agent reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const filteredEscalations = escalations.filter((c) => {
    if (!filterSearch.trim()) return true;
    const q = filterSearch.toLowerCase();
    return (
      c.subject.toLowerCase().includes(q) ||
      c.customerEmail.toLowerCase().includes(q) ||
      c.customerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Human Support Escalation Center
          </h1>
          <p className="text-xs text-muted-foreground">
            Customer inquiries escalated by Gemini requiring merchant intervention, refunds, or manual courier exceptions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchEscalations}
          disabled={loading}
          className="h-8 text-xs gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left Column: Escalations Queue (4 cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Escalated Queue</span>
                <Badge variant="destructive" className="text-[10px] py-0 px-1.5 rounded-full">
                  {escalations.length}
                </Badge>
              </span>
            </div>

            <div className="relative">
              <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
              <Input
                placeholder="Search ticket or customer..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-background"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loading && escalations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                <span>Checking escalation queue...</span>
              </div>
            ) : filteredEscalations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto opacity-80" />
                <p className="font-medium text-foreground">No pending escalations!</p>
                <p className="text-[11px]">
                  All current customer support requests have been successfully handled by Gemini AI.
                </p>
              </div>
            ) : (
              filteredEscalations.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground truncate">
                        {conv.subject}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(conv.lastMessageAt || conv.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
                      <User className="h-3 w-3 shrink-0" />
                      <span>{conv.customerName} ({conv.customerEmail})</span>
                    </div>

                    {conv.escalationReason && (
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded px-2 py-0.5 line-clamp-2">
                        {conv.escalationReason}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Thread & Human Reply Box (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 border-b border-border bg-muted/20 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-foreground truncate">
                      {selectedConv.subject}
                    </h2>
                    <Badge variant="destructive" className="text-[9px] uppercase">
                      Escalated
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Customer: {selectedConv.customerName} • {selectedConv.customerEmail}
                  </p>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                {loadingMessages ? (
                  <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading message log...</span>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAi = msg.sender === 'ai';
                    const isHumanStaff = msg.sender === 'human_agent';
                    const isCustomer = msg.sender === 'customer';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${
                          isCustomer
                            ? 'mr-auto items-start'
                            : 'ml-auto items-end'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 px-1">
                          {isAi && <Sparkles className="h-3 w-3 text-primary" />}
                          {isHumanStaff && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                          {isCustomer && <User className="h-3 w-3" />}
                          <span className="font-semibold">{msg.senderName}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp || msg.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${
                            isCustomer
                              ? 'bg-card border border-border text-foreground rounded-tl-xs shadow-xs'
                              : isHumanStaff
                              ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                              : 'bg-primary/10 border border-primary/20 text-foreground rounded-tr-xs'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Tool call audit badge */}
                        {msg.metadata?.toolCalls && msg.metadata.toolCalls.length > 0 && (
                          <div className="mt-1 text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                            Executed tool: {msg.metadata.toolCalls.map((t) => t.name).join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-border bg-card space-y-2">
                <Textarea
                  placeholder="Type human specialist response to customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="text-xs resize-none"
                  required
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={resolveOnReply}
                      onChange={(e) => setResolveOnReply(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Mark ticket as resolved upon reply</span>
                  </label>

                  <Button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground cursor-pointer"
                  >
                    {sendingReply ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3" />
                        <span>Dispatch Response</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground space-y-2">
              <MessageSquare className="h-8 w-8 text-muted-foreground opacity-40" />
              <p className="font-medium text-foreground">Select an escalated conversation</p>
              <p className="text-[11px] max-w-xs">
                Pick a ticket from the left queue to review Gemini&apos;s thoughts and send a manual human resolution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

