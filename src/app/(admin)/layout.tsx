import type { Metadata } from "next";
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper";
import { AdminHeader } from "@/components/admin/header";

export const metadata: Metadata = {
  title: "BotFolio Admin",
  description: "Manage your portfolio and AI settings.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutWrapper>
      <AdminHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto min-h-0">
        {children}
      </main>
    </AdminLayoutWrapper>
  );
}
