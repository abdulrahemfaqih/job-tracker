"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobApplication, ApplicationStatus, WorkType } from "@/types";
import {
  createApplicationAction,
  updateApplicationAction,
  deleteApplicationAction,
  ApplicationActionResult,
} from "@/actions/applications";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ConfirmModal } from "./ui/modal";
import { Trash } from "@phosphor-icons/react";

export interface ApplicationFormProps {
  initialData?: JobApplication;
}

export function ApplicationForm({ initialData }: ApplicationFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  // Form action binding
  const actionFn = isEdit
    ? updateApplicationAction.bind(null, initialData!.id)
    : createApplicationAction;

  const [state, formAction, isPending] = useActionState<
    ApplicationActionResult | null,
    FormData
  >(actionFn, null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Default applied date to today (YYYY-MM-DD) if creating new
  const todayStr = new Date().toISOString().split("T")[0];

  const handleDelete = async () => {
    if (!initialData) return;
    setIsDeleting(true);
    try {
      const res = await deleteApplicationAction(initialData.id);
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

  return (
    <>
      <div className="bg-bg border border-border rounded-[8px] p-6 md:p-8 shadow-subtle max-w-3xl">
        <div className="border-b border-border pb-5 mb-6">
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
            {isEdit ? "Edit Lamaran" : "Form Lamaran"}
          </span>
          <h2 className="text-xl font-bold tracking-tight text-text-primary mt-1">
            {isEdit
              ? `Ubah: ${initialData?.company_name} — ${initialData?.position}`
              : "Tambah Lamaran Pekerjaan Baru"}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Isi rincian informasi lamaran kerja di bawah ini secara lengkap.
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-3 rounded-[6px] border border-border-strong bg-surface text-text-primary text-xs font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-6">
          {/* Row 1: Company & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="company_name"
              name="company_name"
              label="Nama Perusahaan"
              placeholder="Contoh: PT Teknologi Bangsa"
              defaultValue={initialData?.company_name}
              required
              error={state?.fieldErrors?.company_name?.[0]}
            />
            <Input
              id="position"
              name="position"
              label="Posisi / Jabatan"
              placeholder="Contoh: Backend Engineer"
              defaultValue={initialData?.position}
              required
              error={state?.fieldErrors?.position?.[0]}
            />
          </div>

          {/* Row 2: Status & Applied Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="status"
              name="status"
              label="Status Lamaran"
              defaultValue={initialData?.status || "applied"}
              required
              error={state?.fieldErrors?.status?.[0]}
            >
              <option value="applied">Applied (Terkirim)</option>
              <option value="screening">Screening (Pemeriksaan Berkas)</option>
              <option value="interview">Interview (Wawancara)</option>
              <option value="offer">Offer (Penawaran Gaji)</option>
              <option value="accepted">Accepted (Diterima)</option>
              <option value="rejected">Rejected (Ditolak)</option>
              <option value="withdrawn">Withdrawn (Dibatalkan Sendiri)</option>
            </Select>

            <Input
              id="applied_date"
              name="applied_date"
              type="date"
              label="Tanggal Apply"
              defaultValue={initialData?.applied_date || todayStr}
              required
              error={state?.fieldErrors?.applied_date?.[0]}
            />
          </div>

          {/* Row 3: Source & Job URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="source"
              name="source"
              label="Sumber Lowongan (Opsional)"
              placeholder="LinkedIn, Jobstreet, Referral teman..."
              defaultValue={initialData?.source || ""}
              error={state?.fieldErrors?.source?.[0]}
            />
            <Input
              id="job_url"
              name="job_url"
              type="url"
              label="Link Lowongan / Job URL (Opsional)"
              placeholder="https://..."
              defaultValue={initialData?.job_url || ""}
              error={state?.fieldErrors?.job_url?.[0]}
            />
          </div>

          {/* Row 4: Salary & Location & Work Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              id="salary_range"
              name="salary_range"
              label="Ekspektasi / Tawaran Gaji (Opsional)"
              placeholder="Contoh: Rp 12.000.000 - 15.000.000"
              defaultValue={initialData?.salary_range || ""}
              error={state?.fieldErrors?.salary_range?.[0]}
            />
            <Input
              id="location"
              name="location"
              label="Lokasi Kota (Opsional)"
              placeholder="Jakarta Selatan, Remote, dll"
              defaultValue={initialData?.location || ""}
              error={state?.fieldErrors?.location?.[0]}
            />
            <Select
              id="work_type"
              name="work_type"
              label="Tipe Kerja (Opsional)"
              defaultValue={initialData?.work_type || ""}
              error={state?.fieldErrors?.work_type?.[0]}
            >
              <option value="">Pilih Tipe Kerja</option>
              <option value="wfo">WFO (Work From Office)</option>
              <option value="wfh">WFH (Work From Home / Remote)</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </div>

          {/* Row 5: Notes */}
          <Textarea
            id="notes"
            name="notes"
            label="Catatan Bebas (Opsional)"
            placeholder="Kontak HR, pertanyaan teknis yang ditanyakan saat interview, rangkuman tugas, dll..."
            defaultValue={initialData?.notes || ""}
            rows={4}
            error={state?.fieldErrors?.notes?.[0]}
          />

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border mt-2">
            <div>
              {isEdit && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                  className="gap-1.5 w-full sm:w-auto"
                >
                  <Trash size={14} weight="bold" />
                  Hapus Lamaran Ini
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
              <Link
                href={
                  isEdit
                    ? `/applications/${initialData?.id}`
                    : "/applications"
                }
              >
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  disabled={isPending}
                >
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isPending}
              >
                {isPending
                  ? "Menyimpan..."
                  : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Lamaran"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {isEdit && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Hapus Lamaran Pekerjaan?"
          description={`Apakah Anda yakin ingin menghapus data lamaran ini (${initialData?.company_name})? Data yang sudah dihapus tidak dapat dipulihkan.`}
          confirmLabel="Ya, Hapus Lamaran"
          cancelLabel="Batal"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
