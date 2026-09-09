import React from "react";
import Link from "next/link";
import { Button } from "./button";
import { Plus, Tray } from "@phosphor-icons/react/dist/ssr";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-[8px] bg-surface/50">
      <div className="w-10 h-10 rounded-[6px] border border-border bg-bg flex items-center justify-center text-text-secondary mb-3">
        <Tray size={20} weight="regular" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-xs text-text-secondary max-w-sm mb-5 leading-relaxed">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link href={actionHref}>
          <Button size="sm" variant="primary" className="gap-1.5">
            <Plus size={14} weight="bold" />
            {actionLabel}
          </Button>
        </Link>
      )}

      {!actionHref && onAction && actionLabel && (
        <Button size="sm" variant="primary" onClick={onAction} className="gap-1.5">
          <Plus size={14} weight="bold" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
