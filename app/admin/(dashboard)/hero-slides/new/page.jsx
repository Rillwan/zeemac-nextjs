import HeroSlideForm from '@/components/admin/HeroSlideForm';

export const metadata = { title: 'Add Hero Slide' };

export default function NewHeroSlidePage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Hero Slide</h2>
      <HeroSlideForm />
    </div>
  );
}
