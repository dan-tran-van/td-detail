'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  Disc,
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TDLogo } from '@/components/TDLogo';

export default function MerchantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/merchant/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      router.push('/merchant');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (merchantId: string) => {
    setError(null);
    setDemoLoading(merchantId);

    try {
      const res = await fetch('/api/merchant/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoMerchantId: merchantId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate demo merchant.');
      }

      router.push('/merchant');
    } catch (err: any) {
      setError(err.message || 'Demo authentication failed.');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <NextLink href="/" className="inline-flex items-center gap-2 mb-2 group cursor-pointer">
          <TDLogo size="md" showWordmark />
        </NextLink>
        <p className="text-xs text-muted-foreground">
          Dedicated administration & human escalation management for registered storefronts.
        </p>
      </div>

      <Card className="border-border shadow-xl backdrop-blur-md bg-card/95">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>Merchant Authentication</span>
            <Badge variant="outline" className="text-[10px] font-medium">
              Multi-Merchant
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Choose a quick demo merchant or sign in with your staff email.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Switcher Section */}
          <div className="space-y-2 pb-2 border-b border-border">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              1-Click Demo Evaluation Login
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={Boolean(demoLoading || loading)}
                onClick={() => handleDemoLogin('merchant_music')}
                className="h-14 p-2.5 flex items-center justify-start gap-2.5 rounded-xl border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  {demoLoading === 'merchant_music' || demoLoading === 'merchant_a' ? (
                     <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Disc className="h-4 w-4" />
                  )}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-foreground truncate">SoundWave Digital</div>
                  <div className="text-[10px] text-muted-foreground">Digital Music (Merchant A)</div>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={Boolean(demoLoading || loading)}
                onClick={() => handleDemoLogin('merchant_b')}
                className="h-14 p-2.5 flex items-center justify-start gap-2.5 rounded-xl border-border hover:border-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  {demoLoading === 'merchant_b' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-foreground truncate">Volt Nest Store</div>
                  <div className="text-[10px] text-muted-foreground">Consumer Tech (Merchant B)</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Standard Email Login Form */}
          <form onSubmit={handleStandardLogin} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Staff Account Email</span>
              </label>
              <Input
                type="email"
                placeholder="admin@soundwave.store"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                (Any test password accepted for seeded accounts)
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || Boolean(demoLoading)}
              className="w-full h-9 rounded-lg text-xs font-semibold gap-2 cursor-pointer bg-primary text-primary-foreground"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Merchant Staff</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pt-2 border-t border-border flex flex-col gap-2">
          <div className="text-center text-xs text-muted-foreground w-full">
            Don&apos;t have a registered storefront?{' '}
            <NextLink
              href="/merchant/register"
              className="text-primary font-semibold hover:underline"
            >
              Register a Merchant
            </NextLink>
          </div>
          <div className="text-center w-full">
            <NextLink
              href="/"
              className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Public Platform</span>
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
