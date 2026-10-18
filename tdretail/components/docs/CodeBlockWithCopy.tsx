'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface CodeSnippet {
  language: 'curl' | 'typescript' | 'python' | 'json';
  label: string;
  code: string;
}

interface CodeBlockWithCopyProps {
  snippets: CodeSnippet[];
  title?: string;
  className?: string;
}

export function CodeBlockWithCopy({ snippets, title, className = '' }: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(snippets[0]?.language || 'curl');

  const currentSnippet = snippets.find((s) => s.language === activeTab) || snippets[0];

  const handleCopy = async () => {
    if (!currentSnippet) return;
    try {
      await navigator.clipboard.writeText(currentSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className={`rounded-2xl border border-border/80 bg-zinc-950 text-zinc-100 shadow-xl overflow-hidden font-mono ${className}`}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>
          {title ? (
            <span className="font-semibold text-zinc-300">{title}</span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>Example Request</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {snippets.length > 1 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-7 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800">
                {snippets.map((snippet) => (
                  <TabsTrigger
                    key={snippet.language}
                    value={snippet.language}
                    className="h-6 px-2.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 data-active:bg-zinc-800 data-active:text-white rounded-md transition-colors"
                  >
                    {snippet.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1.5 rounded-md"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto text-xs leading-relaxed text-zinc-200 selection:bg-primary/30">
        <pre className="m-0 whitespace-pre">
          <code>{currentSnippet?.code || ''}</code>
        </pre>
      </div>
    </div>
  );
}
