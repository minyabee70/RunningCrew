'use client';

import { useSettings } from '@/context/SettingsProvider';
import { termsOfService } from '@/content/legal/terms';
import { LegalPageLayout, LegalSection } from '@/components/legal/LegalPageLayout';

export default function TermsPage() {
  const { language } = useSettings();
  const doc = termsOfService[language === 'en' ? 'en' : 'ko'];

  return (
    <LegalPageLayout title={doc.title} lastUpdated={doc.lastUpdated}>
      {doc.sections.map((section) => (
        <LegalSection key={section.heading} heading={section.heading} paragraphs={section.paragraphs} />
      ))}
    </LegalPageLayout>
  );
}
