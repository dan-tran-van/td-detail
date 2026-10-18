'use client';

import React, { useState } from 'react';
import { Play, RotateCw, Check, Copy, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ApiPlaygroundProps {
  defaultMethod?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  defaultEndpoint: string;
  defaultBody?: string;
  defaultHeaders?: Record<string, string>;
  title?: string;
  description?: string;
}

export function ApiPlayground({
  defaultMethod = 'GET',
  defaultEndpoint,
  defaultBody,
  defaultHeaders = { 'Content-Type': 'application/json' },
  title = 'Interactive API Playground',
  description = 'Test this live endpoint directly against the TD Retail platform.',
}: ApiPlaygroundProps) {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PATCH' | 'DELETE'>(defaultMethod);
  const [endpoint, setEndpoint] = useState<string>(defaultEndpoint);
  const [body, setBody] = useState<string>(defaultBody || '');
  const [headers, setHeaders] = useState<Record<string, string>>(defaultHeaders);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSend = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: {
          ...headers,
        },
      };

      if ((method === 'POST' || method === 'PATCH') && body.trim()) {
        options.body = body.trim();
      }

      const res = await fetch(endpoint, options);
      const elapsed = Math.round(performance.now() - start);
      setDurationMs(elapsed);
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || `${res.status}`);

      const headerObj: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headerObj[key] = val;
      });
      setResponseHeaders(headerObj);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponseData(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponseData(text);
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setDurationMs(elapsed);
      setResponseStatus(0);
      setResponseStatusText('Network / Fetch Error');
      setResponseData(JSON.stringify({ error: err?.message || 'Failed to execute request' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = async () => {
    if (!responseData) return;
    try {
      await navigator.clipboard.writeText(responseData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const getMethodBadgeClass = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'POST':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'PATCH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden my-8">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60 bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>{title}</span>
            </CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
            Live Sandbox
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Request Line */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className={`h-9 px-3 rounded-xl border font-mono text-xs font-bold outline-none cursor-pointer bg-background ${getMethodBadgeClass(
                method
              )}`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/..."
              className="w-full h-9 px-3.5 rounded-xl border border-border bg-background/80 font-mono text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <Button
            size="sm"
            onClick={handleSend}
            disabled={isLoading || !endpoint.trim()}
            className="h-9 px-4 rounded-xl gap-1.5 font-semibold text-xs bg-primary text-primary-foreground hover:opacity-90 shrink-0"
          >
            {isLoading ? (
              <>
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Send Request</span>
              </>
            )}
          </Button>
        </div>

        {/* Optional Body input for POST / PATCH */}
        {(method === 'POST' || method === 'PATCH') && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono text-[11px] font-semibold text-foreground">Request Payload (JSON)</span>
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(body);
                    setBody(JSON.stringify(parsed, null, 2));
                  } catch (e) {
                    // ignore
                  }
                }}
                className="text-[11px] hover:text-foreground text-muted-foreground transition-colors"
              >
                Format JSON
              </button>
            </div>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="{}"
              className="w-full p-3 rounded-xl border border-border bg-zinc-950 font-mono text-xs text-zinc-200 focus:outline-none focus:border-primary transition-colors leading-relaxed selection:bg-primary/30"
            />
          </div>
        )}

        {/* Response Box */}
        {responseStatus !== null && (
          <div className="rounded-xl border border-border/80 bg-zinc-950 overflow-hidden text-xs font-mono shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-semibold text-[11px]">Response:</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold py-0.5 px-2 ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : responseStatus >= 400
                      ? 'border-red-500/40 text-red-400 bg-red-500/10'
                      : 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'
                  }`}
                >
                  {responseStatus} {responseStatusText}
                </Badge>
                {durationMs !== null && (
                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="h-3 w-3" />
                    <span>{durationMs}ms</span>
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyResponse}
                className="h-6 px-2 text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1 rounded-md"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </Button>
            </div>

            <div className="p-3.5 max-h-72 overflow-y-auto text-zinc-200 selection:bg-primary/30">
              <pre className="m-0 whitespace-pre leading-relaxed text-xs">
                <code>{responseData || 'No content returned'}</code>
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
