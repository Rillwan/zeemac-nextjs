import HomepageItemForm from '@/components/admin/HomepageItemForm';

export const metadata = { title: 'Add Homepage Item' };

export default async function NewHomepageItemPage({ searchParams }) {
  const sp = await searchParams;
  const section = sp?.section || 'categories';

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Item</h2>
      <HomepageItemForm section={section} />
    </div>
  );
}
