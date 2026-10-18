'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Settings,
  Sparkles,
  Store,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Palette,
  Bot,
  Sliders,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Merchant, SupportMode } from '@/lib/types';
import { resolveMerchantStorefrontUrl, isDemoMerchant } from '@/lib/storefrontConfig';

export default function MerchantSettingsPage() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [storefrontUrl, setStorefrontUrl] = useState('');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [supportMode, setSupportMode] = useState<SupportMode>('hybrid_ai_human');

  // Grounding Policies
  const [returnsPolicy, setReturnsPolicy] = useState('');
  const [refundsPolicy, setRefundsPolicy] = useState('');
  const [deliveryPolicy, setDeliveryPolicy] = useState('');
  const [escalationThreshold, setEscalationThreshold] = useState('');

  // Prompts
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/merchant/settings');
      if (res.ok) {
        const data = await res.json();
        const m: Merchant = data.merchant;
        setMerchant(m);
        setName(m.name || '');
        setTagline(m.tagline || '');
        setDescription(m.description || '');
        setCategory(m.category || 'general');
        setSupportEmail(m.supportEmail || '');
        setStorefrontUrl(m.storefrontUrl || '');
        setBrandColor(m.brandColor || '#6366f1');
        setAccentColor(m.accentColor || '#8b5cf6');
        setSupportMode(m.supportMode || 'hybrid_ai_human');

        setReturnsPolicy(m.supportPolicy?.returns || '');
        setRefundsPolicy(m.supportPolicy?.refunds || '');
        setDeliveryPolicy(m.supportPolicy?.deliveryOrDownload || '');
        setEscalationThreshold(m.supportPolicy?.escalationThreshold || '');

        setPromptSuggestions(m.demoPromptSuggestions || []);
      } else {
        const err = await res.json();
        setSaveError(err.error || 'Failed to load merchant settings.');
      }
    } catch (err: any) {
      setSaveError(err?.message || 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const isProtected = isDemoMerchant(merchant?.id);

  const handleAddPrompt = () => {
    if (isProtected || !newPrompt.trim()) return;
    setPromptSuggestions([...promptSuggestions, newPrompt.trim()]);
    setNewPrompt('');
  };

  const handleRemovePrompt = (index: number) => {
    if (isProtected) return;
    setPromptSuggestions(promptSuggestions.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProtected) {
      setSaveError('Default demo merchants are protected from editing to preserve a consistent test environment.');
      return;
    }

    if (!name.trim()) {
      setSaveError('Merchant name is required.');
      return;
    }

    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const res = await fetch('/api/merchant/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          tagline: tagline.trim(),
          description: description.trim(),
          category,
          supportEmail: supportEmail.trim(),
          storefrontUrl: storefrontUrl.trim(),
          brandColor,
          accentColor,
          supportMode,
          supportPolicy: {
            returns: returnsPolicy.trim(),
            refunds: refundsPolicy.trim(),
            deliveryOrDownload: deliveryPolicy.trim(),
            escalationThreshold: escalationThreshold.trim(),
          },
          demoPromptSuggestions: promptSuggestions,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMerchant(data.merchant);
        setSaveSuccess(data.message || 'Store settings updated successfully.');
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setSaveError(data.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      setSaveError(err?.message || 'Network error while saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading store configuration...</p>
      </div>
    );
  }

  const liveStorefrontLink = resolveMerchantStorefrontUrl({
    id: merchant?.id,
    storefrontUrl,
    category,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <span>Store Details & AI Support Policy</span>
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase font-mono">
              {merchant?.id}
            </Badge>
            {isProtected && (
              <Badge variant="secondary" className="gap-1 text-[10px] text-amber-500 border-amber-500/30 bg-amber-500/10 font-medium">
                <Lock className="h-2.5 w-2.5" />
                Read-Only Demo
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure your brand identity and set ground-truth policies enforced by the autonomous support agent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {liveStorefrontLink && liveStorefrontLink !== '#' && (
            <a
              href={liveStorefrontLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-lg">
                <span>View Storefront</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || isProtected}
            size="sm"
            className={`h-8 text-xs gap-1.5 rounded-lg shadow-sm ${
              isProtected
                ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {isProtected ? (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>Demo Protected</span>
              </>
            ) : saving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Demo Protection Alert Banner */}
      {isProtected && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 shrink-0 mt-0.5 sm:mt-0">
              <Lock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <span>Protected Demo Merchant Profile (Read-Only)</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                <strong className="text-foreground">{merchant?.name}</strong> is a seeded demonstration storefront. To ensure an authentic, consistent evaluation experience for all visitors, editing demo merchant details is locked. You can inspect all ground-truth AI policies below, or register your own custom merchant to test live configuration editing.
              </p>
            </div>
          </div>
          <NextLink href="/merchant/register" className="shrink-0">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-500/40 text-foreground hover:bg-amber-500/15 rounded-lg font-medium">
              <span>Register Custom Store</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </NextLink>
        </div>
      )}

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p>{saveSuccess}</p>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{saveError}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store Identity & Branding */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <span>Store Identity & Public Profile</span>
              </CardTitle>
              {isProtected && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Public branding, category, and storefront communication credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Storefront Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SoundWave Digital"
                  className="h-8 text-xs bg-background disabled:opacity-75"
                  disabled={isProtected}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isProtected}
                  className="w-full h-8 px-2.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="digital_music">Digital Music & Master Stems</option>
                  <option value="tech_accessories">Tech Accessories & Smart Hardware</option>
                  <option value="groceries">Fresh Produce & Perishable Groceries</option>
                  <option value="general">General Retail & Merchandise</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tagline</Label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Short punchy summary of your products"
                className="h-8 text-xs bg-background disabled:opacity-75"
                disabled={isProtected}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Store Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed merchant background and fulfillment scope..."
                className="text-xs min-h-[70px] bg-background disabled:opacity-75"
                disabled={isProtected}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Support Contact Email</Label>
                <Input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@yourbrand.store"
                  className="h-8 text-xs bg-background disabled:opacity-75"
                  disabled={isProtected}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Storefront URL</Label>
                <Input
                  value={storefrontUrl}
                  onChange={(e) => setStorefrontUrl(e.target.value)}
                  placeholder="https://yourbrand.store"
                  className="h-8 text-xs bg-background font-mono disabled:opacity-75"
                  disabled={isProtected}
                />
              </div>
            </div>

            {/* Brand Colors */}
            <div className="pt-2 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Primary Brand Color</span>
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor.startsWith('#') ? brandColor : '#6366f1'}
                    onChange={(e) => setBrandColor(e.target.value)}
                    disabled={isProtected}
                    className="h-8 w-10 p-0 rounded-md border border-input cursor-pointer bg-transparent disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                  <Input
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    disabled={isProtected}
                    className="h-8 text-xs font-mono bg-background flex-1 disabled:opacity-75"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Accent Color</span>
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor.startsWith('#') ? accentColor : '#10b981'}
                    onChange={(e) => setAccentColor(e.target.value)}
                    disabled={isProtected}
                    className="h-8 w-10 p-0 rounded-md border border-input cursor-pointer bg-transparent disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    disabled={isProtected}
                    className="h-8 text-xs font-mono bg-background flex-1 disabled:opacity-75"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Gemini Ground-Truth Support Policies */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span>AI Ground-Truth Support Policies</span>
              </CardTitle>
              {isProtected && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              These exact policy clauses are directly injected into the system prompt to ground all customer conversations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Return Window & Requirements</Label>
                <Textarea
                  value={returnsPolicy}
                  onChange={(e) => setReturnsPolicy(e.target.value)}
                  disabled={isProtected}
                  placeholder="e.g. Hardware products can be returned within 10 days of delivery..."
                  className="text-xs min-h-[85px] bg-background disabled:opacity-75"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Refund Conditions & Warranty</Label>
                <Textarea
                  value={refundsPolicy}
                  onChange={(e) => setRefundsPolicy(e.target.value)}
                  disabled={isProtected}
                  placeholder="e.g. Free replacements under 1-Year Manufacturer Warranty..."
                  className="text-xs min-h-[85px] bg-background disabled:opacity-75"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Delivery & Digital Fulfillment</Label>
                <Textarea
                  value={deliveryPolicy}
                  onChange={(e) => setDeliveryPolicy(e.target.value)}
                  disabled={isProtected}
                  placeholder="e.g. Instant license keys stored in vault, or courier dispatch in 24h..."
                  className="text-xs min-h-[85px] bg-background disabled:opacity-75"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Human Escalation Threshold</Label>
                <Textarea
                  value={escalationThreshold}
                  onChange={(e) => setEscalationThreshold(e.target.value)}
                  disabled={isProtected}
                  placeholder="e.g. Dispute tickets or orders over ₹5,000 / $50 route to Senior Specialist..."
                  className="text-xs min-h-[85px] bg-background disabled:opacity-75"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <Label className="text-xs font-medium">Support Operating Mode</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <label
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col gap-1 ${
                    supportMode === 'hybrid_ai_human'
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-border/80'
                  } ${isProtected ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Hybrid AI + Human</span>
                    <input
                      type="radio"
                      name="supportMode"
                      value="hybrid_ai_human"
                      checked={supportMode === 'hybrid_ai_human'}
                      onChange={() => !isProtected && setSupportMode('hybrid_ai_human')}
                      disabled={isProtected}
                      className="sr-only"
                    />
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    Resolves inquiries instantly; escalates complex cases to human inbox.
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col gap-1 ${
                    supportMode === 'ai_first'
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-border/80'
                  } ${isProtected ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">AI First</span>
                    <input
                      type="radio"
                      name="supportMode"
                      value="ai_first"
                      checked={supportMode === 'ai_first'}
                      onChange={() => !isProtected && setSupportMode('ai_first')}
                      disabled={isProtected}
                      className="sr-only"
                    />
                    <Bot className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    Strict AI resolution with autonomous verified tool execution.
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col gap-1 ${
                    supportMode === 'human_only'
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-border/80'
                  } ${isProtected ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Human Specialists</span>
                    <input
                      type="radio"
                      name="supportMode"
                      value="human_only"
                      checked={supportMode === 'human_only'}
                      onChange={() => !isProtected && setSupportMode('human_only')}
                      disabled={isProtected}
                      className="sr-only"
                    />
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    All incoming tickets route straight to merchant human specialists.
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Suggested Demo Prompts */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Suggested Visitor Prompts</span>
              </CardTitle>
              {isProtected && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              These suggestions appear on the interactive chat launcher for customers visiting your storefront.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {!isProtected && (
              <div className="flex items-center gap-2">
                <Input
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPrompt();
                    }
                  }}
                  placeholder="e.g. Can I claim a replacement under the 1-year guarantee?"
                  className="h-8 text-xs bg-background flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddPrompt}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1 rounded-lg"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </Button>
              </div>
            )}

            <div className="space-y-1.5 pt-1">
              {promptSuggestions.map((prompt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border text-xs"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  {!isProtected && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePrompt(idx)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive rounded-md"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              {promptSuggestions.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-2">
                  No prompt suggestions configured.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-2">
          {isProtected ? (
            <p className="text-xs text-muted-foreground italic flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>Demo merchant settings are read-only. Register a custom merchant to test edits.</span>
            </p>
          ) : <div />}

          <div className="flex items-center gap-2">
            {isProtected && (
              <NextLink href="/merchant/register">
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-lg">
                  <span>Register Custom Merchant</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </NextLink>
            )}

            <Button
              type="submit"
              disabled={saving || isProtected}
              className={`rounded-lg text-xs gap-2 px-5 shadow-sm ${
                isProtected
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {isProtected ? (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Demo Protected</span>
                </>
              ) : saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save All Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
