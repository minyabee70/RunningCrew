'use client';

import Link from 'next/link';
import { ChevronRight, FileText, Shield } from 'lucide-react';
import { useSettings } from '@/context/SettingsProvider';

const links = [
  { href: '/privacy', labelKey: 'settings.privacyPolicy', icon: Shield },
  { href: '/terms', labelKey: 'settings.termsOfService', icon: FileText },
] as const;

export function LegalLinksSection() {
  const { t } = useSettings();

  return (
    <section className="space-y-2">
      <h2 className="font-semibold">{t('settings.legal')}</h2>
      <ul className="rounded-xl border border-[var(--rc-border)] overflow-hidden divide-y divide-[var(--rc-border)]">
        {links.map(({ href, labelKey, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-3">
                <Icon size={18} className="text-[var(--rc-accent)] shrink-0" />
                {t(labelKey)}
              </span>
              <ChevronRight size={16} className="text-[var(--rc-muted)] shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
