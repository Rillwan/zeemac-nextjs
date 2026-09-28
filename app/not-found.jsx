import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-brand font-bold tracking-wide text-sm mb-2">404</p>
        <h1 className="text-3xl font-extrabold text-brand-navy">Page not found</h1>
        <p className="mt-4 text-slate-500 max-w-md mx-auto">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">Go back home</Link>
      </div>
    </main>
  );
}
