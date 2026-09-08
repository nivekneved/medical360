import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Search,
  DollarSign,
  Save,
  RotateCcw,
  Sparkles,
  TrendingDown,
  Globe2,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { useToast } from '../../../providers/ToastProvider';
import { DEFAULT_MUR_RATE } from '../../../core/config/site';
import { auditService } from '../../../core/services/audit.service';
import './AdminPricing.css';

interface ProcedurePriceRow {
  id: string;
  name: string;
  specialtyName: string;
  minUSD: number;
  maxUSD: number;
  durationDays: number;
}

interface CountryMultiplier {
  country: string;
  flag: string;
  multiplier: number;
  hospitalRef: string;
}

const INITIAL_PROCEDURES: ProcedurePriceRow[] = [
  { id: 'proc-card-1', name: 'Coronary Artery Bypass Graft (CABG)', specialtyName: 'Cardiology', minUSD: 5000, maxUSD: 9500, durationDays: 10 },
  { id: 'proc-card-2', name: 'TAVI / TAVR & Valve Replacement', specialtyName: 'Cardiology', minUSD: 16000, maxUSD: 28000, durationDays: 7 },
  { id: 'proc-card-3', name: 'Angioplasty & Complex Stenting', specialtyName: 'Cardiology', minUSD: 3200, maxUSD: 6500, durationDays: 4 },
  { id: 'proc-onc-1', name: 'Surgical Oncology & Tumour Resection', specialtyName: 'Oncology', minUSD: 6000, maxUSD: 15000, durationDays: 14 },
  { id: 'proc-onc-2', name: 'CyberKnife & Proton Beam Radiotherapy', specialtyName: 'Oncology', minUSD: 8000, maxUSD: 18000, durationDays: 10 },
  { id: 'proc-onc-3', name: 'Chemotherapy Cycle & Immunotherapy', specialtyName: 'Oncology', minUSD: 3000, maxUSD: 12000, durationDays: 21 },
  { id: 'proc-ortho-1', name: 'Total Knee Replacement (Bilateral)', specialtyName: 'Orthopaedics', minUSD: 6500, maxUSD: 11000, durationDays: 8 },
  { id: 'proc-ortho-2', name: 'Total Hip Replacement (Robotic)', specialtyName: 'Orthopaedics', minUSD: 6000, maxUSD: 10500, durationDays: 7 },
  { id: 'proc-neuro-1', name: 'Craniotomy & Brain Tumour Excision', specialtyName: 'Neurology', minUSD: 7500, maxUSD: 16000, durationDays: 12 },
  { id: 'proc-trans-1', name: 'Living Donor Liver Transplantation', specialtyName: 'Transplants', minUSD: 28000, maxUSD: 42000, durationDays: 28 },
  { id: 'proc-trans-2', name: 'Renal / Kidney Transplantation', specialtyName: 'Transplants', minUSD: 12000, maxUSD: 19500, durationDays: 18 },
];

const INITIAL_COUNTRIES: CountryMultiplier[] = [
  { country: 'India (Partner Centres)', flag: '🇮🇳', multiplier: 1.0, hospitalRef: 'Apollo / Medanta / Fortis' },
  { country: 'Mauritius (Private Clinics)', flag: '🇲🇺', multiplier: 2.2, hospitalRef: 'Local Private Clinic' },
  { country: 'France / UK (European Care)', flag: '🇫🇷', multiplier: 3.5, hospitalRef: 'European Private Care' },
  { country: 'Singapore (Mount Elizabeth)', flag: '🇸🇬', multiplier: 2.4, hospitalRef: 'Mount Elizabeth / Gleneagles' },
  { country: 'Thailand (Bumrungrad)', flag: '🇹🇭', multiplier: 1.35, hospitalRef: 'Bumrungrad Hospital' },
  { country: 'Malaysia (Prince Court)', flag: '🇲🇾', multiplier: 1.25, hospitalRef: 'Gleneagles Hospital' },
];

