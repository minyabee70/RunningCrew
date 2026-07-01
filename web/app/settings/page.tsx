'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { SettingsMenu } from '@/components/settings/SettingsMenu';
import { useSettings } from '@/context/SettingsProvider';

export default function SettingsPage() {
  const { t } = useSettings();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.settings')}</h1>
        <p className="text-sm text-[var(--rc-muted)] mt-1">언어, 테마, 생체 정보를 관리합니다.</p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-semibold">{t('nav.settings')}</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <SettingsMenu />
        </CardContent>
      </Card>
    </div>
  );
}
