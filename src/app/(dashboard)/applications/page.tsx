import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getApplicationsList } from "@/lib/db/queries";
import { FilterBar } from "@/components/filter-bar";
import { ApplicationsTable } from "@/components/applications-table";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Daftar Lamaran — Job Tracker",
};

interface ApplicationsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sortBy?: "applied_date" | "updated_at";
    sortOrder?: "asc" | "desc";
  }>;
}

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const user = await requireUser();
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "all";
  const sortBy = resolvedSearchParams.sortBy || "updated_at";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const applications = await getApplicationsList(user.userId, {
    search,
    status,
    sortBy,
    sortOrder,
  });

  const hasFilterApplied = Boolean(search || (status && status !== "all"));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
            Semua Data
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Daftar Lamaran Kerja
          </h1>
        </div>

        <Link href="/applications/new">
          <Button variant="primary" size="md" className="gap-1.5 w-full sm:w-auto">
            <Plus size={16} weight="bold" />
            Tambah Lamaran
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar />

      {/* Table view */}
      <ApplicationsTable
        items={applications}
        hasFilterApplied={hasFilterApplied}
      />
    </div>
  );
}
