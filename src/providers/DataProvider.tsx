import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { MockConfig } from '../core/types';
import { loadMockConfig, saveMockConfig, resetMockData, mockEngine } from '../core/mock/engine';

// ─── Context Shape ────────────────────────────────────────────────────────────
interface DataContextValue {
  isMock: boolean;
  mockConfig: MockConfig;
  updateMockConfig: (config: MockConfig) => void;
  resetMock: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function DataProvider({ children }: { children: ReactNode }) {
  const [mockConfig, setMockConfig] = useState<MockConfig>(loadMockConfig);

  useEffect(() => {
    mockEngine.updateConfig(mockConfig);
    saveMockConfig(mockConfig);
  }, [mockConfig]);

  function updateMockConfig(config: MockConfig) {
    setMockConfig(config);
  }

  function resetMock() {
    resetMockData();
    window.location.reload();
  }

  return (
    <DataContext.Provider
      value={{
        isMock: mockConfig.enabled,
        mockConfig,
        updateMockConfig,
        resetMock,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useDataConfig(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataConfig must be used inside DataProvider');
  return ctx;
}
