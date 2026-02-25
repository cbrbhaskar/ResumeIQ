import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebar userEmail={session.user.email || undefined} />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
