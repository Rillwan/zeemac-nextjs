import OtpLoginForm from '@/components/admin/OtpLoginForm';

export const metadata = { title: 'Admin Login' };

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <OtpLoginForm />
    </main>
  );
}
