'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Mail,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

export default function OutboxPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutbox = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
      }
    } catch (e) {
      console.error('Error fetching outbox:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutbox();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <NextLink href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Releases</span>
          </NextLink>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Development Email Outbox
          </h1>
          <p className="text-xs text-muted-foreground">
            Inspection view for simulated SendGrid order confirmation emails generated upon customer purchases.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 border-border"
          onClick={fetchOutbox}
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Outbox</span>
        </Button>
      </div>

      <Card className="border-border bg-card shadow-xs overflow-hidden">
        {emails.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">No outgoing emails yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Simulated order confirmation emails will appear here when you complete purchases on the storefront.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Recipient</TableHead>
                <TableHead className="text-xs font-semibold">Subject & Order ID</TableHead>
                <TableHead className="text-xs font-semibold">Content Preview</TableHead>
                <TableHead className="text-right text-xs font-semibold">Sent At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="py-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-xs text-foreground">{email.customerName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{email.to}</p>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-xs text-foreground">{email.subject}</p>
                      <Badge variant="outline" className="text-[10px] font-mono border-border">
                        #{email.orderId}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 max-w-md">
                    <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap font-sans line-clamp-3 bg-muted/40 p-2 rounded border border-border">
                      {email.body}
                    </pre>
                  </TableCell>

                  <TableCell className="text-right py-4 text-xs text-muted-foreground">
                    {new Date(email.sentAt).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
