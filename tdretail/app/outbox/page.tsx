'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Mail,
  Send,
  Inbox,
  Star,
  Clock,
  FileText,
  Trash2,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  ExternalLink,
  ShieldCheck,
  Disc,
  ShoppingBag,
  MoreVertical,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Paperclip,
  X,
  PanelLeft,
  Zap,
  Sparkles,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OutboxEmail, Customer } from '@/lib/types';

export default function GmailStyleOutboxPage() {
  const [emails, setEmails] = useState<OutboxEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<OutboxEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<'sent' | 'all' | 'starred'>('sent');
  const [selectedPersona, setSelectedPersona] = useState<'all' | 'sarah' | 'alex'>('all');
  const [mailboxSidebarOpen, setMailboxSidebarOpen] = useState(true);
  const [starredIds, setStarredIds] = useState<Record<string, boolean>>({});
  const [totalSystemCount, setTotalSystemCount] = useState(0);

  // Reply simulation modal state
  const [isSimulating, setIsSimulating] = useState(false);
  const [replyText, setReplyText] = useState('Thank you, this confirmed my inquiry.');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [simStatus, setSimStatus] = useState<string | null>(null);

  // Restore starred IDs and sidebar collapse state from localStorage
  useEffect(() => {
    try {
      const savedStars = localStorage.getItem('tdretail_outbox_starred');
      if (savedStars) {
        setStarredIds(JSON.parse(savedStars));
      }
      const savedSidebar = localStorage.getItem('tdretail_outbox_sidebar');
      if (savedSidebar !== null) {
        setMailboxSidebarOpen(savedSidebar === 'true');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleToggleSidebar = () => {
    setMailboxSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tdretail_outbox_sidebar', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const loadEmails = async () => {
    try {
      setLoading(true);
      let url = '/api/outbox';
      if (selectedPersona === 'sarah') {
        url += '?persona=sarah.connor@example.com';
      } else if (selectedPersona === 'alex') {
        url += '?persona=alex.chen@example.com';
      }
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        if (data.totalCount !== undefined) {
          setTotalSystemCount(data.totalCount);
        }
      }
    } catch (e) {
      console.error('Error fetching outbox:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, [selectedPersona]);

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStarredIds((prev) => {
      const updated = {
        ...prev,
        [id]: !prev[id],
      };
      try {
        localStorage.setItem('tdretail_outbox_starred', JSON.stringify(updated));
      } catch (err) {
        // ignore
      }
      return updated;
    });
  };

  const handleSimulateReply = (email: OutboxEmail) => {
    setSelectedEmail(email);
    setIsSimulating(true);
    setSimStatus(null);
  };

  const submitSimulatedReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;
    setSubmittingReply(true);
    setSimStatus(null);

    try {
      const res = await fetch('/api/webhooks/sendgrid/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedEmail.conversationId,
          replyText: replyText.trim(),
          customerEmail: selectedEmail.to,
          customSubject: `Re: ${selectedEmail.subject}`,
          fromEmail: selectedEmail.to,
          toEmail: selectedEmail.replyTo,
          subject: `Re: ${selectedEmail.subject}`,
          bodyText: replyText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSimStatus('Reply delivered to SendGrid inbound webhook & routed to conversation thread.');
        setTimeout(() => {
          setIsSimulating(false);
          loadEmails();
        }, 1500);
      } else {
        setSimStatus(data.error || 'Failed to simulate email reply');
      }
    } catch (err: any) {
      setSimStatus(err.message || 'Network error');
    } finally {
      setSubmittingReply(false);
    }
  };

  const filteredEmails = emails.filter((email) => {
    if (activeFolder === 'starred' && !starredIds[email.id]) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = email.subject.toLowerCase().includes(q);
      const matchTo = email.to.toLowerCase().includes(q);
      const matchFrom = email.from.toLowerCase().includes(q);
      const matchMerchant = email.merchantName.toLowerCase().includes(q);
      const matchBody = email.bodyText.toLowerCase().includes(q);
      return matchSubject || matchTo || matchFrom || matchMerchant || matchBody;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-screen w-screen bg-background overflow-hidden">
      {/* Gmail Top App Bar */}
      <header className="min-h-16 border-b border-border/80 px-3 sm:px-4 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4 bg-card/60 backdrop-blur shrink-0">
        {/* Brand / Title + Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title={mailboxSidebarOpen ? "Collapse mailbox sidebar" : "Expand mailbox sidebar"}
            aria-label={mailboxSidebarOpen ? "Collapse mailbox sidebar" : "Expand mailbox sidebar"}
          >
            <PanelLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-foreground">
                  TD Mail Outbox
                </span>
                <Badge variant="outline" className="text-[9px] sm:text-[10px] h-4 px-1 text-muted-foreground">
                  SendGrid
                </Badge>
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block">Customer Notification Inbox</p>
            </div>
          </div>
        </div>

        {/* Gmail Search Bar */}
        <div className="flex-1 min-w-[200px] max-w-2xl relative order-last sm:order-none w-full sm:w-auto">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search mail by recipient, merchant, or subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedEmail) setSelectedEmail(null);
            }}
            className="w-full h-10 pl-10 pr-9 rounded-full bg-muted/60 border-border/80 focus-visible:bg-background text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls & Persona Filter */}
        {/* Action Controls & Demo Persona Filter */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
          {/* Persona Filter: Only Demo Personas */}
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/50 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setSelectedPersona('all');
                setSelectedEmail(null);
              }}
              className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedPersona === 'all'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Demo ({totalSystemCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPersona('sarah');
                setSelectedEmail(null);
              }}
              className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedPersona === 'sarah'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sarah Connor
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPersona('alex');
                setSelectedEmail(null);
              }}
              className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedPersona === 'alex'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Alex Chen
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadEmails}
            disabled={loading}
            className="h-8 gap-1.5 text-xs rounded-lg px-2 sm:px-3 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <NextLink href="/inbox">
            <Button size="sm" variant="secondary" className="h-8 gap-1.5 text-xs rounded-lg px-2 sm:px-3 cursor-pointer">
              <Inbox className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Console</span>
            </Button>
          </NextLink>
        </div>
      </header>

      {/* Gmail Body Layout: Left Sidebar + Mail List / Detail View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Mail Folders Sidebar (collapsible with transition) */}
        <aside
          className={`border-r border-border/80 bg-card/30 p-2 sm:p-3 flex flex-col gap-1 shrink-0 transition-all duration-200 ${
            mailboxSidebarOpen ? 'w-48 sm:w-56' : 'w-14 items-center'
          }`}
        >
          {mailboxSidebarOpen && (
            <div className="pb-2 mb-1 border-b border-border/60">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Mailbox
              </div>
            </div>
          )}

          <Button
            variant={activeFolder === 'sent' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveFolder('sent');
              setSelectedEmail(null);
            }}
            title="Sent Messages"
            className={`w-full h-9 text-xs rounded-full px-3 font-medium ${
              mailboxSidebarOpen ? 'justify-start gap-3' : 'justify-center p-0 size-9'
            }`}
          >
            <Send className="h-4 w-4 text-primary shrink-0" />
            {mailboxSidebarOpen && (
              <>
                <span className="flex-1 text-left">Sent Messages</span>
                <span className="text-[11px] text-muted-foreground">{emails.length}</span>
              </>
            )}
          </Button>

          <Button
            variant={activeFolder === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveFolder('all');
              setSelectedEmail(null);
            }}
            title="All Mail"
            className={`w-full h-9 text-xs rounded-full px-3 ${
              mailboxSidebarOpen ? 'justify-start gap-3' : 'justify-center p-0 size-9'
            }`}
          >
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            {mailboxSidebarOpen && (
              <>
                <span className="flex-1 text-left">All Mail</span>
                <span className="text-[11px] text-muted-foreground">{emails.length}</span>
              </>
            )}
          </Button>

          <Button
            variant={activeFolder === 'starred' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveFolder('starred');
              setSelectedEmail(null);
            }}
            title="Starred Messages"
            className={`w-full h-9 text-xs rounded-full px-3 ${
              mailboxSidebarOpen ? 'justify-start gap-3' : 'justify-center p-0 size-9'
            }`}
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500/20 shrink-0" />
            {mailboxSidebarOpen && (
              <>
                <span className="flex-1 text-left">Starred</span>
                <span className="text-[11px] text-muted-foreground">
                  {Object.values(starredIds).filter(Boolean).length}
                </span>
              </>
            )}
          </Button>

          {mailboxSidebarOpen && (
            <div className="mt-auto pt-4 border-t border-border/60">
              <div className="p-2.5 rounded-xl border border-border bg-muted/40 text-[11px] space-y-1 text-muted-foreground">
                <span className="font-semibold text-foreground block flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Inbound Webhook
                </span>
                <p className="leading-relaxed">
                  Click <strong>"Reply via Email"</strong> on any email to test customer response routing via SendGrid.
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {selectedEmail ? (
            /* Gmail Detailed Email View */
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Detail Toolbar */}
              <div className="h-12 border-b border-border/80 px-4 flex items-center justify-between gap-2 shrink-0 bg-card/20">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedEmail(null)}
                    title="Back to sent list"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSimulateReply(selectedEmail)}
                    title="Reply via Email"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <CornerUpLeft className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSimulateReply(selectedEmail)}
                    className="h-7 text-xs gap-1.5"
                  >
                    <CornerUpLeft className="h-3.5 w-3.5" />
                    <span>Reply via Email</span>
                  </Button>

                  <NextLink href={`/chat/${selectedEmail.conversationId}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <span>View Live Chat</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </NextLink>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-6">
                {/* Subject & Status */}
                <div className="space-y-2 border-b border-border pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                      {selectedEmail.subject}
                    </h1>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      SendGrid Delivered
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span>Merchant: <strong>{selectedEmail.merchantName}</strong></span>
                    <span>•</span>
                    <span>Thread #{selectedEmail.conversationId}</span>
                  </div>
                </div>

                {/* Sender / Recipient Metadata Card */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-card/60">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {selectedEmail.merchantName.charAt(0)}
                    </div>
                    <div className="space-y-0.5 min-w-0 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {selectedEmail.merchantName} Support
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          &lt;{selectedEmail.from}&gt;
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        to <span className="text-foreground">{selectedEmail.to}</span>
                      </div>
                      <div className="text-primary font-mono text-[11px] pt-0.5">
                        Reply-To: <strong>{selectedEmail.replyTo}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-muted-foreground shrink-0">
                    <div>{new Date(selectedEmail.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div>{new Date(selectedEmail.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="rounded-2xl border border-border bg-card p-6 min-h-[220px] shadow-xs">
                  {selectedEmail.bodyHtml ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                      className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {selectedEmail.bodyText}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Reply Routing Explanation Box */}
                <div className="p-4 rounded-xl border border-border bg-muted/40 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>How Customer Email Reply Ingestion Works</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    This notification set the header <code className="bg-background px-1 py-0.5 rounded border border-border font-mono text-foreground">{selectedEmail.replyTo}</code>.
                    When the customer responds via their standard email app, SendGrid's Inbound Parse webhook decodes the conversation identifier, appends the response to the customer's chat, and triggers the autonomous resolution engine to formulate the resolution.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Gmail Table-Style Email List */
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* List Header / Filter bar */}
              <div className="border-b border-border/80 px-4 py-2 flex flex-col gap-2 bg-card/20 shrink-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
                      {activeFolder === 'sent' ? 'Sent Notifications' : activeFolder === 'starred' ? 'Starred Messages' : 'All Messages'} ({filteredEmails.length})
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      Demo Personas Only
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">Active user session data protected</span>
                </div>

                {/* Privacy Shield Banner */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] leading-relaxed">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong>Demo Audit Sandbox:</strong> Displays email logs exclusively for verified demo personas (Sarah Connor & Alex Chen). Active customer session communications are dispatched privately via SendGrid and strictly excluded.
                  </span>
                </div>
              </div>

              {/* Scrollable Email Row Items */}
              <div className="flex-1 overflow-y-auto divide-y divide-border/60">
                {loading ? (
                  <div className="p-16 text-center text-xs text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading outbox emails...
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="p-16 text-center text-muted-foreground space-y-2">
                    <Mail className="h-10 w-10 mx-auto opacity-30" />
                    <p className="text-sm font-semibold text-foreground">No outgoing emails found</p>
                    <p className="text-xs">Inquiries created in the customer inbox generate notification records here.</p>
                  </div>
                ) : (
                  filteredEmails.map((email) => {
                    const isStarred = !!starredIds[email.id];
                    const isMusic = email.merchantId === 'merchant_music';

                    return (
                      <div
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors text-xs"
                      >
                        {/* Star Toggle */}
                        <button
                          onClick={(e) => toggleStar(e, email.id)}
                          className="text-muted-foreground hover:text-amber-500 shrink-0 transition-colors"
                          title="Star message"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isStarred ? 'text-amber-500 fill-amber-500' : 'opacity-40 hover:opacity-100'
                            }`}
                          />
                        </button>

                        {/* Recipient / Merchant */}
                        <div className="w-28 sm:w-48 md:w-56 shrink-0 flex items-center gap-2 truncate">
                          {email.merchantId === 'merchant_music' ? (
                            <Disc className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : email.merchantId === 'merchant_b' ? (
                            <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : email.merchantId === 'merchant_platform' ? (
                            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : (
                            <ShoppingBag className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                          <span className="font-semibold text-foreground truncate text-xs">
                            {email.merchantName}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate hidden lg:inline">
                            to {email.to}
                          </span>
                        </div>

                        {/* Subject & Snippet */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className="font-medium text-foreground truncate text-xs">
                            {email.subject}
                          </span>
                          <span className="text-muted-foreground text-[11px] truncate hidden md:inline">
                            - {email.bodyText}
                          </span>
                        </div>

                        {/* Date / Time */}
                        <div className="text-right text-[10px] sm:text-[11px] text-muted-foreground shrink-0 group-hover:text-foreground font-mono">
                          {new Date(email.sentAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Simulation Modal */}
      <Dialog open={isSimulating} onOpenChange={setIsSimulating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CornerUpLeft className="h-5 w-5 text-primary" />
              <span>Send Inbound Email Reply</span>
            </DialogTitle>
            <DialogDescription>
              Test SendGrid Inbound Parse reply ingestion into the conversation thread.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {simStatus && (
              <div className="p-2.5 rounded-lg text-xs bg-muted text-foreground border border-border">
                {simStatus}
              </div>
            )}

            <div className="space-y-1 font-mono text-xs bg-muted/50 p-2.5 rounded-lg border border-border">
              <div>
                <span className="text-muted-foreground">To (Webhook Reply-To):</span>{' '}
                <span className="text-foreground">{selectedEmail?.replyTo}</span>
              </div>
              <div>
                <span className="text-muted-foreground">From (Shopper Email):</span>{' '}
                <span className="text-foreground">{selectedEmail?.to}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Customer Email Reply Text</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setIsSimulating(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={submittingReply || !replyText.trim()}
                onClick={submitSimulatedReply}
                className="gap-1.5"
              >
                {submittingReply ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>Send Email Reply</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
