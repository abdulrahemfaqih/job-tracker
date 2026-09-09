export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type WorkType = "wfo" | "wfh" | "hybrid";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface UserSession {
  userId: string;
  name: string;
  email: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  status: ApplicationStatus;
  applied_date: string; // YYYY-MM-DD
  source?: string | null;
  job_url?: string | null;
  salary_range?: string | null;
  location?: string | null;
  work_type?: WorkType | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: string;
  job_application_id: string;
  status: ApplicationStatus;
  changed_at: string;
}

export interface DashboardStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  followUps: JobApplication[];
  recent: JobApplication[];
}
