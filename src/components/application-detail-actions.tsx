"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobApplication, ApplicationStatus } from "@/types";
import { Button } from "./ui/button";
import { ConfirmModal } from "./ui/modal";
import {
  deleteApplicationAction,
  updateApplicationStatusInlineAction,
} from "@/actions/applications";
import { PencilSimple, Trash } from "@phosphor-icons/react";

export interface ApplicationDetailActionsProps {
  application: JobApplication;
}

export function ApplicationDetailActions({
  application,
}: ApplicationDetailActionsProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteApplicationAction(application.id);
      if (res.success) {
        setShowDeleteModal(false);
        router.push("/applications");
      } else {
        alert(res.error || "Gagal menghapus lamaran");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ApplicationStatus;
    if (newStatus === application.status) return;

    setIsUpdatingStatus(true);
    try {
      const res = await updateApplicationStatusInlineAction(
        application.id,
        newStatus
      );
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Gagal memperbarui status");
      }
    } catch {
      alert("Terjadi kesalahan saat memperbarui status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick status selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="inline-status-select"
            className="text-xs text-text-secondary whitespace-nowrap"
          >
            Ubah Status:
          </label>
          <select
            id="inline-status-select"
            value={application.status}
            onChange={handleStatusChange}
            disabled={isUpdatingStatus}
            className="text-xs bg-bg border border-border-strong rounded-[6px] px-2.5 py-1.5 text-text-primary focus:ring-1 focus:ring-border-strong focus:outline-none cursor-pointer"
          >
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="h-4 w-[1px] bg-border hidden sm:block" />

        {/* Edit button */}
        <Link href={`/applications/${application.id}/edit`}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <PencilSimple size={14} weight="bold" />
            Edit
          </Button>
        </Link>

        {/* Delete button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="gap-1.5"
        >
          <Trash size={14} weight="bold" />
          Hapus
        </Button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Hapus Lamaran Pekerjaan?"
        description={`Apakah Anda yakin ingin menghapus data lamaran ke ${application.company_name} (${application.position})? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Lamaran"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
