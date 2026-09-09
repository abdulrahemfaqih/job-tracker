import { requireUser } from "@/lib/auth/session";
import { Navbar } from "@/components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary">
      <Navbar user={user} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="border-t border-border py-6 text-center text-xs font-mono text-text-muted">
        Job Tracker — Utilitarian Personal Tracker
      </footer>
    </div>
  );
}
