"use client";

import React, { useEffect } from "react";
import { Button } from "./button";
import { Warning } from "@phosphor-icons/react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/40 backdrop-grayscale transition-opacity duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-bg border border-border-strong rounded-[8px] p-6 shadow-subtle flex flex-col gap-4 text-left transition-transform duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          {isDestructive && (
            <div className="p-2 rounded-[6px] border border-border bg-surface text-text-primary shrink-0 mt-0.5">
              <Warning size={18} weight="bold" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-text-primary tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "primary" : "primary"}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
