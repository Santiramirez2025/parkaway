import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";

export const metadata = {
  title: "Panel admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex bg-ink-950">
      <Sidebar className="hidden lg:flex w-64 border-r border-ink-800 sticky top-0 h-screen" />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userName={session.user.name || "Admin"} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
