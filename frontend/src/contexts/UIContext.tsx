import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isAgentMode: boolean;
  toggleAgentMode: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isAgentMode, setIsAgentMode] = useState(false);

  const toggleAgentMode = () => {
    setIsAgentMode(prev => !prev);
  };

  return (
    <UIContext.Provider value={{ isAgentMode, toggleAgentMode }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
} 