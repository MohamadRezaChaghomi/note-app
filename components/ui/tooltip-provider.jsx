// components/ui/tooltip-provider.jsx
"use client";

import { createContext, useContext, useState } from "react";

const TooltipContext = createContext({});

export function TooltipProvider({ 
  children, 
  delayDuration = 200, 
  skipDelayDuration = 300,
  disableHoverableContent = false,
  ...props 
}) {
  const [tooltips, setTooltips] = useState({});
  
  const registerTooltip = (id) => {
    setTooltips(prev => ({ ...prev, [id]: { open: false } }));
  };
  
  const unregisterTooltip = (id) => {
    setTooltips(prev => {
      const newTooltips = { ...prev };
      delete newTooltips[id];
      return newTooltips;
    });
  };
  
  const openTooltip = (id) => {
    setTooltips(prev => ({ ...prev, [id]: { ...prev[id], open: true } }));
  };
  
  const closeTooltip = (id) => {
    setTooltips(prev => ({ ...prev, [id]: { ...prev[id], open: false } }));
  };
  
  const value = {
    tooltips,
    registerTooltip,
    unregisterTooltip,
    openTooltip,
    closeTooltip,
    delayDuration,
    skipDelayDuration,
    disableHoverableContent
  };

  return (
    <TooltipContext.Provider value={value}>
      <div className="tooltip-provider" {...props}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
}