import { useState, useEffect } from 'react';

export interface PlatformSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsAppNumber: string;
  defaultCurrency: string;
  murExchangeRate: number;
  ngoHeritageName: string;
  enableCostComparison: boolean; // default false (hidden)
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  siteName: 'Med360',
  tagline: 'Specialised Medical Care in Private Clinics & Abroad',
  supportEmail: 'info@med360.mu',
  supportPhone: '+230 59188275',
  whatsAppNumber: '23059188275',
  defaultCurrency: 'USD',
  murExchangeRate: 46.5,
  ngoHeritageName: 'NGO Enn Rev Enn Sourir',
  enableCostComparison: false, // Hidden by default, can be toggled on in admin settings
};

const SETTINGS_STORAGE_KEY = 'med360_platform_settings_v1';
const SETTINGS_EVENT = 'med360_platform_settings_updated';

export function getPlatformSettings(): PlatformSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PLATFORM_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Failed to parse platform settings from storage:', err);
  }
  return { ...DEFAULT_PLATFORM_SETTINGS };
}

export function savePlatformSettings(settings: Partial<PlatformSettings>): PlatformSettings {
  try {
    const current = getPlatformSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('Failed to save platform settings:', err);
    return getPlatformSettings();
  }
}

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(getPlatformSettings);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<PlatformSettings>;
      if (custom.detail) {
        setSettings(custom.detail);
      } else {
        setSettings(getPlatformSettings());
      }
    };

    window.addEventListener(SETTINGS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const update = (partial: Partial<PlatformSettings>) => {
    const saved = savePlatformSettings(partial);
    setSettings(saved);
  };

  return { settings, updateSettings: update };
}
