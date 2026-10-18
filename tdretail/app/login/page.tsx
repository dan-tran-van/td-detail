'use client';

import React, { useState, Suspense } from 'react';
import NextLink from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  User,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';

function CustomerLoginPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const returnUrl = searchParams.get('returnUrl') || '/inbox';
  const claimConv = searchParams.get('claimConv') || searchParams.get('claimConversationId') || undefined;

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
          claimConversationId: claimConv,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      if (claimConv) {
        window.location.href = `/chat/${claimConv}`;
      } else {
        window.location.href = returnUrl;
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
          claimConversationId: claimConv,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      if (claimConv) {
        window.location.href = `/chat/${claimConv}`;
      } else {
        window.location.href = returnUrl;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-md space-y-4">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <NextLink
            href={claimConv ? `/chat/${claimConv}` : '/inbox'}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {claimConv ? 'Active Chat' : 'Support Inbox'}</span>
          </NextLink>

          <NextLink
            href="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            TD Retail Home
          </NextLink>
        </div>

        {/* Claim Conversation Highlight Alert */}
        {claimConv && (
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 text-xs text-foreground flex items-start gap-3 shadow-xs">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-primary text-xs uppercase tracking-wider">
                Conversation Handoff Ready
              </span>
              <p className="text-muted-foreground mt-0.5">
                Thread <span className="font-mono font-medium text-foreground">#{claimConv}</span> will be permanently linked to your account when you sign in below.
              </p>
            </div>
          </div>
        )}

        <Card className="border-border shadow-lg bg-card">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
                TD
              </div>
              <CardTitle className="text-lg font-bold">Shopper Account Login</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Access your multi-merchant orders, AI support threads, and SendGrid customer outbox.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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
                1-Click Demo Evaluation
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
                Email Sign In / Register
              </button>
            </div>

            {activeTab === 'demo' ? (
              <div className="space-y-2.5 pt-1">
                <p className="text-[11px] text-muted-foreground">
                  Select a pre-configured customer identity to test order verification and AI grounding:
                </p>
                <div className="flex flex-col gap-2">
                  {SEED_CUSTOMERS.map((cust) => (
                    <button
                      key={cust.id}
                      type="button"
                      disabled={loading}
                      onClick={() => handleLoginPersona(cust.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/80 text-left transition-all cursor-pointer group"
                    >
                      <Avatar className="h-10 w-10 border border-border shrink-0">
                        <AvatarImage src={cust.avatarUrl} />
                        <AvatarFallback className="text-xs font-bold">{cust.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                            {cust.name}
                          </span>
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-normal">
                            Sign In
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{cust.email}</p>
                        <p className="text-[11px] text-muted-foreground/75 truncate mt-0.5">{cust.defaultAddress}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCustomLogin} className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="pageEmail" className="text-xs font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="pageEmail"
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pageName" className="text-xs font-semibold">
                    Customer Name (Optional)
                  </Label>
                  <Input
                    id="pageName"
                    type="text"
                    placeholder="e.g. Alex Chen"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !customEmail.trim()}
                  className="w-full text-xs h-9 gap-1.5 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  <span>{claimConv ? 'Save Conversation & Continue' : 'Sign In / Register'}</span>
                </Button>
              </form>
            )}

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Merchant team member?</span>
              <NextLink
                href="/merchant/login"
                className="text-primary hover:underline font-semibold"
              >
                Merchant Staff Portal →
              </NextLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <CustomerLoginPageInner />
    </Suspense>
  );
}
