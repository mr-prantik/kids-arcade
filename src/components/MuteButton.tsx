"use client";

import React from "react";
import { Volume, VolumeX } from "lucide-react";
import { useSound } from "@/providers/SoundProvider";

export default function MuteButton() {
  const { muted, toggleMute } = useSound();

  return (
    <button
      aria-label={muted ? "Unmute" : "Mute"}
      onClick={toggleMute}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-md backdrop-blur hover:scale-105 active:scale-95"
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
    </button>
  );
}
