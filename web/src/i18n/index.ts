import { ko } from './ko';
import { en } from './en';

export { ko, en };

export type Locale = 'ko' | 'en';

export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const dict = locale === 'ko' ? ko : en;
  let text = dict[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
