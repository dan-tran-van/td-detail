'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportChatWidget } from '@/components/SupportChatWidget';

export function FloatingAISupport() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating AI Support Trigger Button */}
      <aside aria-label="Support Assistant" className="fixed bottom-6 right-6 z-50 flex items-center">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-12 px-4 sm:px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl border border-slate-700/60 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer group"
          aria-label="Open AI Support Assistant"
        >
          {/* Animated AI Glowing Icon */}
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-teal-500 via-cyan-400 to-emerald-400 text-slate-950 font-bold shadow-xs">
            <Bot className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>

          {/* Text and Badge */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5 text-xs font-black tracking-tight leading-none text-white">
              <span>AI Support</span>
              <Sparkles className="h-3 w-3 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-[10px] text-slate-300 font-medium leading-tight">
              Ask anything 24/7
            </span>
          </div>
        </Button>
      </aside>

      {/* Global Support Chat Widget Modal/Sheet */}
      <SupportChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
