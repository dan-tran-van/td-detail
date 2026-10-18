'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, User, Mail, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Customer } from '@/lib/types';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';

interface CustomerAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handoffConversationId?: string;
  onSuccess?: (customer: Customer, claimedConv?: any) => void;
}

export function CustomerAuthDialog({
  open,
  onOpenChange,
  handoffConversationId,
  onSuccess,
}: CustomerAuthDialogProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'custom'>('demo');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginPersona = async (personaId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId,
          claimConversationId: handoffConversationId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      onOpenChange(false);
      if (handoffConversationId) {
        window.location.href = `/chat/${handoffConversationId}`;
      } else if (onSuccess) {
        onSuccess(data.customer, data.claimedConversation);
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customEmail.trim(),
          name: customName.trim() || undefined,
          claimConversationId: handoffConversationId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      onOpenChange(false);
      if (handoffConversationId) {
        window.location.href = `/chat/${handoffConversationId}`;
      } else if (onSuccess) {
        onSuccess(data.customer, data.claimedConversation);
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {handoffConversationId ? 'Save Chat & Link Account' : 'Customer Account Login'}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {handoffConversationId
                  ? 'Sign in to permanently save this active conversation and your message history.'
                  : 'Access your full multi-merchant support tickets and verified order history.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {handoffConversationId && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[11px] uppercase tracking-wider text-primary">
                Active Conversation Handoff
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chat thread <span className="font-mono font-medium text-foreground">#{handoffConversationId}</span> will be transferred immediately upon logging in.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`flex-1 pb-2 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'demo'
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            1-Click Demo Personas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 pb-2 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Email Login / Register
          </button>
        </div>

        {activeTab === 'demo' ? (
          <div className="space-y-2 py-2">
            <p className="text-[11px] text-muted-foreground">
              Select a pre-seeded customer profile to instantly evaluate multi-merchant order tracking and AI grounding:
            </p>
            <div className="flex flex-col gap-2">
              {SEED_CUSTOMERS.map((cust) => (
                <button
                  key={cust.id}
                  type="button"
                  disabled={loading}
                  onClick={() => handleLoginPersona(cust.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border bg-card hover:bg-muted/80 text-left transition-all cursor-pointer group"
                >
                  <Avatar className="h-9 w-9 border border-border shrink-0">
                    <AvatarImage src={cust.avatarUrl} />
                    <AvatarFallback className="text-xs font-bold">{cust.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                        {cust.name}
                      </span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1">
                        1-Click Sign In
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{cust.email}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomLogin} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="customEmail" className="text-xs">
                Email Address
              </Label>
              <Input
                id="customEmail"
                type="email"
                required
                placeholder="you@example.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="customName" className="text-xs">
                Your Name (Optional)
              </Label>
              <Input
                id="customName"
                type="text"
                placeholder="e.g. John Doe"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !customEmail.trim()}
              className="w-full text-xs h-9 gap-1.5"
            >
              {loading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              <span>{handoffConversationId ? 'Save & Continue' : 'Sign In / Register'}</span>
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
