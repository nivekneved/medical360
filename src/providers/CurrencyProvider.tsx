import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usePlatformSettings } from '../core/services/settings.service';

export type CurrencyCode = 'USD' | 'MUR' | 'EUR' | 'GBP' | 'ZAR' | 'MGA' | 'SCR' | 'INR';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rateAgainstUSD: number; // e.g. 1 USD = 46.5 MUR
}

export const BASE_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rateAgainstUSD: 1.0 },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: 'Rs ', flag: '🇲🇺', rateAgainstUSD: 46.5 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rateAgainstUSD: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rateAgainstUSD: 0.79 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R ', flag: '🇿🇦', rateAgainstUSD: 18.2 },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar ', flag: '🇲🇬', rateAgainstUSD: 4600 },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'SR ', flag: '🇸🇨', rateAgainstUSD: 13.8 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rateAgainstUSD: 83.5 },
];

interface CurrencyContextValue {
  currency: CurrencyCode;
  currencyInfo: CurrencyInfo;
  availableCurrencies: CurrencyInfo[];
  setCurrency: (code: CurrencyCode) => void;
  convert: (usdAmount: number) => number;
  formatPrice: (usdAmount: number) => string;
  formatCostRange: (minUsd: number, maxUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = 'med360_active_currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { settings } = usePlatformSettings();

  // Dynamic rates based on platform settings if configured
  const murRate = settings.murExchangeRate || 46.5;

  const currencies: CurrencyInfo[] = BASE_CURRENCIES.map(c => {
    if (c.code === 'MUR') return { ...c, rateAgainstUSD: murRate };
    return c;
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (stored && BASE_CURRENCIES.some(c => c.code === stored)) {
        return stored;
      }
    } catch {}
    return (settings.defaultCurrency as CurrencyCode) || 'USD';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, [currency]);

  const currencyInfo = currencies.find(c => c.code === currency) || currencies[0];

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
  };

  const convert = (usdAmount: number): number => {
    if (currency === 'USD') return usdAmount;
    return Math.round(usdAmount * currencyInfo.rateAgainstUSD);
  };

  const formatPrice = (usdAmount: number): string => {
    const converted = convert(usdAmount);
    const formatted = converted.toLocaleString('en-US');
    if (currency === 'USD') return `$${formatted}`;
    if (currency === 'EUR') return `€${formatted}`;
    if (currency === 'GBP') return `£${formatted}`;
    if (currency === 'INR') return `₹${formatted}`;
    return `${currencyInfo.symbol}${formatted}`;
  };

  const formatCostRange = (minUsd: number, maxUsd: number): string => {
    const min = convert(minUsd).toLocaleString('en-US');
    const max = convert(maxUsd).toLocaleString('en-US');

    if (currency === 'USD') return `$${min} – $${max}`;
    if (currency === 'EUR') return `€${min} – €${max}`;
    if (currency === 'GBP') return `£${min} – £${max}`;
    if (currency === 'INR') return `₹${min} – ₹${max}`;
    return `${currencyInfo.symbol}${min} – ${currencyInfo.symbol}${max}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyInfo,
        availableCurrencies: currencies,
        setCurrency,
        convert,
        formatPrice,
        formatCostRange,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Graceful fallback if called outside provider
    return {
      currency: 'USD',
      currencyInfo: BASE_CURRENCIES[0],
      availableCurrencies: BASE_CURRENCIES,
      setCurrency: () => {},
      convert: (amt) => amt,
      formatPrice: (amt) => `$${amt.toLocaleString('en-US')}`,
      formatCostRange: (min, max) => `$${min.toLocaleString('en-US')} – $${max.toLocaleString('en-US')}`,
    };
  }
  return ctx;
}
