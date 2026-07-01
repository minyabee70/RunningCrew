export const THEME_IDS = ['default', 'white', 'cosmic', 'ocean', 'forest'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const THEME_LABELS: Record<ThemeId, string> = {
  default: 'Sky Blue',
  white: 'White',
  cosmic: 'Cosmic',
  ocean: 'Ocean',
  forest: 'Forest',
};

export function applyThemeClass(theme: string): string {
  return theme !== 'default' ? `theme-${theme}` : '';
}

export const STORAGE_KEYS = {
  language: 'running_crew_language',
  theme: 'running_crew_theme',
  fontScale: 'running_crew_font_scale',
  height: 'running_crew_height',
  weight: 'running_crew_weight',
} as const;
