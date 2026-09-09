import React from "react";
import Link from "next/link";
import { JobApplication } from "@/types";
import { StatusBadge } from "./ui/badge";
import { ArrowUpRight, Clock } from "@phosphor-icons/react/dist/ssr";

export interface FollowUpSectionProps {
  items: JobApplication[];
}

export function FollowUpSection({ items }: FollowUpSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const getDaysElapsed = (isoDate: string) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-bg border border-border rounded-[8px] p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} weight="bold" className="text-text-primary" />
          <h2 className="text-sm font-semibold text-text-primary tracking-tight">
            Perlu Follow-up (&gt;14 hari tanpa update)
          </h2>
        </div>
        <span className="font-mono text-xs text-text-muted">
          {items.length} lamaran
        </span>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => {
          const days = getDaysElapsed(item.updated_at);
          return (
            <Link
              key={item.id}
              href={`/applications/${item.id}`}
              className="py-3 flex items-center justify-between group hover:bg-surface px-2 rounded-[4px] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text-primary group-hover:underline">
                  {item.company_name}
                </span>
                <span className="text-xs text-text-secondary">·</span>
                <span className="text-xs text-text-secondary">
                  {item.position}
                </span>
                <span className="text-xs text-text-secondary">·</span>
                <span className="font-mono text-xs text-text-primary font-medium">
                  {days} hari
                </span>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={item.status} />
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  className="text-text-muted group-hover:text-text-primary transition-colors"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
