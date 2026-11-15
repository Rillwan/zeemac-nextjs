import { getSession } from '@/lib/auth';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader email={session?.email || ''} />
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
