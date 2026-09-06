import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Coins } from 'lucide-react';
import { useCurrency, type CurrencyCode } from '../../providers/CurrencyProvider';
import './CurrencySwitcher.css';

interface CurrencySwitcherProps {
  variant?: 'navbar' | 'mobile' | 'inline';
}

export function CurrencySwitcher({ variant = 'navbar' }: CurrencySwitcherProps) {
  const { currency, currencyInfo, availableCurrencies, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="currency-switcher-mobile">
        <div className="currency-switcher-mobile__header">
          <Coins size={16} color="var(--color-primary)" />
          <span>Select Currency:</span>
        </div>
        <div className="currency-switcher-mobile__grid">
          {availableCurrencies.map((c) => {
            const isActive = currency === c.code;
            return (
              <button
                key={c.code}
                type="button"
                className={`currency-switcher-mobile__btn ${isActive ? 'currency-switcher-mobile__btn--active' : ''}`}
                onClick={() => handleSelect(c.code)}
              >
                <span>{c.flag}</span>
                <strong>{c.code}</strong>
                <span className="currency-switcher-mobile__symbol">({c.symbol.trim()})</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="currency-switcher" ref={containerRef}>
      <button
        type="button"
        className={`currency-switcher__btn ${isOpen ? 'currency-switcher__btn--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Change currency"
        title="Change Currency"
      >
        <span className="currency-switcher__flag">{currencyInfo.flag}</span>
        <span className="currency-switcher__code">{currencyInfo.code}</span>
        <ChevronDown size={13} className={`currency-switcher__chevron ${isOpen ? 'currency-switcher__chevron--up' : ''}`} />
      </button>

      {isOpen && (
        <div className="currency-switcher__dropdown" role="menu">
          <div className="currency-switcher__dropdown-header">
            <span>Select Currency</span>
          </div>
          <div className="currency-switcher__list">
            {availableCurrencies.map((c) => {
              const isActive = currency === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  role="menuitem"
                  className={`currency-switcher__option ${isActive ? 'currency-switcher__option--active' : ''}`}
                  onClick={() => handleSelect(c.code)}
                >
                  <span className="currency-switcher__opt-flag">{c.flag}</span>
                  <div className="currency-switcher__opt-info">
                    <div className="currency-switcher__opt-code">
                      <strong>{c.code}</strong>
                      <span className="currency-switcher__opt-symbol">({c.symbol.trim()})</span>
                    </div>
                    <span className="currency-switcher__opt-name">{c.name}</span>
                  </div>
                  {isActive && <Check size={14} className="currency-switcher__opt-check" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
