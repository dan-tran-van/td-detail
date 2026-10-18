'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Store,
  ShoppingBag,
  Bot,
  Webhook,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocSection {
  title: string;
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    method?: 'GET' | 'POST' | 'PATCH' | 'SDK';
  }[];
}

const DOC_SECTIONS: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        title: 'Platform Overview',
        href: '/docs',
        icon: BookOpen,
      },
    ],
  },
  {
    title: 'Core API Endpoints',
    items: [
      {
        title: 'Merchants & Policies',
        href: '/docs/merchants',
        icon: Store,
        method: 'POST',
      },
      {
        title: 'Orders & Fulfillment',
        href: '/docs/orders',
        icon: ShoppingBag,
        method: 'PATCH',
      },
      {
        title: 'Conversations & Resolution Engine',
        href: '/docs/conversations',
        icon: Bot,
        method: 'POST',
      },
      {
        title: 'Webhooks & Email Relay',
        href: '/docs/webhooks',
        icon: Webhook,
        method: 'POST',
      },
    ],
  },
  {
    title: 'Storefront Integration',
    items: [
      {
        title: 'Client SDK Guide',
        href: '/docs/sdk',
        icon: Code2,
        badge: 'v1.0',
      },
    ],
  },
];

interface DocsSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function DocsSidebar({ onItemClick, className = '' }: DocsSidebarProps) {
  const pathname = usePathname();
  const [filterQuery, setFilterQuery] = useState('');

  const getMethodBadge = (method?: string) => {
    switch (method) {
      case 'GET':
        return <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">GET</span>;
      case 'POST':
        return <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">POST</span>;
      case 'PATCH':
        return <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">PATCH</span>;
      case 'SDK':
        return <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">SDK</span>;
      default:
        return null;
    }
  };

  const filteredSections = DOC_SECTIONS.map((sec) => ({
    ...sec,
    items: sec.items.filter((item) =>
      item.title.toLowerCase().includes(filterQuery.toLowerCase())
    ),
  })).filter((sec) => sec.items.length > 0);

  return (
    <aside className={`w-full flex flex-col space-y-6 ${className}`}>
      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter documentation..."
          className="w-full h-8 pl-8 pr-3 text-xs rounded-xl border border-border bg-card/60 backdrop-blur-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-foreground"
        />
      </div>

      {/* Navigation Groups */}
      <div className="space-y-6">
        {filteredSections.map((sec) => (
          <div key={sec.title} className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
              {sec.title}
            </h4>
            <div className="space-y-1">
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <IconComponent
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {getMethodBadge(item.method)}
                      {item.badge && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </NextLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Sandbox / Demo callout */}
      <div className="p-3.5 rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/40 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Interactive Sandbox</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          All endpoints can be invoked live against the local dev environment or Cloud Run deployment.
        </p>
        <NextLink
          href="/inbox"
          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
        >
          <span>Launch Consolidated Inbox</span>
          <ChevronRight className="h-3 w-3" />
        </NextLink>
      </div>
    </aside>
  );
}
