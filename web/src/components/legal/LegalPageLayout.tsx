'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSettings } from '@/context/SettingsProvider';

type LegalPageLayoutProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  const { t } = useSettings();
  const { data: session } = useSession();
  const backHref = session ? '/settings' : '/login';
  const backLabel = session ? t('legal.backToSettings') : t('legal.backToLogin');

  return (
    <div className="min-h-screen bg-[var(--rc-bg)] text-[var(--rc-text)]">
      <header className="border-b border-[var(--rc-border)] bg-[var(--rc-surface)]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--rc-muted)] hover:text-[var(--rc-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-sm text-[var(--rc-accent)] font-medium mb-2">RunningCrew</p>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-[var(--rc-muted)] mb-8">{lastUpdated}</p>
        <article className="space-y-8 text-sm leading-relaxed text-[var(--rc-text)]/90">
          {children}
        </article>
        <footer className="mt-12 pt-6 border-t border-[var(--rc-border)] text-xs text-[var(--rc-muted)]">
          <p>{t('legal.contact')}: minyabee70@gmail.com</p>
        </footer>
      </main>
    </div>
  );
}

export function LegalSection({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <section>
      <h2 className="text-base font-semibold mb-3 text-[var(--rc-text)]">{heading}</h2>
      <div className="space-y-3">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
    </section>
  );
}
