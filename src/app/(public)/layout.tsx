import { PageTransition } from '@/components/ui/PageTransition';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen relative z-10">
      <PageTransition>{children}</PageTransition>
    </main>
  );
}
