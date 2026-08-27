import AdminNav from "@/components/admin/AdminNav";
import Toaster from "@/components/admin/Toaster";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-4xl px-4 py-5 pb-20">{children}</main>
      <Toaster />
    </>
  );
}
