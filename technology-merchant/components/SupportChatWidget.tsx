'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  createSupportSession,
  sendFollowupMessage,
  getTDRetailPortalUrl,
} from '@/lib/api-sync';
import { SupportMessage, SupportConversation } from '@/lib/types';
import { useVisitor } from '@/context/VisitorContext';
import { useOrders } from '@/context/OrderContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface SupportChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export function SupportChatWidget({
  isOpen,
  onClose,
  initialOrderId,
}: SupportChatWidgetProps) {
  const { visitor } = useVisitor();
  const { getOrderById } = useOrders();
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    if (!conversation) {
      handleInitSupport(initialOrderId);
    }
  }, [isOpen, initialOrderId]);

  const handleInitSupport = async (orderId?: string) => {
    setLoading(true);
    setError(null);

    const subject = orderId
      ? `Inquiry regarding Volt Nest order #${orderId}`
      : 'Customer inquiry for Volt Nest tech accessories';

    const initialMessage = orderId
      ? `Hello, I need assistance with my Volt Nest order #${orderId}. Could you help me check its status?`
      : 'Hello, I have a question about Volt Nest products, warranty, or replacement policy.';

    const matchedOrder = orderId ? getOrderById(orderId) : undefined;

    const result = await createSupportSession({
      orderId,
      order: matchedOrder,
      subject,
      initialMessage,
      customerEmail: visitor.email,
      customerName: visitor.name,
    });

    if (result.success && result.conversation) {
      setConversation(result.conversation);
      const initialMsgs: SupportMessage[] = [
        {
          id: `msg_cust_${Date.now()}`,
          conversationId: result.conversation.id,
          sender: 'customer',
          senderName: visitor.name,
          content: initialMessage,
          timestamp: new Date().toISOString(),
        },
      ];

      if (result.initialAiReply) {
        initialMsgs.push(result.initialAiReply);
      }

      setMessages(initialMsgs);
    } else {
      setError(result.error || 'Could not connect to TD Retail AI support backend.');
    }

    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending || !conversation) return;

    const userText = inputText.trim();
    setInputText('');
    setSending(true);

    const optimisticMsg: SupportMessage = {
      id: `msg_cust_${Date.now()}`,
      conversationId: conversation.id,
      sender: 'customer',
      senderName: visitor.name,
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    const result = await sendFollowupMessage(conversation.id, userText, {
      email: visitor.email,
      id: visitor.id,
      name: visitor.name,
    });

    if (result.success && result.aiReply) {
      setMessages((prev) => [...prev, result.aiReply!]);
    } else if (result.error) {
      setError(result.error);
    }

    setSending(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border bg-card/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs vn-glow-blue">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold text-foreground">
                  Volt Nest Resolution Support
                </SheetTitle>
                <SheetDescription className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span>TD Retail Grounded AI Engine</span>
                </SheetDescription>
              </div>
            </div>

            <Badge variant="outline" className="text-[10px] font-mono border-border">
              Merchant B
            </Badge>
          </div>

          {conversation?.orderId && (
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border text-xs">
              <span className="text-muted-foreground text-[11px]">Linked Order:</span>
              <code className="font-mono font-bold text-foreground">{conversation.orderId}</code>
            </div>
          )}
        </SheetHeader>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-2 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <span className="text-xs">Connecting to TD Retail Gemini Support...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-xs font-semibold">Connection Notice</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isCustomer ? 'justify-end' : 'justify-start'}`}
              >
                {!isCustomer && (
                  <Avatar className="h-7 w-7 border border-border shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs space-y-1.5 shadow-xs ${
                    isCustomer
                      ? 'bg-primary text-primary-foreground rounded-tr-xs'
                      : 'bg-card border border-border text-foreground rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-80">
                    <span className="font-semibold">{msg.senderName}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {isCustomer ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-1.5 [&_ul]:my-2 [&_ul]:pl-4 [&_ul]:list-disc [&_ol]:my-2 [&_ol]:pl-4 [&_ol]:list-decimal [&_li]:my-0.5 [&_code]:bg-muted/80 [&_code]:text-foreground [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[11px] [&_code]:font-mono [&_code]:border [&_code]:border-border/60 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {msg.metadata?.isAiGrounded && (
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-primary font-medium">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified with TD Retail server records</span>
                    </div>
                  )}

                  {msg.metadata?.escalationTriggered && (
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-destructive font-medium">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Transferred to Volt Nest Senior Specialist</span>
                    </div>
                  )}
                </div>

                {isCustomer && (
                  <Avatar className="h-7 w-7 border border-border shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px] font-bold bg-muted text-foreground">
                      VN
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}

          {sending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground italic pl-9">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Gemini is checking order records...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-border bg-card/40 space-y-2">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about warranty, replacement, tracking, or product specs..."
              className="min-h-[44px] max-h-24 resize-none text-xs bg-background"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={sending || !inputText.trim()}
              className="h-10 w-10 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>Also saved to your inbox:</span>
            <a
              href={
                conversation?.id
                  ? `${getTDRetailPortalUrl()}/chat/${conversation.id}?customerEmail=${encodeURIComponent(visitor.email)}&customerName=${encodeURIComponent(visitor.name)}&customerId=${encodeURIComponent(visitor.id)}`
                  : `${getTDRetailPortalUrl()}/inbox?customerEmail=${encodeURIComponent(visitor.email)}&customerName=${encodeURIComponent(visitor.name)}&customerId=${encodeURIComponent(visitor.id)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              <span>{conversation?.id ? 'Open in TD Retail' : 'Consolidated Inbox'}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
