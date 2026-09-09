"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { ApplicationStatus } from "@/types";
import { STATUS_LABELS } from "./ui/badge";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sortBy") || "updated_at";
  const currentOrder = searchParams.get("sortOrder") || "desc";

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || (key === "status" && val === "all")) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const handleClearSearch = () => {
    updateFilters({ search: null });
  };

  const hasActiveFilters = currentSearch !== "" || currentStatus !== "all";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-bg p-3 border border-border rounded-[8px] shadow-subtle">
      {/* Search Input */}
      <div className="relative flex-1">
        <MagnifyingGlass
          size={16}
          weight="bold"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          type="text"
          value={currentSearch}
          onChange={handleSearchChange}
          placeholder="Cari perusahaan atau posisi..."
          className="w-full pl-9 pr-8 py-2 text-xs bg-surface border border-border rounded-[6px] focus:border-border-strong focus:outline-none placeholder:text-text-muted transition-colors text-text-primary"
        />
        {currentSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            aria-label="Hapus pencarian"
          >
            <X size={12} weight="bold" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <select
          value={currentStatus}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="text-xs bg-surface border border-border rounded-[6px] px-2.5 py-2 text-text-primary focus:border-border-strong focus:outline-none cursor-pointer"
        >
          <option value="all">Semua Status</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        {/* Sort Selector */}
        <select
          value={`${currentSort}-${currentOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            updateFilters({ sortBy, sortOrder });
          }}
          className="text-xs bg-surface border border-border rounded-[6px] px-2.5 py-2 text-text-primary focus:border-border-strong focus:outline-none cursor-pointer"
        >
          <option value="updated_at-desc">Terakhir Diupdate (Terbaru)</option>
          <option value="updated_at-asc">Terakhir Diupdate (Terlama)</option>
          <option value="applied_date-desc">Tanggal Apply (Terbaru)</option>
          <option value="applied_date-asc">Tanggal Apply (Terlama)</option>
        </select>

        {/* Reset Filter Button if active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => updateFilters({ search: null, status: null })}
            className="text-xs text-text-secondary hover:text-text-primary underline px-1 py-1"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
