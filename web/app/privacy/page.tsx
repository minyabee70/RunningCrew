'use client';

import { useSettings } from '@/context/SettingsProvider';
import { privacyPolicy } from '@/content/legal/privacy';
import { LegalPageLayout, LegalSection } from '@/components/legal/LegalPageLayout';

export default function PrivacyPage() {
  const { language } = useSettings();
  const doc = privacyPolicy[language === 'en' ? 'en' : 'ko'];

  return (
    <LegalPageLayout title={doc.title} lastUpdated={doc.lastUpdated}>
      {doc.sections.map((section) => (
        <LegalSection key={section.heading} heading={section.heading} paragraphs={section.paragraphs} />
      ))}
    </LegalPageLayout>
  );
}
