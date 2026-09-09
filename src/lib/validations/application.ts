import { z } from "zod";

export const APPLICATION_STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
] as const;

export const WORK_TYPES = ["wfo", "wfh", "hybrid"] as const;

export const applicationSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Nama perusahaan wajib diisi")
    .max(150, "Nama perusahaan maksimal 150 karakter"),
  position: z
    .string()
    .trim()
    .min(1, "Posisi wajib diisi")
    .max(150, "Posisi maksimal 150 karakter"),
  status: z.enum(APPLICATION_STATUSES, {
    message: "Status tidak valid",
  }),
  applied_date: z
    .string()
    .min(1, "Tanggal apply wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  source: z.string().trim().max(100).optional().nullable(),
  job_url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/i.test(val),
      "URL lowongan harus diawali http:// atau https://"
    ),
  salary_range: z.string().trim().max(100).optional().nullable(),
  location: z.string().trim().max(100).optional().nullable(),
  work_type: z.enum(WORK_TYPES).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
