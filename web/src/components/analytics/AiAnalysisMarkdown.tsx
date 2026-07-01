'use client';

import ReactMarkdown from 'react-markdown';

export function AiAnalysisMarkdown({ summary }: { summary: string }) {
  return (
    <article className="prose prose-invert max-w-none p-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)]">
      <ReactMarkdown>{summary}</ReactMarkdown>
    </article>
  );
}
