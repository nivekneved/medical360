import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeId = 'Med-default' | 'Med-dark' | 'Ocean-Blue' | 'Royal-Amethyst' | 'Rose-Bronze' | string;

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  shortName: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  previewBg: string;
  textColor: string;
  isDark?: boolean;
  badge?: string;
}

export const THEME_PRESETS: ThemeDefinition[] = [
  {
    id: 'Med-default',
    name: 'Med-default',
    shortName: 'Med-default',
    description: 'Signature Medical 360 clean white & medical forest green palette.',
    primaryColor: '#065f46',
    accentColor: '#10b981',
    previewBg: '#f8fafc',
    textColor: '#0f172a',
    isDark: false,
    badge: 'Signature',
  },
  {
    id: 'Med-dark',
    name: 'Med-dark (Midnight Onyx)',
    shortName: 'Med-dark',
    description: 'Deep onyx dark mode with luminous emerald & mint accents.',
    primaryColor: '#10b981',
    accentColor: '#34d399',
    previewBg: '#090d10',
    textColor: '#f8fafc',
    isDark: true,
    badge: 'Dark Mode',
  },
  {
    id: 'Ocean-Blue',
    name: 'Pacific Azure',
    shortName: 'Ocean Blue',
    description: 'International clinical hospital sapphire & cyan aesthetic.',
    primaryColor: '#0369a1',
    accentColor: '#06b6d4',
    previewBg: '#f0f9ff',
    textColor: '#0c4a6e',
    isDark: false,
    badge: 'Clinical',
  },
  {
    id: 'Royal-Amethyst',
    name: 'Royal Amethyst',
    shortName: 'Amethyst',
    description: 'Luxury concierge & private wellness royal indigo and purple.',
    primaryColor: '#4338ca',
    accentColor: '#8b5cf6',
    previewBg: '#f5f3ff',
    textColor: '#312e81',
    isDark: false,
    badge: 'Luxury',
  },
  {
    id: 'Rose-Bronze',
    name: 'Aesthetic Rose',
    shortName: 'Rose Bronze',
    description: 'Aesthetic medicine, dermatology & fertility warm coral and rose tone.',
    primaryColor: '#9f1239',
    accentColor: '#f43f5e',
    previewBg: '#fff1f2',
    textColor: '#881337',
    isDark: false,
    badge: 'Cosmetic',
  },
];

interface ThemeContextValue {
  theme: ThemeId;
  currentTheme: ThemeDefinition;
  availableThemes: ThemeDefinition[];
  isDark: boolean;
  setTheme: (themeId: ThemeId) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'med360_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        if (stored === 'light') return 'Med-default';
        if (stored === 'dark') return 'Med-dark';
        if (THEME_PRESETS.some(t => t.id === stored)) return stored;
      }
    } catch {}
    return 'Med-default'; // Default to Med-default as requested
  });

  const currentTheme = THEME_PRESETS.find(t => t.id === theme) || THEME_PRESETS[0];
  const isDark = Boolean(currentTheme.isDark);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme, isDark]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'Med-default' ? 'Med-dark' : 'Med-default'));
  };

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        availableThemes: THEME_PRESETS,
        isDark,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
