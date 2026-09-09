import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getApplicationDetail } from "@/lib/db/queries";
import { StatusBadge } from "@/components/ui/badge";
import { ApplicationDetailActions } from "@/components/application-detail-actions";
import { StatusTimeline } from "@/components/status-timeline";
import {
  ArrowLeft,
  ArrowSquareOut,
  CalendarBlank,
  Clock,
  CurrencyDollar,
  Globe,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ApplicationDetailPageProps) {
  const { id } = await params;
  return {
    title: `Detail Lamaran — Job Tracker`,
  };
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;

  const { application, history } = await getApplicationDetail(id, user.userId);

  if (!application) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isRejectedOrWithdrawn =
    application.status === "rejected" || application.status === "withdrawn";

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Back button */}
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Kembali ke Daftar Lamaran
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-bg border border-border rounded-[8px] p-6 md:p-8 shadow-subtle flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={application.status} />
              {application.work_type && (
                <span className="uppercase font-mono text-[11px] text-text-secondary px-2 py-0.5 rounded border border-border bg-surface">
                  {application.work_type}
                </span>
              )}
            </div>

            <h1
              className={`text-2xl md:text-3xl font-bold tracking-tight text-text-primary ${
                isRejectedOrWithdrawn ? "line-through text-text-secondary" : ""
              }`}
            >
              {application.position}
            </h1>

            <div className="text-lg text-text-secondary font-medium mt-1">
              {application.company_name}
            </div>
          </div>

          <ApplicationDetailActions application={application} />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-border">
          <div className="flex items-start gap-2.5">
            <CalendarBlank size={18} className="text-text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-mono text-text-secondary uppercase">
                Tanggal Apply
              </span>
              <p className="text-sm font-medium text-text-primary font-mono mt-0.5">
                {formatDate(application.applied_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock size={18} className="text-text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-mono text-text-secondary uppercase">
                Terakhir Diupdate
              </span>
              <p className="text-sm font-medium text-text-primary font-mono mt-0.5">
                {formatDate(application.updated_at)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="text-text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-mono text-text-secondary uppercase">
                Lokasi
              </span>
              <p className="text-sm font-medium text-text-primary mt-0.5">
                {application.location || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CurrencyDollar size={18} className="text-text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-mono text-text-secondary uppercase">
                Gaji / Ekspektasi
              </span>
              <p className="text-sm font-medium text-text-primary font-mono mt-0.5">
                {application.salary_range || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Globe size={18} className="text-text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-mono text-text-secondary uppercase">
                Sumber
              </span>
              <p className="text-sm font-medium text-text-primary mt-0.5">
                {application.source || "—"}
              </p>
            </div>
          </div>

          {application.job_url && (
            <div className="flex items-start gap-2.5">
              <ArrowSquareOut size={18} className="text-text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono text-text-secondary uppercase">
                  Tautan Lowongan
                </span>
                <p className="text-sm mt-0.5">
                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-text-primary underline font-medium hover:text-text-secondary"
                  >
                    Buka Lowongan
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-bg border border-border rounded-[8px] p-6 shadow-subtle">
        <h3 className="text-sm font-semibold text-text-primary tracking-tight mb-3">
          Catatan Pribadi
        </h3>
        {application.notes ? (
          <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
            {application.notes}
          </p>
        ) : (
          <p className="text-xs text-text-muted italic">
            Belum ada catatan untuk lamaran ini. Klik Edit untuk menambahkan catatan.
          </p>
        )}
      </div>

      {/* Status History Timeline */}
      <StatusTimeline history={history} />
    </div>
  );
}
