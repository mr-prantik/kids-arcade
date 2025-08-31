"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import  Howl  from "howler";

type SoundContextType = {
  muted: boolean;
  toggleMute: () => void;
  playSound: (src: string) => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => setMuted((m) => !m);

  const playSound = (src: string) => {
    if (muted) return;
    const sound = new Howl({
      src: [src],
      volume: 0.7,
    });
    sound.play();
  };

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used inside SoundProvider");
  }
  return ctx;
}
