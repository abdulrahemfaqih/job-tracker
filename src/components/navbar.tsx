"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Plus, SignOut, Briefcase, ChartBar } from "@phosphor-icons/react";
import { UserSession } from "@/types";

export interface NavbarProps {
  user: UserSession;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const isApplications = pathname.startsWith("/applications") && pathname !== "/applications/new";

  return (
    <header className="w-full bg-bg border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-text-primary font-bold tracking-tight text-sm uppercase hover:opacity-80 transition-opacity"
          >
            <span className="w-2 h-2 rounded-full bg-inverse-bg" />
            JOB TRACKER
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                isDashboard
                  ? "bg-surface text-text-primary border border-border"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              <ChartBar size={14} weight="regular" />
              Dashboard
            </Link>
            <Link
              href="/applications"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                isApplications
                  ? "bg-surface text-text-primary border border-border"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              <Briefcase size={14} weight="regular" />
              Daftar Lamaran
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/applications/new">
            <Button size="sm" variant="primary" className="gap-1 text-xs">
              <Plus size={13} weight="bold" />
              <span className="hidden sm:inline">Tambah Lamaran</span>
              <span className="sm:hidden">Tambah</span>
            </Button>
          </Link>

          <div className="h-4 w-[1px] bg-border hidden sm:block" />

          <div className="hidden sm:flex items-center text-xs font-mono text-text-secondary">
            {user.name}
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary p-1.5 rounded-[6px] hover:bg-surface transition-colors cursor-pointer"
              title="Keluar"
            >
              <SignOut size={16} weight="regular" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-border px-6 py-2 bg-surface text-xs font-medium">
        <Link
          href="/dashboard"
          className={`flex items-center gap-1 px-3 py-1 rounded-[4px] ${
            isDashboard ? "text-text-primary font-semibold" : "text-text-secondary"
          }`}
        >
          <ChartBar size={14} weight="regular" />
          Dashboard
        </Link>
        <Link
          href="/applications"
          className={`flex items-center gap-1 px-3 py-1 rounded-[4px] ${
            isApplications ? "text-text-primary font-semibold" : "text-text-secondary"
          }`}
        >
          <Briefcase size={14} weight="regular" />
          Lamaran
        </Link>
      </div>
    </header>
  );
}
