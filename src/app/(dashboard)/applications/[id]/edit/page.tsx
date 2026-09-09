import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getApplicationDetail } from "@/lib/db/queries";
import { ApplicationForm } from "@/components/application-form";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Edit Lamaran — Job Tracker",
};

interface EditApplicationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApplicationPage({
  params,
}: EditApplicationPageProps) {
  const user = await requireUser();
  const { id } = await params;

  const { application } = await getApplicationDetail(id, user.userId);

  if (!application) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/applications/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary mb-3 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Kembali ke Detail
        </Link>
      </div>

      <ApplicationForm initialData={application} />
    </div>
  );
}
