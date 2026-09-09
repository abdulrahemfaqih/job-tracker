import React from "react";
import { ApplicationStatus, DashboardStats as DashboardStatsType } from "@/types";
import { StatusBadge, STATUS_LABELS } from "./ui/badge";

export interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { total, byStatus } = stats;

  const statuses: ApplicationStatus[] = [
    "applied",
    "screening",
    "interview",
    "offer",
    "accepted",
    "rejected",
    "withdrawn",
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Asymmetric Grid: 1 large card + grid of status cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Large Card: Total Lamaran */}
        <div className="lg:col-span-4 bg-bg border border-border rounded-[8px] p-6 flex flex-col justify-between shadow-subtle hover:border-border-strong transition-colors">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
              Total Lamaran
            </span>
            <div className="mt-2 text-4xl font-mono font-bold tracking-tight text-text-primary">
              {total}
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-4 leading-relaxed">
            Semua proses lamaran yang tersimpan di akun Anda.
          </p>
        </div>

        {/* Status Breakdown Grid (Asymmetric) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {statuses.map((st) => {
            const count = byStatus[st] || 0;
            return (
              <div
                key={st}
                className="bg-bg border border-border rounded-[8px] p-4 flex flex-col justify-between hover:border-border-strong transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs text-text-secondary">
                    {STATUS_LABELS[st]}
                  </span>
                  <StatusBadge status={st} showIcon={false} className="text-[10px] px-1.5 py-0" />
                </div>
                <div className="font-mono text-2xl font-semibold text-text-primary">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thin Monochrome Breakdown Bar */}
      {total > 0 && (
        <div className="bg-bg border border-border rounded-[8px] p-4 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary">
              Distribusi Status Lamaran
            </span>
            <span className="font-mono text-xs text-text-muted">
              100% dari {total} entri
            </span>
          </div>
          <div className="h-2 w-full rounded-[4px] overflow-hidden flex bg-surface border border-border">
            {statuses.map((st) => {
              const count = byStatus[st] || 0;
              if (count === 0) return null;
              const percentage = (count / total) * 100;

              // Monochrome distinct shades for bar segments
              const shade = {
                applied: "bg-[#D4D4D4]",
                screening: "bg-[#A3A3A3]",
                interview: "bg-[#737373]",
                offer: "bg-[#111111]",
                accepted: "bg-[#2A2A2A]",
                rejected: "bg-[#E5E5E5]",
                withdrawn: "bg-[#F5F5F5]",
              }[st];

              return (
                <div
                  key={st}
                  style={{ width: `${percentage}%` }}
                  title={`${STATUS_LABELS[st]}: ${count} (${percentage.toFixed(1)}%)`}
                  className={`${shade} h-full border-r border-bg last:border-r-0`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
