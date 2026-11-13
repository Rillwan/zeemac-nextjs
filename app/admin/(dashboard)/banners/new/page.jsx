import BannerForm from '@/components/admin/BannerForm';

export const metadata = { title: 'Add Banner' };

export default function NewBannerPage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Banner</h2>
      <BannerForm />
    </div>
  );
}
