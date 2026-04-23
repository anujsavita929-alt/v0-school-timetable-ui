'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface TransitionContextType {
  triggerTransition: (href: string, e: React.MouseEvent) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error('useTransition must be used within a TransitionProvider');
  return context;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wipePos, setWipePos] = useState({ x: '50%', y: '50%' });
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const triggerTransition = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    setWipePos({ x: `${x}px`, y: `${y}px` });
    setIsTransitioning(true);

    // After animation, navigate
    setTimeout(() => {
      router.push(href);
      // Fading out the overlay after a small delay to ensure page loaded
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 800);
  };

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      {isTransitioning && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none bg-[#0A0A0F]"
          style={{
            clipPath: `circle(0% at ${wipePos.x} ${wipePos.y})`,
            animation: 'radial-wipe 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            '--wipe-x': wipePos.x,
            '--wipe-y': wipePos.y,
          } as React.CSSProperties}
        />
      )}
    </TransitionContext.Provider>
  );
}
