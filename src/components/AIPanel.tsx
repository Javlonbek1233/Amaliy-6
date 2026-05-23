import React, { useState } from "react";
import { AIRecommendation, PartyMoodResult, Venue } from "../types";
import { Sparkles, Activity, MessageSquare, Flame, Check, AlertCircle, Loader2 } from "lucide-react";

interface AIPanelProps {
  venues: Venue[];
  onSelectVenueByName: (name: string) => void;
}

export default function AIPanel({ venues, onSelectVenueByName }: AIPanelProps) {
  // Tabs: "Recommend" and "Mood Detector"
  const [activeSubTab, setActiveSubTab] = useState<"recommend" | "mood">("recommend");

  // State for Recommender
  const [selectedMood, setSelectedMood] = useState("High Energy");
  const [selectedMusic, setSelectedMusic] = useState("Techno");
  const [selectedVibe, setSelectedVibe] = useState("Underground warehouse");
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [recResult, setRecResult] = useState<AIRecommendation | null>(null);

  // State for Mood Detector
  const [energyLevel, setEnergyLevel] = useState(5);
  const [activityType, setActivityType] = useState("Laser dancing");
  const [drinksSelection, setDrinksSelection] = useState("Neon mixology cocktail");
  const [socialMode, setSocialMode] = useState("VIP entourage");
  const [isLoadingMood, setIsLoadingMood] = useState(false);
  const [moodResult, setMoodResult] = useState<PartyMoodResult | null>(null);

  // Error indicators
  const [apiError, setApiError] = useState<string | null>(null);

  // Pre-configured chips for fast testing
  const moodPresets = ["Chill", "High Energy", "Sophisticated", "Wild", "Cyberpunk"];
  const musicPresets = ["Techno", "Deep House", "Synthwave", "Holographic Jazz", "Acid Electro"];
  const vibePresets = ["Underground warehouse", "Rooftop view", "Speakeasy", "Holographic Lounge"];

  const handleFetchRecommendations = async () => {
    setIsLoadingRecs(true);
    setApiError(null);
    try {
      const response = await fetch("/api/gemini/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          music: selectedMusic,
          vibe: selectedVibe
        })
      });
      if (!response.ok) {
        throw new Error("Frequency gateway response failed.");
      }
      const data = await response.json();
      setRecResult(data);
    } catch (err: any) {
      console.error(err);
      setApiError("AI Matrix link failed. Operating on internal localized databases.");
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const handleFetchPartyMood = async () => {
    setIsLoadingMood(true);
    setApiError(null);
    try {
      const response = await fetch("/api/gemini/party-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          energyLevel,
          activityType,
          drinksSelection,
          socialMode
        })
      });
      if (!response.ok) {
        throw new Error("Mood scanner sensor offline.");
      }
      const data = await response.json();
      setMoodResult(data);
    } catch (err: any) {
      console.error(err);
      setApiError("Vibe sensor arrays offline. Reverting to backup analytics.");
    } finally {
      setIsLoadingMood(false);
    }
  };

  return (
    <div className="flex flex-col border border-white/10 bg-white/5 rounded-[32px] p-6 select-none relative overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Small top accent indicator */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-fuchsia-500 to-cyan-400" />

      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
          <h3 className="font-sans text-xs uppercase tracking-widest text-white font-bold">AI Cyber Cognition</h3>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-neutral-950 p-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider relative">
          <button
            onClick={() => setActiveSubTab("recommend")}
            className={`px-4 py-1.5 transition-all rounded-full cursor-pointer ${
              activeSubTab === "recommend" 
                ? "bg-fuchsia-600 text-white font-bold shadow-md" 
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Vibe AI
          </button>
          <button
            onClick={() => setActiveSubTab("mood")}
            className={`px-4 py-1.5 transition-all rounded-full cursor-pointer ${
              activeSubTab === "mood" 
                ? "bg-fuchsia-600 text-white font-bold shadow-md" 
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Bio Scan
          </button>
        </div>
      </div>

      {apiError && (
        <div className="mb-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-2.5 font-sans text-[11px] text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div>{apiError}</div>
        </div>
      )}

      {/* 1. Recommend Vibe Tab */}
      {activeSubTab === "recommend" && (
        <div className="flex flex-col gap-5 mt-2">
          <p className="text-neutral-300 text-xs font-light leading-relaxed">
            Query the mainframe. Describe your current desires to yield customized neon recommendations.
          </p>

          {/* Matrix selectors */}
          <div className="space-y-4">
            {/* Target mood selection */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-fuchsia-400 block mb-2 font-bold">
                Current Mood State:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {moodPresets.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMood(m); setRecResult(null); }}
                    className={`px-3.5 py-1.5 rounded-full font-sans text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      selectedMood === m
                        ? "bg-fuchsia-600 text-white border border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
                        : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Music Selection */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-fuchsia-400 block mb-2 font-bold">
                Core Sound Frequency:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {musicPresets.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMusic(m); setRecResult(null); }}
                    className={`px-3.5 py-1.5 rounded-full font-sans text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      selectedMusic === m
                        ? "bg-fuchsia-600 text-white border border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
                        : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Setting Vibe selection */}
            <div>
              <label className="font-sans text-[9px] uppercase tracking-widest text-fuchsia-400 block mb-2 font-bold">
                Synthesized Atmosphere:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {vibePresets.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setSelectedVibe(v); setRecResult(null); }}
                    className={`px-3.5 py-1.5 rounded-full font-sans text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      selectedVibe === v
                        ? "bg-fuchsia-600 text-white border border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
                        : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger */}
          <button
            onClick={handleFetchRecommendations}
            disabled={isLoadingRecs}
            className={`w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 cursor-pointer font-sans text-[10px] font-bold uppercase tracking-widest text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.35)] transition-all duration-300 flex items-center justify-center gap-2`}
          >
            {isLoadingRecs ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" /> PROCESSING COGNITION GRID...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white animate-pulse" /> GENERATE RECOMMENDATIONS
              </>
            )}
          </button>

          {/* Result Block */}
          {recResult && (
            <div className="mt-2 p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden animate-fade-in font-sans">
              <span className="absolute top-0 right-0 py-1 px-3 bg-fuchsia-950 font-sans text-[8px] text-fuchsia-400 border-l border-b border-fuchsia-500/20 uppercase font-bold rounded-bl-xl">
                {recResult.usingFallback ? "PROXIED GRID" : "GEMINI ENVISIONED"}
              </span>

              <div className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-fuchsia-400 mb-2">
                {recResult.headline}
              </div>
              <p className="text-neutral-200 text-xs leading-relaxed mb-4 font-light">
                {recResult.advice}
              </p>

              {/* Exotic drink recommend */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-4">
                <div className="font-sans text-[8px] uppercase tracking-widest text-fuchsia-400 font-extrabold mb-1">
                  🍷 RECOMMENDED CYBER-MIXOLOGY:
                </div>
                <div className="text-white text-xs font-bold">{recResult.suggestedDrink}</div>
              </div>

              {/* Recommendations spots list with interactive clicking to highlight */}
              <div className="space-y-3">
                <div className="font-sans text-[8px] uppercase tracking-widest text-neutral-450 font-bold mb-1">SUGGESTED GRID COORDINATES:</div>
                {recResult.spots.map((spot, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-white/5 bg-white/5 p-3 rounded-xl gap-2 cursor-pointer hover:border-fuchsia-500/50 transition-all"
                    onClick={() => onSelectVenueByName(spot.name)}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 hover:text-fuchsia-400 transition-colors">
                        📍 {spot.name} <span className="font-mono text-[8.5px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded">{spot.sector}</span>
                      </div>
                      <p className="text-neutral-400 text-[10px] mt-1 leading-relaxed font-light">{spot.reason}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end font-sans">
                      <div className="text-fuchsia-400 font-black text-sm">{spot.matchPercentage}%</div>
                      <div className="text-[7px] text-neutral-450 uppercase tracking-widest leading-none font-bold">MATCH</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Biometric Scan Tab */}
      {activeSubTab === "mood" && (
        <div className="flex flex-col gap-5 mt-2">
          <p className="text-neutral-300 text-xs font-light leading-relaxed">
            Insert neural parameters. The tactical analyzer computes local energy fields to evaluate optimal crowd alignment.
          </p>

          <div className="space-y-4 font-sans text-[10px]">
            {/* Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 text-neutral-300 font-bold uppercase tracking-wider text-[9px]">
                <span>Neural Energy Scale:</span>
                <span className="text-rose-455 font-bold font-mono text-[10px]">{energyLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => { setEnergyLevel(Number(e.target.value)); setMoodResult(null); }}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-fuchsia-600"
              />
            </div>

            {/* Grid Selectors */}
            <div>
              <label className="uppercase tracking-widest text-[#9ca3af] block mb-1 font-bold text-[9px]">Target Chronicle Activity:</label>
              <select
                value={activityType}
                onChange={(e) => { setActivityType(e.target.value); setMoodResult(null); }}
                className="w-full bg-neutral-900 border border-white/15 text-neutral-200 p-2.5 rounded-full focus:outline-none focus:border-fuchsia-500 text-xs font-sans tracking-wide"
              >
                <option value="Electro Sync Laser Dancing">Electro Sync Laser Dancing</option>
                <option value="Underground Cryptic Rumors">Underground Cryptic Rumors</option>
                <option value="Exotic Synthesizer Lounge Listening">Exotic Synthesizer Lounge Listening</option>
                <option value="Hi-Tech Retro Gaming Grind">Hi-Tech Retro Gaming Grind</option>
              </select>
            </div>

            <div>
              <label className="uppercase tracking-widest text-[#9ca3af] block mb-1 font-bold text-[9px]">Liquid Fuel Signature:</label>
              <select
                value={drinksSelection}
                onChange={(e) => { setDrinksSelection(e.target.value); setMoodResult(null); }}
                className="w-full bg-neutral-900 border border-white/15 text-neutral-200 p-2.5 rounded-full focus:outline-none focus:border-fuchsia-500 text-xs font-sans tracking-wide"
              >
                <option value="Activated charcoal glowing sake">Activated charcoal glowing sake</option>
                <option value="High-velocity carbonated dry ice absinthe">High-velocity carbonated dry ice absinthe</option>
                <option value="Chilled zero-gravity synthesised tonic">Chilled zero-gravity synthesised tonic</option>
                <option value="Raw synthetic caffeine energy shot">Raw synthetic caffeine energy shot</option>
              </select>
            </div>

            <div>
              <label className="uppercase tracking-widest text-[#9ca3af] block mb-1 font-bold text-[9px]">Social Alignment Matrix:</label>
              <select
                value={socialMode}
                onChange={(e) => { setSocialMode(e.target.value); setMoodResult(null); }}
                className="w-full bg-neutral-900 border border-white/15 text-neutral-200 p-2.5 rounded-full focus:outline-none focus:border-fuchsia-500 text-xs font-sans tracking-wide"
              >
                <option value="VIP Elite Entourage">VIP Elite Entourage</option>
                <option value="Silent Cybernetic Shadow Nomad">Silent Cybernetic Shadow Nomad</option>
                <option value="Duo Sync Infiltrators">Duo Sync Infiltrators</option>
                <option value="Massive Guild Alliance Core">Massive Guild Alliance Core</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleFetchPartyMood}
            disabled={isLoadingMood}
            className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 font-sans text-[10px] font-bold uppercase tracking-widest text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.35)] transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoadingMood ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" /> DECODING BIOMETRICS ENERGY INDEX...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-white animate-pulse" /> START BIOMETRIC MOOD SCAN
              </>
            )}
          </button>

          {/* Results panel */}
          {moodResult && (
            <div className="mt-2 p-5 border border-white/10 bg-white/5 rounded-2xl relative overflow-hidden animate-fade-in font-sans">
              <span className="absolute top-0 right-0 py-1 px-3 bg-fuchsia-950 font-sans text-[8px] text-fuchsia-400 border-l border-b border-fuchsia-500/20 uppercase font-bold rounded-bl-xl">
                BIOMETRIC DECODER V1
              </span>

              {/* Big Score indicator */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" className="stroke-white/5 fill-none" strokeWidth="4" />
                    <circle 
                      cx="32" cy="32" r="28" 
                      className="stroke-fuchsia-500 fill-none transition-all duration-1000" 
                      strokeWidth="4" 
                      strokeDasharray={2 * Math.PI * 28} 
                      strokeDashoffset={2 * Math.PI * 28 * (1 - moodResult.score / 100)} 
                    />
                  </svg>
                  <span className="absolute font-sans text-white text-[14px] font-extrabold">{moodResult.score}%</span>
                </div>

                <div>
                  <div className="font-sans text-[8.5px] uppercase tracking-widest text-neutral-400 leading-none mb-1 font-bold">ENERGY PROFILE</div>
                  <div className="text-sm font-bold text-fuchsia-400 flex items-center gap-1">
                    <Flame className="w-4 h-4 text-fuchsia-400 animate-bounce" /> {moodResult.moodLabel}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <p className="text-neutral-200 font-light">{moodResult.commentary}</p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="font-sans text-[8px] uppercase text-fuchsia-400 tracking-widest font-extrabold">🎯 HIGHLY ENVISIONED PROTOCOL:</div>
                  <div className="text-neutral-100 mt-1 font-bold text-xs">{moodResult.recommendedActivity}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
