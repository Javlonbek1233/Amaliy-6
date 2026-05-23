import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { Venue } from "../types";
import { MapPin, Info, Compass, ShieldCheck, Terminal, HelpCircle } from "lucide-react";

interface MapContainerProps {
  venues: Venue[];
  activeVenue: Venue | null;
  onSelectVenue: (venue: Venue) => void;
  crowdMetrics: { [venueId: string]: { value: number; trend: string } };
}

// Check for valid API Key safely as outlined in google-maps-platform SKILL.md
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY !== "MY_GOOGLE_MAPS_PLATFORM_KEY";

export default function MapContainer({ venues, activeVenue, onSelectVenue, crowdMetrics }: MapContainerProps) {
  const [useMockMap, setUseMockMap] = useState(!hasValidKey);
  const [radarRotatingDeg, setRadarRotatingDeg] = useState(0);

  // Rotate simulated radar sweeps for cyberpunk interface effects
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setRadarRotatingDeg((prev) => (prev + 0.8) % 360);
      animationFrame = requestAnimationFrame(animate);
    };
    if (useMockMap) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [useMockMap]);

  // Center coordinate of San Francisco nightlife action
  const defaultCenter = { lat: 37.7845, lng: -122.4150 };

  // Render authentic Google Map with Markers
  const renderGoogleMap = () => (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="relative w-full h-[380px] md:h-[500px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          colorScheme="DARK"
          gestureHandling="cooperative"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: "100%", height: "100%" }}
        >
          {venues.map((venue) => {
            const crowd = crowdMetrics[venue.id]?.value || 70;
            const isActive = activeVenue?.id === venue.id;

            return (
              <AdvancedMarker
                key={venue.id}
                position={venue.coordinates}
                onClick={() => onSelectVenue(venue)}
                title={venue.name}
              >
                <div className={`relative flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-125 z-50' : 'scale-100'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-lg cursor-pointer ${
                    isActive 
                      ? 'bg-fuchsia-950 border-fuchsia-500 animate-pulse text-white' 
                      : 'bg-black border-white/20 text-neutral-300 hover:border-fuchsia-400'
                  }`}>
                    <span className="text-sm font-bold block leading-none">{venue.avatar}</span>
                  </div>
                  {/* Miniature text label for quick scanning */}
                  <div className={`px-2 py-0.5 mt-1.5 rounded-full text-[9px] font-sans tracking-tight whitespace-nowrap bg-neutral-950/95 border ${
                    isActive ? 'border-fuchsia-500 text-fuchsia-400' : 'border-white/5 text-neutral-400'
                  }`}>
                    {venue.name.split(" ")[0]} ({crowd}%)
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
        
        {/* Real-time Indicator Overlay */}
        <div className="absolute bottom-4 left-4 bg-neutral-950/95 border border-white/10 text-[9px] text-fuchsia-400 px-3 py-1.5 rounded-full font-sans tracking-wider uppercase font-bold">
          🎛️ Google Maps V2 Live
        </div>
      </div>
    </APIProvider>
  );

  // Render extremely stylized, interactive sci-fi tactical radar map fallback
  const renderInteractiveRadarMap = () => {
    // We can map coordinates relative to a styled 100% grid canvas box
    // SF Coordinates limits: Lat (37.7500 to 37.8100), Lng (-122.4500 to -122.4000)
    const latMin = 37.7550;
    const latMax = 37.8080;
    const lngMin = -122.4450;
    const lngMax = -122.3980;

    const getRelativeCoords = (lat: number, lng: number) => {
      const top = 100 - ((lat - latMin) / (latMax - latMin)) * 100;
      const left = ((lng - lngMin) / (lngMax - lngMin)) * 100;
      return { top: `${Math.max(10, Math.min(90, top))}%`, left: `${Math.max(10, Math.min(90, left))}%` };
    };

    return (
      <div className="relative w-full h-[380px] md:h-[500px] bg-neutral-950 rounded-[32px] overflow-hidden border border-white/10 select-none shadow-2xl shadow-black/80">
        {/* Futuristic Laser grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.03)_1px,transparent_1px)] bg-[size:35px_35px]" />
        
        {/* Animated radar concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[85%] h-[85%] rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-[65%] h-[65%] rounded-full border border-fuchsia-500/5 flex items-center justify-center">
              <div className="w-[40%] h-[40%] rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-pulse bg-fuchsia-500/20 core-point animate-ping" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Sweeper line */}
        <div 
          className="absolute origin-center w-full h-full pointer-events-none"
          style={{
            transform: `rotate(${radarRotatingDeg}deg)`,
            background: "conic-gradient(from 0deg, rgba(217,70,239,0.12) 0deg, rgba(6,182,212,0.01) 60deg, transparent 90deg)"
          }}
        />

        {/* Compass Crosshair */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 pointer-events-none" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/5 pointer-events-none" />

        {/* Cyber Interactive Venue Nodes */}
        {venues.map((venue) => {
          const { top, left } = getRelativeCoords(venue.coordinates.lat, venue.coordinates.lng);
          const crowd = crowdMetrics[venue.id]?.value || 70;
          const isActive = activeVenue?.id === venue.id;

          return (
            <button
              key={venue.id}
              onClick={() => onSelectVenue(venue)}
              style={{ top, left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center z-10 hover:z-30 cursor-pointer focus:outline-none`}
            >
              <div className="relative">
                {/* Glowing ring */}
                <span className={`absolute -inset-2.5 rounded-full blur-sm transition-all duration-300 ${
                  isActive ? "bg-magenta-500/40 animate-pulse scale-125" : "bg-black/80"
                }`} />
                
                {/* Node icon */}
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isActive
                    ? "bg-purple-800 border-pink-500 shadow-[0_0_12px_#ec4899] scale-110"
                    : "bg-black/90 border-cyan-500 hover:border-pink-400 shadow-[0_0_8px_rgba(6,182,212,0.3)] hover:scale-105"
                }`}>
                  <span className="text-sm">{venue.avatar}</span>
                </div>

                {/* Live wave ripple effect */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-full border border-pink-500 animate-ping opacity-60" />
                )}
              </div>

              {/* Minimalist Info Popup */}
              <div className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all duration-300 whitespace-nowrap border ${
                isActive 
                  ? "bg-purple-950/90 text-purple-300 border-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.3)]" 
                  : "bg-black/90 text-zinc-400 border-zinc-800 group-hover:text-cyan-300 group-hover:border-cyan-400"
              }`}>
                {venue.name.split(" ")[0]} ({crowd}%)
              </div>
            </button>
          );
        })}

        {/* Tactical Coordinates HUD overlay */}
        <div className="absolute top-4 left-4 flex flex-col bg-neutral-950/90 border border-white/5 p-3 rounded-2xl font-mono text-[8px] text-fuchsia-400 leading-tight select-none">
          <div>RADAR SCAN LEVEL: ACTIVE 240Hz</div>
          <div>CROWD MATRIX: INTEGRATED</div>
          <div>SYS STATUS: SECURE</div>
        </div>

        {/* Selected Venue HUD */}
        {activeVenue && (
          <div className="absolute bottom-4 right-4 bg-neutral-950/90 border border-white/10 p-4 rounded-2xl max-w-[200px] font-sans text-xs text-neutral-300 shadow-xl animate-fade-in font-light">
            <div className="text-fuchsia-450 font-bold border-b border-white/10 pb-1.5 mb-1.5 tracking-wider text-[10px] uppercase">
              Target Acquired
            </div>
            <div className="truncate text-white font-bold">{activeVenue.name}</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">{activeVenue.sector}</div>
            <div className="text-[10px] text-neutral-300 mt-1">Vibe: <span className="text-cyan-400 font-medium">{activeVenue.vibe}</span></div>
            <div className="text-fuchsia-400 mt-1.5 font-bold text-[11px]">
              Live Capacity: {crowdMetrics[activeVenue.id]?.value || 70}%
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-neutral-950/95 border border-white/5 text-[8px] text-cyan-400 px-2.5 py-1.5 rounded-full font-sans uppercase tracking-widest font-bold">
          🛰️ Sci-Fi Radar Active
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Map Control Board */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-white/10 bg-white/5 p-4 rounded-[24px] gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-fuchsia-400 animate-spin" style={{ animationDuration: "12s" }} />
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-white font-bold">Tactical Harbor Sector Map</h3>
            <p className="text-[#a3a3a3] text-[10px] sm:text-[11px] font-light leading-snug">Toggle map interface engine between Google Maps & immersive Sci-Fi Radar</p>
          </div>
        </div>
        
        {/* Toggle Button */}
        <div className="flex bg-neutral-950 p-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider">
          <button
            onClick={() => setUseMockMap(true)}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              useMockMap 
                ? "bg-fuchsia-600 text-white shadow-md font-bold" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sci-Fi Radar
          </button>
          
          <button
            onClick={() => {
              if (!hasValidKey) {
                alert("Google Maps Platform API Key is required. Please check instructions on how to add the key in Secrets.");
              } else {
                setUseMockMap(false);
              }
            }}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              !useMockMap 
                ? "bg-fuchsia-600 text-white shadow-md font-bold" 
                : "text-zinc-400 hover:text-white"
            } ${!hasValidKey ? 'opacity-50' : ''}`}
          >
            Google Maps {!hasValidKey && "🔒"}
          </button>
        </div>
      </div>

      {useMockMap ? renderInteractiveRadarMap() : renderGoogleMap()}

      {/* API Key Instructions Drawer */}
      <div className="border border-white/10 bg-white/5 rounded-[24px] p-5 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
          <div className="text-neutral-350 font-sans text-xs space-y-2 leading-relaxed font-light">
            <span className="text-fuchsia-400 font-bold tracking-widest uppercase block text-[10px]">⚙️ CONNECT REAL GOOGLE MAPS API KEY (OPTIONAL):</span>
            <p className="text-[#a3a3a3] text-[11px]">
              Want actual interactive satellite layouts for these SF spots? Connect your valid key to verify full-fidelity map compilation. Since AIS properties bind at compilation phase, following these instructions triggers auto-rebuild:
            </p>
            <div className="bg-[#09090f]/60 p-3.5 rounded-2xl border border-white/5 space-y-1.5 text-neutral-400 text-[10px] font-sans font-light">
              <div>1. Obtain your API Key from Google Maps Platform Console.</div>
              <div>2. Click <span className="text-white font-bold">Settings ⚙️ (top-right gear)</span> → <span className="text-fuchsia-450 font-bold">Secrets</span> in AI Studio UI.</div>
              <div>3. Add Secret Name strictly as <code className="text-fuchsia-450 bg-fuchsia-950/30 px-1.5 py-0.5 rounded text-[9px] font-mono">GOOGLE_MAPS_PLATFORM_KEY</code>.</div>
              <div>4. Paste your key in value, hit Enter, and wait for the live hot container to rebuild.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
