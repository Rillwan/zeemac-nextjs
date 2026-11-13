import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = { title: 'Site Settings' };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-2">Site Settings</h2>
      <p className="text-sm text-slate-500 mb-6">
        Contact details used on the Contact page, the footer, the WhatsApp button and every “Enquire Now” button.
        Change them here once and they update everywhere.
      </p>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
