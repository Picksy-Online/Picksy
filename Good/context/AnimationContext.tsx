
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AnimationContextType = {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedPreference = localStorage.getItem('animationsEnabled');
      if (storedPreference !== null) {
        setAnimationsEnabledState(JSON.parse(storedPreference));
      }
    } catch (error) {
      console.error('Could not read animation preference from localStorage', error);
    }
  }, []);

  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    if (isMounted) {
      try {
        localStorage.setItem('animationsEnabled', JSON.stringify(enabled));
      } catch (error) {
        console.error('Could not save animation preference to localStorage', error);
      }
    }
  };
  
  // Prevent hydration mismatch by not rendering anything until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <AnimationContext.Provider value={{ animationsEnabled, setAnimationsEnabled }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
