import { db, ensureSchema } from "./client";
import {
  ApplicationStatus,
  JobApplication,
  StatusHistory,
  DashboardStats,
} from "@/types";

export async function getDashboardData(userId: string): Promise<DashboardStats> {
  await ensureSchema();

  // 1. Total applications for this user
  const totalRes = await db.execute({
    sql: "SELECT COUNT(*) as count FROM job_applications WHERE user_id = ?",
    args: [userId],
  });
  const total = Number(totalRes.rows[0]?.count || 0);

  // 2. Count per status
  const statusCounts: Record<ApplicationStatus, number> = {
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  };

  const statusRes = await db.execute({
    sql: "SELECT status, COUNT(*) as count FROM job_applications WHERE user_id = ? GROUP BY status",
    args: [userId],
  });

  for (const row of statusRes.rows) {
    const s = row.status as ApplicationStatus;
    if (s in statusCounts) {
      statusCounts[s] = Number(row.count);
    }
  }

  // 3. Follow-up items: active status and > 14 days without status change
  // In SQLite/libSQL: julianday('now') - julianday(updated_at) > 14
  // We only target active statuses: applied, screening, interview
  const followUpRes = await db.execute({
    sql: `
      SELECT * FROM job_applications 
      WHERE user_id = ? 
        AND status IN ('applied', 'screening', 'interview')
        AND (julianday('now') - julianday(updated_at)) > 14
      ORDER BY updated_at ASC
      LIMIT 10
    `,
    args: [userId],
  });

  const followUps = followUpRes.rows as unknown as JobApplication[];

  // 4. Recent 5 applications
  const recentRes = await db.execute({
    sql: "SELECT * FROM job_applications WHERE user_id = ? ORDER BY updated_at DESC LIMIT 5",
    args: [userId],
  });

  const recent = recentRes.rows as unknown as JobApplication[];

  return {
    total,
    byStatus: statusCounts,
    followUps,
    recent,
  };
}

export interface ApplicationFilterParams {
  search?: string;
  status?: string;
  sortBy?: "applied_date" | "updated_at";
  sortOrder?: "asc" | "desc";
}

export async function getApplicationsList(
  userId: string,
  params: ApplicationFilterParams = {}
): Promise<JobApplication[]> {
  await ensureSchema();

  const { search, status, sortBy = "updated_at", sortOrder = "desc" } = params;

  let sql = "SELECT * FROM job_applications WHERE user_id = ?";
  const args: (string | number)[] = [userId];

  if (search && search.trim() !== "") {
    sql += " AND (company_name LIKE ? OR position LIKE ?)";
    const wildcard = `%${search.trim()}%`;
    args.push(wildcard, wildcard);
  }

  if (status && status !== "all") {
    sql += " AND status = ?";
    args.push(status);
  }

  // Safe sort column & direction
  const safeSortBy =
    sortBy === "applied_date" ? "applied_date" : "updated_at";
  const safeSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

  sql += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

  const res = await db.execute({ sql, args });
  return res.rows as unknown as JobApplication[];
}

export async function getApplicationDetail(
  id: string,
  userId: string
): Promise<{ application: JobApplication | null; history: StatusHistory[] }> {
  await ensureSchema();

  const appRes = await db.execute({
    sql: "SELECT * FROM job_applications WHERE id = ? AND user_id = ? LIMIT 1",
    args: [id, userId],
  });

  if (appRes.rows.length === 0) {
    return { application: null, history: [] };
  }

  const application = appRes.rows[0] as unknown as JobApplication;

  const historyRes = await db.execute({
    sql: "SELECT * FROM status_history WHERE job_application_id = ? ORDER BY changed_at ASC",
    args: [id],
  });

  const history = historyRes.rows as unknown as StatusHistory[];

  return {
    application,
    history,
  };
}
