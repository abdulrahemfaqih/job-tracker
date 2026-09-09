import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { ApplicationForm } from "@/components/application-form";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Tambah Lamaran — Job Tracker",
};

export default async function NewApplicationPage() {
  await requireUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary mb-3 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          Kembali ke Daftar
        </Link>
      </div>

      <ApplicationForm />
    </div>
  );
}
