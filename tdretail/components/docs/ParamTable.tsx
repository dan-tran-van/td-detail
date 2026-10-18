import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface ParamRow {
  name: string;
  type: string;
  required?: boolean;
  description: string | React.ReactNode;
  defaultValue?: string;
  allowedValues?: string[];
}

interface ParamTableProps {
  title?: string;
  description?: string;
  params: ParamRow[];
}

export function ParamTable({ title, description, params }: ParamTableProps) {
  return (
    <div className="space-y-3 my-6">
      {title && (
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">{title}</h4>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}

      <div className="rounded-xl border border-border/80 overflow-hidden bg-card/60 backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                <th className="py-2.5 px-4 font-semibold w-1/4">Parameter</th>
                <th className="py-2.5 px-4 font-semibold w-1/6">Type</th>
                <th className="py-2.5 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {params.map((param) => (
                <tr key={param.name} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 align-top font-mono">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-foreground">{param.name}</span>
                      {param.required ? (
                        <Badge variant="destructive" className="text-[10px] py-0 px-1 font-sans">
                          required
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1 font-sans text-muted-foreground">
                          optional
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top font-mono text-primary font-semibold text-[11px]">
                    {param.type}
                  </td>
                  <td className="py-3 px-4 align-top text-muted-foreground space-y-1.5 leading-relaxed">
                    <div>{param.description}</div>
                    {param.defaultValue && (
                      <div className="text-[11px] font-mono text-zinc-400">
                        Default: <code className="bg-muted px-1 py-0.5 rounded text-foreground">{param.defaultValue}</code>
                      </div>
                    )}
                    {param.allowedValues && param.allowedValues.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[11px] text-zinc-400">Allowed:</span>
                        {param.allowedValues.map((v) => (
                          <code key={v} className="bg-muted px-1 py-0.2 rounded text-[10px] text-foreground font-mono">
                            {v}
                          </code>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
