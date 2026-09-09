import React from "react";
import { ApplicationStatus } from "@/types";
import {
  PaperPlaneTilt,
  MagnifyingGlass,
  ChatsCircle,
  Trophy,
  CheckCircle,
  XCircle,
  Prohibit,
} from "@phosphor-icons/react/dist/ssr";

export interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export function StatusBadge({
  status,
  className = "",
  showIcon = true,
}: StatusBadgeProps) {
  // Mapping shade abu + border weight per DESIGN.md section 3 & 6
  const getStyles = () => {
    switch (status) {
      case "applied":
        return {
          container: "bg-[#F3F3F3] text-text-primary border border-border",
          Icon: PaperPlaneTilt,
        };
      case "screening":
        return {
          container: "bg-[#E5E5E5] text-text-primary border border-[#CCCCCC] font-medium",
          Icon: MagnifyingGlass,
        };
      case "interview":
        return {
          container: "bg-[#D8D8D8] text-text-primary border border-[#AAAAAA] font-medium",
          Icon: ChatsCircle,
        };
      case "offer":
        return {
          container: "bg-inverse-bg text-inverse-text border border-border-strong font-semibold",
          Icon: Trophy,
        };
      case "accepted":
        return {
          container: "bg-inverse-bg text-inverse-text border border-border-strong font-semibold",
          Icon: CheckCircle,
        };
      case "rejected":
        return {
          container: "bg-bg text-text-secondary border border-border",
          Icon: XCircle,
        };
      case "withdrawn":
        return {
          container: "bg-bg text-text-muted border border-border",
          Icon: Prohibit,
        };
      default:
        return {
          container: "bg-[#F3F3F3] text-text-primary border border-border",
          Icon: PaperPlaneTilt,
        };
    }
  };

  const { container, Icon } = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] uppercase tracking-wider ${container} ${className}`}
    >
      {showIcon && <Icon size={12} weight="bold" className="shrink-0" />}
      <span>{STATUS_LABELS[status] || status}</span>
    </span>
  );
}
