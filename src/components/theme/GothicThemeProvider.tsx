'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface GothicThemeContextType {
  theme: 'gothic-dark';
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const GothicThemeContext = createContext<GothicThemeContextType>({
  theme: 'gothic-dark',
  highContrast: false,
  toggleHighContrast: () => {},
});

export const useGothicTheme = () => useContext(GothicThemeContext);

export function GothicThemeProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  return (
    <GothicThemeContext.Provider value={{ theme: 'gothic-dark', highContrast, toggleHighContrast }}>
      {children}
    </GothicThemeContext.Provider>
  );
}
