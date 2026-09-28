import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LogoutButton from '@/components/admin/LogoutButton';

const TABS = [
  { href: '/admin', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/brands', label: 'Brands' },
  { href: '/admin/content', label: 'Page content' }
];

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-extrabold text-brand-navy">Zeemac Admin</p>
          {session?.email && <p className="text-xs text-slate-400">{session.email}</p>}
        </div>
        <LogoutButton />
      </header>
      <nav className="bg-white border-b border-slate-100 px-6 flex gap-6">
        {TABS.map((tab) => (
          <Link key={tab.href} href={tab.href} className="text-sm font-semibold text-slate-500 hover:text-brand py-3 border-b-2 border-transparent hover:border-brand transition-colors">
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}
