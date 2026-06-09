import { PageTransition } from '@/components/ui/PageTransition';
import { IntroWrapper } from '@/components/IntroWrapper';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen relative z-10">
      <IntroWrapper>
        <PageTransition>{children}</PageTransition>
      </IntroWrapper>
    </main>
  );
}
