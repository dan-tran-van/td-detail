'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface VisitorProfile {
  id: string;
  name: string;
  email: string;
  isCustom: boolean;
}

interface VisitorContextType {
  visitor: VisitorProfile;
  updateVisitor: (updates: Partial<Omit<VisitorProfile, 'id'>>) => void;
  isLoaded: boolean;
}

const VISITOR_STORAGE_KEY = 'soundwave_music_visitor_v1';

const defaultVisitor: VisitorProfile = {
  id: 'guest_init',
  name: 'SoundWave Guest',
  email: 'guest@soundwave.store',
  isCustom: false,
};

const VisitorContext = createContext<VisitorContextType>({
  visitor: defaultVisitor,
  updateVisitor: () => {},
  isLoaded: false,
});

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const [visitor, setVisitor] = useState<VisitorProfile>(defaultVisitor);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(VISITOR_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setVisitor(parsed);
      } else {
        // Generate a unique visitor profile for this browser
        const uniqueSuffix = Math.random().toString(36).substring(2, 6).toLowerCase();
        const newVisitor: VisitorProfile = {
          id: `cust_guest_${uniqueSuffix}`,
          name: `SoundWave Guest #${uniqueSuffix.toUpperCase()}`,
          email: `guest_${uniqueSuffix}@soundwave.store`,
          isCustom: false,
        };
        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(newVisitor));
        setVisitor(newVisitor);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateVisitor = (updates: Partial<Omit<VisitorProfile, 'id'>>) => {
    setVisitor((prev) => {
      const updated: VisitorProfile = {
        ...prev,
        ...updates,
        isCustom: true,
      };
      try {
        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
    <VisitorContext.Provider value={{ visitor, updateVisitor, isLoaded }}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitor() {
  return useContext(VisitorContext);
}