export function AdminPricingPage() {
  const toast = useToast();
  const [procedures, setProcedures] = useState<ProcedurePriceRow[]>(() => {
    try {
      const saved = localStorage.getItem('med360_custom_pricing');
      return saved ? JSON.parse(saved) : INITIAL_PROCEDURES;
    } catch {
      return INITIAL_PROCEDURES;
    }
  });

  const [countries, setCountries] = useState<CountryMultiplier[]>(() => {
    try {
      const saved = localStorage.getItem('med360_custom_multipliers');
      return saved ? JSON.parse(saved) : INITIAL_COUNTRIES;
    } catch {
      return INITIAL_COUNTRIES;
    }
  });

  const [search, setSearch] = useState('');
  const [murRate, setMurRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('med360_exchange_mur');
      return saved ? parseFloat(saved) : DEFAULT_MUR_RATE;
    } catch {
      return DEFAULT_MUR_RATE;
    }
  });

  const filteredProcedures = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return procedures;
    return procedures.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.specialtyName.toLowerCase().includes(q)
    );
  }, [procedures, search]);

  const handleUpdatePrice = (id: string, field: 'minUSD' | 'maxUSD' | 'durationDays', val: number) => {
    setProcedures((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleUpdateMultiplier = (countryName: string, val: number) => {
    setCountries((prev) =>
      prev.map((c) => (c.country === countryName ? { ...c, multiplier: val } : c))
    );
  };

  const handleSaveAll = () => {
    try {
      localStorage.setItem('med360_custom_pricing', JSON.stringify(procedures));
      localStorage.setItem('med360_custom_multipliers', JSON.stringify(countries));
      localStorage.setItem('med360_exchange_mur', murRate.toString());

      auditService.log({
        actorName: 'Deven Admin',
        actorRole: 'super_admin',
        action: 'update',
        entityType: 'system',
        details: `Updated procedure price schedule (${procedures.length} procedures) and MUR rate (${murRate})`,
      });

      toast.success('Procedure pricing matrix & country multipliers saved successfully.', {
        title: 'Pricing Synchronized',
      });
    } catch (e) {
      toast.error('Failed to persist pricing matrix.', { title: 'Save Error' });
    }
  };

  const handleResetDefaults = () => {
    setProcedures(INITIAL_PROCEDURES);
    setCountries(INITIAL_COUNTRIES);
    setMurRate(DEFAULT_MUR_RATE);
    localStorage.removeItem('med360_custom_pricing');
    localStorage.removeItem('med360_custom_multipliers');
    localStorage.removeItem('med360_exchange_mur');

    toast.info('Reset pricing configuration back to institutional defaults.', {
      title: 'Defaults Restored',
    });
  };

  return (
    <div className="admin-pricing-container">
      {/* ── Top Header ── */}
      <div className="admin-pricing-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calculator size={26} color="#34d399" /> Procedure Pricing & Cost Matrix
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.35rem 0 0', fontSize: '0.875rem' }}>
            Configure clinical procedure base costs (USD/MUR), duration days, and comparative country multiplier tiers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleResetDefaults}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAll}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} /> Save Pricing Changes
          </button>
        </div>
      </div>

      {/* ── Stat Badges ── */}
      <div className="admin-pricing-stats-grid">
        <div className="admin-pricing-stat-card">
          <div className="admin-pricing-stat-icon"><DollarSign size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>1 USD = {murRate} MUR</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Base Exchange Rate</div>
          </div>
        </div>

        <div className="admin-pricing-stat-card">
          <div className="admin-pricing-stat-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' }}><Layers size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{procedures.length} Procedures</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Indexed in Cost Calculator</div>
          </div>
        </div>

        <div className="admin-pricing-stat-card">
          <div className="admin-pricing-stat-icon" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)' }}><TrendingDown size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Up to 85% Savings</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>vs European Private Hospitals</div>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="admin-pricing-controls">
        <div className="admin-pricing-search">
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input
            type="text"
            placeholder="Search procedures or specialties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>Live MUR Rate:</span>
          <input
            type="number"
            value={murRate}
            onChange={(e) => setMurRate(parseFloat(e.target.value) || DEFAULT_MUR_RATE)}
            className="admin-pricing-input"
            style={{ width: '80px' }}
          />
        </div>
      </div>

      {/* ── Procedures Table ── */}
      <div className="admin-pricing-table-wrapper">
        <table className="admin-pricing-table">
          <thead>
            <tr>
              <th>Procedure Name</th>
              <th>Specialty</th>
              <th>Min Cost (USD)</th>
              <th>Max Cost (USD)</th>
              <th>Est. MUR (Min ➔ Max)</th>
              <th>Duration (Days)</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcedures.map((proc) => {
              const minMur = Math.round(proc.minUSD * murRate).toLocaleString();
              const maxMur = Math.round(proc.maxUSD * murRate).toLocaleString();
              return (
                <tr key={proc.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{proc.name}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4 }}>
                      {proc.specialtyName}
                    </span>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={proc.minUSD}
                      onChange={(e) => handleUpdatePrice(proc.id, 'minUSD', parseInt(e.target.value) || 0)}
                      className="admin-pricing-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={proc.maxUSD}
                      onChange={(e) => handleUpdatePrice(proc.id, 'maxUSD', parseInt(e.target.value) || 0)}
                      className="admin-pricing-input"
                    />
                  </td>
                  <td style={{ color: '#34d399', fontWeight: 600, fontSize: '0.8125rem' }}>
                    Rs {minMur} - {maxMur}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={proc.durationDays}
                      onChange={(e) => handleUpdatePrice(proc.id, 'durationDays', parseInt(e.target.value) || 1)}
                      className="admin-pricing-input"
                      style={{ width: '65px' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Country Comparison Multipliers ── */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Globe2 size={20} color="#38bdf8" /> International Cost Comparison Multipliers
      </h3>
      <div className="admin-country-multipliers-grid">
        {countries.map((c) => (
          <div key={c.country} className="admin-country-multiplier-card">
            <div className="admin-country-multiplier-header">
              <span style={{ fontSize: '1.25rem' }}>{c.flag}</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{c.hospitalRef}</span>
            </div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9375rem' }}>{c.country}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>Cost Multiplier:</span>
              <input
                type="number"
                step="0.05"
                value={c.multiplier}
                onChange={(e) => handleUpdateMultiplier(c.country, parseFloat(e.target.value) || 1.0)}
                className="admin-pricing-input"
                style={{ width: '80px', textAlign: 'right' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
