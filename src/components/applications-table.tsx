"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobApplication } from "@/types";
import { StatusBadge } from "./ui/badge";
import { ConfirmModal } from "./ui/modal";
import { EmptyState } from "./ui/empty-state";
import { deleteApplicationAction } from "@/actions/applications";
import { PencilSimple, Trash, ArrowUpRight } from "@phosphor-icons/react";

export interface ApplicationsTableProps {
  items: JobApplication[];
  hasFilterApplied?: boolean;
}

export function ApplicationsTable({
  items,
  hasFilterApplied = false,
}: ApplicationsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const targetApp = items.find((it) => it.id === deletingId);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await deleteApplicationAction(deletingId);
      if (res.success) {
        setDeletingId(null);
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus data");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (items.length === 0) {
    if (hasFilterApplied) {
      return (
        <EmptyState
          title="Tidak Ada Lamaran Ditemukan"
          description="Tidak ada data yang sesuai dengan kata kunci pencarian atau filter status yang dipilih."
          actionHref="/applications"
          actionLabel="Reset Semua Filter"
        />
      );
    }
    return (
      <EmptyState
        title="Belum Ada Lamaran"
        description="Belum ada data lamaran kerja yang tersimpan di akun Anda. Mulai tambahkan sekarang."
        actionHref="/applications/new"
        actionLabel="Tambah Lamaran Baru"
      />
    );
  }

  return (
    <>
      <div className="bg-bg border border-border rounded-[8px] overflow-hidden shadow-subtle">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface text-xs font-mono text-text-secondary">
                <th className="py-3 px-4 font-normal">Perusahaan</th>
                <th className="py-3 px-4 font-normal">Posisi</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Tgl Apply</th>
                <th className="py-3 px-4 font-normal">Update Terakhir</th>
                <th className="py-3 px-4 font-normal text-right w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => {
                const isRejectedOrWithdrawn =
                  item.status === "rejected" || item.status === "withdrawn";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-surface group transition-colors cursor-pointer"
                    onClick={() => router.push(`/applications/${item.id}`)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-sm text-text-primary group-hover:underline">
                        {item.company_name}
                      </div>
                      {item.location && (
                        <div className="text-[11px] text-text-muted">
                          {item.location}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-text-secondary">
                      <span
                        className={
                          isRejectedOrWithdrawn
                            ? "line-through text-text-muted"
                            : "text-text-primary"
                        }
                      >
                        {item.position}
                      </span>
                      {item.work_type && (
                        <span className="ml-1.5 uppercase font-mono text-[10px] text-text-muted px-1 py-0.5 rounded border border-border">
                          {item.work_type}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-text-secondary whitespace-nowrap">
                      {formatDate(item.applied_date)}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-text-muted whitespace-nowrap">
                      {formatDate(item.updated_at)}
                    </td>

                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/applications/${item.id}`}
                          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg border border-transparent hover:border-border rounded-[4px] transition-colors"
                          title="Lihat Detail"
                        >
                          <ArrowUpRight size={14} weight="bold" />
                        </Link>
                        <Link
                          href={`/applications/${item.id}/edit`}
                          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg border border-transparent hover:border-border rounded-[4px] transition-colors"
                          title="Edit Lamaran"
                        >
                          <PencilSimple size={14} weight="bold" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 text-[#5A5A5A] hover:text-text-primary hover:bg-bg border border-transparent hover:border-border rounded-[4px] transition-colors cursor-pointer"
                          title="Hapus Lamaran"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col gap-2 hover:bg-surface transition-colors"
              onClick={() => router.push(`/applications/${item.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {item.company_name}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {item.position}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-1">
                <span>Apply: {formatDate(item.applied_date)}</span>
                <span>Update: {formatDate(item.updated_at)}</span>
              </div>

              <div
                className="flex items-center justify-end gap-2 pt-2 border-t border-border mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={`/applications/${item.id}/edit`}
                  className="text-xs font-medium text-text-secondary hover:text-text-primary px-2 py-1 border border-border rounded-[4px]"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeletingId(item.id)}
                  className="text-xs font-medium text-[#5A5A5A] hover:text-text-primary px-2 py-1 border border-border rounded-[4px]"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Hapus Lamaran Pekerjaan?"
        description={`Apakah Anda yakin ingin menghapus data lamaran ke ${targetApp?.company_name || ""} untuk posisi ${targetApp?.position || ""}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Lamaran"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </>
  );
}
