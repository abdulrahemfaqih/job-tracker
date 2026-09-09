import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/db/queries";
import { DashboardStats } from "@/components/dashboard-stats";
import { FollowUpSection } from "@/components/follow-up-card";
import { RecentTable } from "@/components/recent-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { PwaInstallBanner } from "@/components/pwa-install-banner";

export const metadata = {

  title: "Dashboard — Job Tracker",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = await getDashboardData(user.userId);

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
            Ringkasan Aktivitas
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Dashboard
          </h1>
        </div>

        <Link href="/applications/new">
          <Button variant="primary" size="md" className="gap-1.5 w-full sm:w-auto">
            <Plus size={16} weight="bold" />
            Tambah Lamaran
          </Button>
        </Link>
      </div>

      {/* PWA Install Notification Banner */}
      <PwaInstallBanner />

      {stats.total === 0 ? (
        <EmptyState
          title="Belum Ada Lamaran Tercatat"
          description="Mulai catat lamaran pekerjaan yang sudah kamu kirimkan agar proses interview dan progress tidak tercecer."
          actionHref="/applications/new"
          actionLabel="Tambah Lamaran Pertamamu"
        />
      ) : (
        <div className="flex flex-col gap-8">
          {/* Summary Stats & Distribution Bar */}
          <DashboardStats stats={stats} />

          {/* Follow-up card if any */}
          <FollowUpSection items={stats.followUps} />

          {/* Recent 5 Applications */}
          <RecentTable items={stats.recent} />
        </div>
      )}
    </div>
  );
}
