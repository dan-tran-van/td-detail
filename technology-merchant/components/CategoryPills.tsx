'use client';

import React from 'react';
import { TEMPLATE_EDITORIAL_ASSETS } from '@/lib/template-assets';
import { Sparkles, Watch, Headphones, Zap, Monitor, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="h-4 w-4" />,
  watch: <Watch className="h-4 w-4" />,
  headphones: <Headphones className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  monitor: <Monitor className="h-4 w-4" />,
  cpu: <Cpu className="h-4 w-4" />,
};

export function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 min-w-max pb-2">
        {TEMPLATE_EDITORIAL_ASSETS.categoryPills.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none transition-transform active:scale-95"
            >
              <div
                className={cn(
                  'relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 flex items-center justify-center',
                  isActive
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md shadow-primary/20'
                    : 'group-hover:ring-1 group-hover:ring-border opacity-85 group-hover:opacity-100'
                )}
              >
                {/* Circular image thumbnail */}
                <div className="w-full h-full rounded-full overflow-hidden bg-muted border border-border relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-1 right-1 p-1 rounded-full bg-background/80 text-foreground backdrop-blur-xs">
                    {ICON_MAP[cat.icon]}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    'text-xs font-semibold tracking-tight transition-colors',
                    isActive ? 'text-primary font-bold' : 'text-foreground/80 group-hover:text-foreground'
                  )}
                >
                  {cat.name}
                </span>
                <span className="text-[10px] text-muted-foreground">{cat.count}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
