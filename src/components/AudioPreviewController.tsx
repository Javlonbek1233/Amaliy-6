import React, { useState, useEffect } from "react";
import { Venue } from "../types";
import { playCyberpunkLoop, stopCyberpunkLoop } from "../utils/audioSynth";
import { Volume2, VolumeX, Radio, Music } from "lucide-react";

interface AudioPreviewControllerProps {
  activeVenue: Venue | null;
}

export default function AudioPreviewController({ activeVenue }: AudioPreviewControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [eqHeights, setEqHeights] = useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10]);

  // Turn off loop if venue changes
  useEffect(() => {
    if (isPlaying) {
      stopCyberpunkLoop();
      setIsPlaying(false);
    }
    return () => {
      stopCyberpunkLoop();
    };
  }, [activeVenue]);

  // Handle playing audio loop and animating equalizers
  useEffect(() => {
    let eqInterval: any;

    if (isPlaying && activeVenue) {
      const theme = activeVenue.synthTheme;
      // Start the synthesizer!
      playCyberpunkLoop(theme.type, theme.tempo, theme.baseFreq);

      // Animate equalizer bars in sync with tempos
      const intervalMs = Math.round(60000 / theme.tempo / 4); // Speed is linked to tempo!
      eqInterval = setInterval(() => {
        setEqHeights(() => 
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 15)
        );
      }, intervalMs);
    } else {
      stopCyberpunkLoop();
      setEqHeights([10, 10, 10, 10, 10, 10, 10, 10]);
    }

    return () => {
      if (eqInterval) clearInterval(eqInterval);
    };
  }, [isPlaying, activeVenue]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  if (!activeVenue) {
    return (
      <div id="audio-placeholder" className="flex items-center justify-center h-28 bg-white/5 border border-white/10 rounded-[24px] select-none backdrop-blur-md">
        <p className="font-sans text-neutral-400 text-[10px] text-center px-4 uppercase tracking-widest font-bold">
          ⚡ Select a venue to load sound preview
        </p>
      </div>
    );
  }

  return (
    <div id="audio-controller-panel" className="flex flex-col gap-3.5 p-5 bg-white/5 border border-white/10 rounded-[28px] relative overflow-hidden group backdrop-blur-lg">
      {/* Light glow behind console */}
      <span className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400">
            {isPlaying ? (
              <Radio className="w-4 h-4 animate-pulse text-fuchsia-400" />
            ) : (
              <Music className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="font-sans text-[8px] uppercase tracking-widest text-fuchsia-450 font-extrabold">Audio Preview Engine</div>
            <h4 className="font-sans font-bold text-xs text-white truncate max-w-[200px]">{activeVenue.name} PREVIEW</h4>
          </div>
        </div>

        {/* Big Neon Trigger Button */}
        <button
          onClick={togglePlayback}
          className={`px-4 py-2.5 rounded-full font-sans text-[9px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
            isPlaying
              ? "bg-fuchsia-600 border-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.55)] animate-pulse"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white"
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5" /> Stop Preview
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" /> Play Preview
            </>
          )}
        </button>
      </div>

      {/* Futuristic Visualizer Screen */}
      <div className="h-16 bg-neutral-950 border border-white/5 rounded-2xl relative overflow-hidden flex items-end justify-center px-4 pb-2 select-none gap-2">
        
        {/* Equalizer Wavebars */}
        {eqHeights.map((height, idx) => (
          <div
            key={idx}
            style={{ height: `${height}%` }}
            className={`w-3 rounded-t-full transition-all duration-150 ${
              isPlaying
                ? "bg-gradient-to-t from-fuchsia-600 via-pink-500 to-cyan-400 shadow-[0_0_8px_rgba(236,72,153,0.3)]"
                : "bg-neutral-800"
            }`}
          />
        ))}

        {/* Wave pattern specifications metadata */}
        <div className="absolute top-2 left-3 font-sans text-[8px] text-neutral-500 flex gap-4 uppercase select-none font-medium">
          <span>OSC: {activeVenue.synthTheme.type}</span>
          <span>BPM: {activeVenue.synthTheme.tempo}</span>
          <span>FRQ: {activeVenue.synthTheme.baseFreq}Hz</span>
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
            <span className="font-sans text-neutral-500 text-[9px] uppercase tracking-widest leading-none font-bold">
              Feed Offline: Oscillators Offline
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
