'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Terminal,
  Eye,
  CornerUpLeft,
  ShieldCheck,
  Disc,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OutboxEmail } from '@/lib/types';

export default function MerchantOutboxPage() {
  const [emails, setEmails] = useState<OutboxEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<OutboxEmail | null>(null);
  const [simulatingReply, setSimulatingReply] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  const fetchOutbox = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/merchant/outbox');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
      }
    } catch (err) {
      console.error('Error fetching merchant outbox emails:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutbox();
  }, []);

  const handleSimulateCustomerReply = async (email: OutboxEmail) => {
    setSimulatingReply(true);
    setSimulationMessage(null);

    try {
      // Simulate SendGrid Inbound Parse payload to /api/webhooks/sendgrid
      const formData = new FormData();
      formData.append('from', email.to);
      formData.append('to', email.replyTo || `reply+${email.conversationId}@inbound.tdretail.example.com`);
      formData.append('subject', `Re: ${email.subject}`);
      formData.append(
        'text',
        `Thanks for the update! I have checked the order status and everything looks good now.`
      );

      const res = await fetch('/api/webhooks/sendgrid', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSimulationMessage('Inbound reply webhook successfully processed! Gemini has processed the reply.');
        setTimeout(() => fetchOutbox(), 1000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setSimulationMessage(`Simulation error: ${errData.error || 'Webhook failed'}`);
      }
    } catch (err: any) {
      setSimulationMessage(`Simulation error: ${err.message}`);
    } finally {
      setSimulatingReply(false);
    }
  };

  const filteredEmails = emails.filter((em) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      em.to.toLowerCase().includes(q) ||
      em.subject.toLowerCase().includes(q) ||
      em.bodyText.toLowerCase().includes(q) ||
      em.conversationId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Gemini AI Outbound Email Audit
          </h1>
          <p className="text-xs text-muted-foreground">
            Audit customer emails dispatched by Gemini AI and SendGrid on behalf of your storefront.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOutbox}
          disabled={loading}
          className="h-8 text-xs gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Outbox</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
          <Input
            placeholder="Search recipient, subject, thread ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredEmails.length}</span> emails sent
        </div>
      </div>

      {/* Emails Table */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4">Sent Timestamp</th>
                <th className="py-3 px-4">Reply-To Routing</th>
                <th className="py-3 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && emails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      <span>Loading email audit trail...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">No sent emails recorded yet</p>
                    <p className="text-[11px]">
                      When customers receive Gemini AI resolutions or order notifications, copies appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmails.map((email) => (
                  <tr key={email.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{email.to}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Ref: {email.conversationId}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-foreground truncate">{email.subject}</div>
                      <div className="text-[10px] text-muted-foreground truncate line-clamp-1">
                        {email.bodyText}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {email.status === 'sent' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] gap-1 font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>SendGrid Delivered</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Simulated</span>
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {new Date(email.sentAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
                      {email.replyTo || `reply+${email.conversationId}@inbound`}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEmail(email);
                          setSimulationMessage(null);
                        }}
                        className="h-7 px-2.5 text-xs gap-1 font-medium cursor-pointer hover:border-primary"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Email Preview & Webhook Simulation Dialog */}
      <Dialog open={Boolean(selectedEmail)} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
          {selectedEmail && (
            <>
              <DialogHeader className="border-b border-border pb-3">
                <DialogTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="truncate pr-2">{selectedEmail.subject}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                    {selectedEmail.id}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground space-y-1 pt-1 block">
                  <span className="block">
                    <strong>To:</strong> {selectedEmail.to}
                  </span>
                  <span className="block">
                    <strong>From:</strong> {selectedEmail.from} (<strong>Reply-To:</strong>{' '}
                    <span className="font-mono text-[10px]">{selectedEmail.replyTo}</span>)
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {simulationMessage && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary flex items-start gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{simulationMessage}</span>
                  </div>
                )}

                {/* Rendered Email Body */}
                <div className="p-4 rounded-xl border border-border bg-card text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedEmail.bodyText}
                </div>
              </div>

              <DialogFooter className="border-t border-border pt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSimulateCustomerReply(selectedEmail)}
                  disabled={simulatingReply}
                  className="w-full sm:w-auto h-8 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
                >
                  {simulatingReply ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Simulating Inbound Reply...</span>
                    </>
                  ) : (
                    <>
                      <CornerUpLeft className="h-3 w-3" />
                      <span>Simulate Customer Inbound Reply</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => setSelectedEmail(null)}
                  className="w-full sm:w-auto h-8 text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

