import React from "react";
import { StatusHistory } from "@/types";
import { StatusBadge } from "./ui/badge";

export interface StatusTimelineProps {
  history: StatusHistory[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  if (history.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-bg border border-border rounded-[8px] p-6 shadow-subtle">
      <h3 className="text-sm font-semibold text-text-primary tracking-tight mb-4">
        Riwayat Perjalanan Status
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
        {history.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4">
            {/* Dot marker */}
            <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-bg border border-border-strong flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-border-strong" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 w-full">
              <StatusBadge status={item.status} />
              <span className="font-mono text-xs text-text-secondary">
                {formatDate(item.changed_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
