'use client';

import { signIn } from 'next-auth/react';
import { Activity, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
        <p className="text-sm text-[var(--rc-accent)] font-medium mb-3">RunningCrew</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          러닝 데이터를 한곳에서 분석하세요
        </h1>
        <p className="text-[var(--rc-muted)] mb-8 text-lg">
          기록 → 시각화 → AI 코칭. Click, click, done.
        </p>
        <Button
          className="px-8 py-3 text-base"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          Google로 시작하기
        </Button>
      </div>

      <div className="px-6 pb-12 max-w-4xl mx-auto w-full">
        <ol className="grid md:grid-cols-3 gap-4 mb-10">
          {['앱에서 기록', '자동 동기화', 'AI 분석'].map((step, i) => (
            <li key={step} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
              <span className="w-8 h-8 rounded-full bg-[var(--rc-accent)]/20 text-[var(--rc-accent)] flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span className="text-sm font-medium">{step}</span>
            </li>
          ))}
        </ol>
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard icon={Activity} title="GPS 추적" desc="실시간 경로와 메트릭 기록" />
          <FeatureCard icon={BarChart3} title="차트 분석" desc="페이스·거리·교차 분석" />
          <FeatureCard icon={Sparkles} title="Gemini 인사이트" desc="DB 캐시 기반 AI 코칭" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <Icon size={24} className="text-[var(--rc-accent)]" />
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-[var(--rc-muted)]">{desc}</p>
      </CardContent>
    </Card>
  );
}
