import React from "react";
import Link from "next/link";
import { JobApplication } from "@/types";
import { StatusBadge } from "./ui/badge";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export interface RecentTableProps {
  items: JobApplication[];
}

export function RecentTable({ items }: RecentTableProps) {
  if (items.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-bg border border-border rounded-[8px] p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary tracking-tight">
          Lamaran Terbaru
        </h2>
        <Link
          href="/applications"
          className="text-xs font-medium text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
        >
          Lihat semua
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs font-mono text-text-secondary">
              <th className="py-2.5 px-3 font-normal">Perusahaan</th>
              <th className="py-2.5 px-3 font-normal">Posisi</th>
              <th className="py-2.5 px-3 font-normal">Status</th>
              <th className="py-2.5 px-3 font-normal">Tgl Apply</th>
              <th className="py-2.5 px-3 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface group transition-colors cursor-pointer"
              >
                <td className="py-3 px-3">
                  <Link
                    href={`/applications/${item.id}`}
                    className="font-medium text-sm text-text-primary group-hover:underline"
                  >
                    {item.company_name}
                  </Link>
                </td>
                <td className="py-3 px-3 text-xs text-text-secondary">
                  {item.position}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3 px-3 font-mono text-xs text-text-secondary whitespace-nowrap">
                  {formatDate(item.applied_date)}
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    href={`/applications/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary font-medium"
                  >
                    Detail
                    <ArrowUpRight size={12} weight="bold" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
