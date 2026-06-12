import { AdminNavbar } from "@/components/shared/admin-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminNavbar />
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
}
