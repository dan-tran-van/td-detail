'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Palette,
  FileText,
  Mail,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'ai_policy' | 'account'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [merchantId, setMerchantId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [category, setCategory] = useState<'digital_music' | 'tech_accessories' | 'groceries' | 'general'>('tech_accessories');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [storefrontUrl, setStorefrontUrl] = useState('http://localhost:3000');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [supportEmail, setSupportEmail] = useState('');

  // AI Policy states
  const [returnsPolicy, setReturnsPolicy] = useState('Standard 14-day return window for unopened hardware. Return shipping covered for verified defects.');
  const [refundsPolicy, setRefundsPolicy] = useState('Refunds processed within 3-5 business days upon approved return.');
  const [deliveryPolicy, setDeliveryPolicy] = useState('Dispatched via tracked express courier with signature required for orders over $100.');
  const [escalationThreshold, setEscalationThreshold] = useState('Disputes exceeding $50 or repeated shipping delays escalate to senior human specialist.');

  // Staff Account states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');

  const handleNameChange = (val: string) => {
    setMerchantName(val);
    if (!merchantId) {
      setMerchantId(`merchant_${val.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
    }
    if (!supportEmail) {
      setSupportEmail(`support@${val.toLowerCase().replace(/[^a-z0-9]/g, '')}.store`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanId = (merchantId || `merchant_${Date.now()}`).trim().toLowerCase();
      const cleanName = merchantName.trim();

      if (!cleanId || !cleanName) {
        throw new Error('Merchant ID and Storefront Name are required.');
      }

      // 1. Call existing dynamic merchant registration endpoint
      const merchRes = await fetch('/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cleanId,
          name: cleanName,
          category,
          tagline: tagline.trim() || `${cleanName} Storefront`,
          description: description.trim() || `Official storefront for ${cleanName} on TD Retail.`,
          brandColor,
          accentColor: brandColor,
          iconName: category === 'digital_music' ? 'disc' : category === 'tech_accessories' ? 'zap' : 'shopping-bag',
          supportEmail: supportEmail.trim() || `support@${cleanId}.store`,
          storefrontUrl: storefrontUrl.trim() || 'http://localhost:3000',
          supportPolicy: {
            returns: returnsPolicy.trim(),
            refunds: refundsPolicy.trim(),
            deliveryOrDownload: deliveryPolicy.trim(),
            escalationThreshold: escalationThreshold.trim(),
          },
        }),
      });

      const merchData = await merchRes.json();
      if (!merchRes.ok) {
        throw new Error(merchData.error || 'Failed to register merchant on platform.');
      }

      // 2. Automatically establish merchant session for the creator
      const sessRes = await fetch('/api/merchant/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demoMerchantId: cleanId,
        }),
      });

      if (!sessRes.ok) {
        console.warn('Session automatic setup warning, redirecting to login');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/merchant');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center space-y-1">
        <NextLink href="/merchant/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Merchant Login</span>
        </NextLink>
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Register New Merchant Storefront
        </h1>
        <p className="text-xs text-muted-foreground">
          Onboard your store into TD Retail, configure autonomous support policies, and access merchant operations.
        </p>
      </div>

      <Card className="border-border shadow-xl backdrop-blur-md bg-card/95">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3 border-b border-border">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="details" className="text-xs">
                  1. Store Identity
                </TabsTrigger>
                <TabsTrigger value="ai_policy" className="text-xs">
                  2. Support Policy
                </TabsTrigger>
                <TabsTrigger value="account" className="text-xs">
                  3. Staff Access
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-5 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Merchant registered successfully! Redirecting to your merchant dashboard...</span>
              </div>
            )}

            {/* TAB 1: Store Identity */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Store Name *
                    </label>
                    <Input
                      placeholder="e.g. Cybernetics Audio Labs"
                      value={merchantName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Merchant ID / Slug *
                    </label>
                    <Input
                      placeholder="e.g. merchant_cybernetics"
                      value={merchantId}
                      onChange={(e) => setMerchantId(e.target.value)}
                      required
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Industry / Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="digital_music">Digital Music & Master Licenses</option>
                      <option value="tech_accessories">Tech Accessories & Smart Hardware</option>
                      <option value="groceries">Fresh Produce & Gourmet Foods</option>
                      <option value="general">General Retail & Merchandise</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Customer Support Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="support@yourbrand.store"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Storefront URL
                    </label>
                    <Input
                      placeholder="https://yourstore.com or http://localhost:3001"
                      value={storefrontUrl}
                      onChange={(e) => setStorefrontUrl(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Brand Accent Color</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="h-9 w-12 rounded cursor-pointer border border-border p-1 bg-background"
                      />
                      <Input
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="h-9 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Storefront Tagline
                  </label>
                  <Input
                    placeholder="e.g. Next-generation soundscapes and spatial audio stems"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setActiveTab('ai_policy')}
                    className="h-9 text-xs gap-1.5"
                  >
                    <span>Configure AI Policy</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: Resolution Policy */}
            {activeTab === 'ai_policy' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Ground-Truth Policy Engine</span>
                    <p className="mt-0.5">
                      These policy rules are injected directly into the resolution engine&apos;s system prompt. The agent strictly obeys these rules when handling customer returns and disputes.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Return Policy Rules
                  </label>
                  <Textarea
                    rows={2}
                    value={returnsPolicy}
                    onChange={(e) => setReturnsPolicy(e.target.value)}
                    className="text-xs resize-none"
                    placeholder="e.g. Returns accepted within 14 days..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Refund Processing Rules
                  </label>
                  <Textarea
                    rows={2}
                    value={refundsPolicy}
                    onChange={(e) => setRefundsPolicy(e.target.value)}
                    className="text-xs resize-none"
                    placeholder="e.g. Refunds processed within 3-5 business days..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Delivery & Digital Downloads Rules
                  </label>
                  <Textarea
                    rows={2}
                    value={deliveryPolicy}
                    onChange={(e) => setDeliveryPolicy(e.target.value)}
                    className="text-xs resize-none"
                    placeholder="e.g. Physical items dispatched with FedEx tracking..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Human Escalation Threshold
                  </label>
                  <Textarea
                    rows={2}
                    value={escalationThreshold}
                    onChange={(e) => setEscalationThreshold(e.target.value)}
                    className="text-xs resize-none"
                    placeholder="e.g. Disputes over $50 escalate to human support specialist..."
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('details')}
                    className="h-9 text-xs gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Details</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab('account')}
                    className="h-9 text-xs gap-1.5"
                  >
                    <span>Staff Account Setup</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: Staff Account Setup */}
            {activeTab === 'account' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Owner Account Credentials</span>
                    <p className="mt-0.5">
                      You will use these credentials to sign into the Merchant Portal and manage escalated tickets and order fulfillment.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Staff Manager Name
                  </label>
                  <Input
                    placeholder="e.g. Jordan Vane"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Admin Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="admin@yourbrand.store"
                      value={adminEmail || supportEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Password *
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('ai_policy')}
                    className="h-9 text-xs gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to AI Policy</span>
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading || success}
                    className="h-9 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground px-5 cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Registering Storefront...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Complete Registration</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
