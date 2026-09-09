"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, ensureSchema } from "@/lib/db/client";
import { requireUser } from "@/lib/auth/session";
import { applicationSchema } from "@/lib/validations/application";
import { ApplicationStatus } from "@/types";

export interface ApplicationActionResult {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createApplicationAction(
  prevState: ApplicationActionResult | null,
  formData: FormData
): Promise<ApplicationActionResult> {
  const user = await requireUser();
  await ensureSchema();

  const rawData = {
    company_name: formData.get("company_name"),
    position: formData.get("position"),
    status: formData.get("status"),
    applied_date: formData.get("applied_date"),
    source: formData.get("source") || null,
    job_url: formData.get("job_url") || null,
    salary_range: formData.get("salary_range") || null,
    location: formData.get("location") || null,
    work_type: formData.get("work_type") || null,
    notes: formData.get("notes") || null,
  };

  const parsed = applicationSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    company_name,
    position,
    status,
    applied_date,
    source,
    job_url,
    salary_range,
    location,
    work_type,
    notes,
  } = parsed.data;

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    // 1. Insert job application
    await db.execute({
      sql: `
        INSERT INTO job_applications (
          id, user_id, company_name, position, status, applied_date,
          source, job_url, salary_range, location, work_type, notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        user.userId,
        company_name,
        position,
        status,
        applied_date,
        source || null,
        job_url || null,
        salary_range || null,
        location || null,
        work_type || null,
        notes || null,
        now,
        now,
      ],
    });

    // 2. Insert initial status history
    await db.execute({
      sql: `
        INSERT INTO status_history (id, job_application_id, status, changed_at)
        VALUES (?, ?, ?, ?)
      `,
      args: [crypto.randomUUID(), id, status, now],
    });
  } catch (err: unknown) {
    console.error("Create application error:", err);
    return { error: "Gagal menyimpan data lamaran" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  redirect(`/applications/${id}`);
}

export async function updateApplicationAction(
  id: string,
  prevState: ApplicationActionResult | null,
  formData: FormData
): Promise<ApplicationActionResult> {
  const user = await requireUser();
  await ensureSchema();

  const rawData = {
    company_name: formData.get("company_name"),
    position: formData.get("position"),
    status: formData.get("status"),
    applied_date: formData.get("applied_date"),
    source: formData.get("source") || null,
    job_url: formData.get("job_url") || null,
    salary_range: formData.get("salary_range") || null,
    location: formData.get("location") || null,
    work_type: formData.get("work_type") || null,
    notes: formData.get("notes") || null,
  };

  const parsed = applicationSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    company_name,
    position,
    status,
    applied_date,
    source,
    job_url,
    salary_range,
    location,
    work_type,
    notes,
  } = parsed.data;

  try {
    // Verifikasi kepemilikan
    const existing = await db.execute({
      sql: "SELECT id, status FROM job_applications WHERE id = ? AND user_id = ? LIMIT 1",
      args: [id, user.userId],
    });

    if (existing.rows.length === 0) {
      return { error: "Data lamaran tidak ditemukan atau akses ditolak" };
    }

    const previousStatus = existing.rows[0].status as ApplicationStatus;
    const now = new Date().toISOString();

    // Update data
    await db.execute({
      sql: `
        UPDATE job_applications SET
          company_name = ?,
          position = ?,
          status = ?,
          applied_date = ?,
          source = ?,
          job_url = ?,
          salary_range = ?,
          location = ?,
          work_type = ?,
          notes = ?,
          updated_at = ?
        WHERE id = ? AND user_id = ?
      `,
      args: [
        company_name,
        position,
        status,
        applied_date,
        source || null,
        job_url || null,
        salary_range || null,
        location || null,
        work_type || null,
        notes || null,
        now,
        id,
        user.userId,
      ],
    });

    // Jika status berubah, catat riwayat
    if (previousStatus !== status) {
      await db.execute({
        sql: `
          INSERT INTO status_history (id, job_application_id, status, changed_at)
          VALUES (?, ?, ?, ?)
        `,
        args: [crypto.randomUUID(), id, status, now],
      });
    }
  } catch (err: unknown) {
    console.error("Update application error:", err);
    return { error: "Gagal memperbarui data lamaran" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  redirect(`/applications/${id}`);
}

export async function deleteApplicationAction(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await requireUser();
  await ensureSchema();

  try {
    const res = await db.execute({
      sql: "DELETE FROM job_applications WHERE id = ? AND user_id = ?",
      args: [id, user.userId],
    });

    if (res.rowsAffected === 0) {
      return { success: false, error: "Data tidak ditemukan atau akses ditolak" };
    }
  } catch (err: unknown) {
    console.error("Delete application error:", err);
    return { success: false, error: "Gagal menghapus lamaran" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true };
}

export async function updateApplicationStatusInlineAction(
  id: string,
  newStatus: ApplicationStatus
): Promise<{ success: boolean; error?: string }> {
  const user = await requireUser();
  await ensureSchema();

  try {
    const existing = await db.execute({
      sql: "SELECT id, status FROM job_applications WHERE id = ? AND user_id = ? LIMIT 1",
      args: [id, user.userId],
    });

    if (existing.rows.length === 0) {
      return { success: false, error: "Data tidak ditemukan atau akses ditolak" };
    }

    const previousStatus = existing.rows[0].status as ApplicationStatus;
    if (previousStatus === newStatus) {
      return { success: true };
    }

    const now = new Date().toISOString();

    await db.execute({
      sql: "UPDATE job_applications SET status = ?, updated_at = ? WHERE id = ? AND user_id = ?",
      args: [newStatus, now, id, user.userId],
    });

    await db.execute({
      sql: "INSERT INTO status_history (id, job_application_id, status, changed_at) VALUES (?, ?, ?, ?)",
      args: [crypto.randomUUID(), id, newStatus, now],
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");
    revalidatePath(`/applications/${id}`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Inline status update error:", err);
    return { success: false, error: "Gagal memperbarui status" };
  }
}
