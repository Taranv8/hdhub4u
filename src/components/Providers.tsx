// src/components/Providers.tsx
'use client';

import { MonthlyMoviesProvider } from '@/contexts/MonthlyMoviesContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MonthlyMoviesProvider>
      {children}
    </MonthlyMoviesProvider>
  );
}