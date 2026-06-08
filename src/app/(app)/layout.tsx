import { PageTransition } from '@/components/ui/PageTransition';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="md:pl-64 pb-20 md:pb-0 min-h-screen relative z-10">
      <PageTransition>{children}</PageTransition>
    </main>
  );
}
