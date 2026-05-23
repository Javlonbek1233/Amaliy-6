import React, { useState, useEffect } from "react";
import { Venue, LiveEvent, VIPPackage } from "./types";
import { VENUES, EVENTS } from "./data";
import MapContainer from "./components/MapContainer";
import AudioPreviewController from "./components/AudioPreviewController";
import AIPanel from "./components/AIPanel";
import ReservationModal from "./components/ReservationModal";
import VipSection from "./components/VipSection";
import { 
  Flame, 
  MapPin, 
  Sparkles, 
  Users, 
  Layers, 
  TrendingUp, 
  SlidersHorizontal,
  Calendar, 
  Tv, 
  User, 
  Check, 
  ShieldCheck, 
  Music, 
  Volume2, 
  Search,
  BookOpen,
  Terminal,
  Share2
} from "lucide-react";

export default function App() {
  // Venue State
  const [venues, setVenues] = useState<Venue[]>(VENUES);
  const [activeVenue, setActiveVenue] = useState<Venue | null>(VENUES[0]);
  
  // Dynamic Crowd Level metrics from backend
  const [crowdMetrics, setCrowdMetrics] = useState<{
    [venueId: string]: { value: number; trend: "rising" | "stable" | "falling"; energy: number };
  }>({});

  // Active Map Filter
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingOnly, setTrendingOnly] = useState(false);

  // VIP Package Bookings trigger
  const [customSelectedPackage, setCustomSelectedPackage] = useState<VIPPackage | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  // Live Reservations Log collected from Express API during this session
  const [reservationsLedger, setReservationsLedger] = useState<any[]>([]);

  // Periodically fetch real-time crowd metric updates to simulate pulsing nightclub waves
  const fetchCrowdMetrics = async () => {
    try {
      const response = await fetch("/api/crowd");
      if (response.ok) {
        const data = await response.json();
        setCrowdMetrics(data.sensors);
      }
    } catch (err) {
      console.warn("Could not reach real-time crowd sensory grid. Reverting to local state.");
      // Set baseline values if offline
      const baseline: any = {};
      VENUES.forEach(v => {
        baseline[v.id] = { value: v.id === "velocity" ? 92 : 64, trend: "stable", energy: 80 };
      });
      setCrowdMetrics(baseline);
    }
  };

  // Periodically load bookings from backend to keep synchronised
  const fetchBookingsLedger = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setReservationsLedger(data);
      }
    } catch (err) {
      console.warn("Could not sync with ledger endpoints.");
    }
  };

  useEffect(() => {
    fetchCrowdMetrics();
    fetchBookingsLedger();
    
    // Pulse-frequency loop for live sensory levels
    const crowdInterval = setInterval(fetchCrowdMetrics, 14000);
    return () => clearInterval(crowdInterval);
  }, []);

  // Filter venues mathematically
  const filteredVenues = venues.filter(venue => {
    const matchesFilterType = selectedTypeFilter === "All" || venue.type === selectedTypeFilter;
    const matchesQuery = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.musicType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrending = !trendingOnly || venue.isTrending;
    return matchesFilterType && matchesQuery && matchesTrending;
  });

  // Handle focusing a venue when selecting from sidebar or map
  const handleSelectVenue = (venue: Venue) => {
    setActiveVenue(venue);
  };

  // Connect AI recommends clicks to snap-focus map venues if named
  const handleSelectVenueByName = (name: string) => {
    const matched = venues.find(v => v.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(v.name.toLowerCase().split(" ")[0]));
    if (matched) {
      handleSelectVenue(matched);
      // Smooth scroll to target Map
      const el = document.getElementById("cyber-map-board");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Launch modal preloaded with specific package
  const handleSelectVipPackage = (pkg: VIPPackage) => {
    setCustomSelectedPackage(pkg);
    setIsReservationOpen(true);
  };

  // Handle reserving normal ticket
  const handleBookStandardPass = () => {
    setCustomSelectedPackage(null);
    setIsReservationOpen(true);
  };

  const handleBookingSuccessCallback = (newBooking: any) => {
    setReservationsLedger(prev => [newBooking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-sans relative selection:bg-fuchsia-500 selection:text-white">
      {/* Background Neon Glows from Editorial Aesthetic template */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-fuchsia-600 rounded-full blur-[140px] opacity-[0.15] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] bg-cyan-500 rounded-full blur-[160px] opacity-[0.15] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-violet-600 rounded-full blur-[130px] opacity-[0.08] pointer-events-none" />

      {/* Editorial Aesthetic Top Navigation Bar */}
      <header className="border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-40 px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tighter italic text-white select-none">
            NIGHTLIFE<span className="text-fuchsia-500">.</span>
          </span>
          <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest font-bold text-neutral-400">
            <span className="text-white border-b border-fuchsia-500 pb-1 cursor-default">Discovery</span>
            <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => {
              const el = document.getElementById("cyber-map-board");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}>Live Maps</span>
            <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => {
              const el = document.getElementById("vip-packages-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}>VIP Access</span>
            <span className="text-neutral-400 hover:text-white transition-colors cursor-default">Artists</span>
          </div>
        </div>

        {/* Global Stats HUD Area from Editorial template */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 font-sans text-[10px] uppercase font-bold tracking-tight text-white/95 shadow-inner">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Live: 1,429 Online</span>
          </div>
          <button 
            onClick={handleBookStandardPass}
            className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] cursor-pointer"
          >
            Reserve Table
          </button>
        </div>
      </header>

      {/* Primary Grid Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-10 flex flex-col gap-10 z-10">
        
        {/* Intro Banner: Hand crafted editorial glassmorphic structure */}
        <div className="relative bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[40px] p-8 md:p-12 overflow-hidden group select-none backdrop-blur-xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253344-f814d074358a?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="px-3.5 py-1 bg-fuchsia-600 text-[10px] font-bold uppercase tracking-widest rounded-full inline-block">
              Trending Tonight
            </span>
            <h1 className="font-sans font-black italic tracking-tighter uppercase leading-none text-4xl md:text-7xl text-white">
              Electronic <br /> Elysium<span className="text-fuchsia-500">.</span>
            </h1>
            <p className="text-neutral-300 text-xs md:text-sm leading-relaxed font-light max-w-2xl">
              Decode the harbor&apos;s most immersive dense frequencies. Explore premium underground bunkers, elite glass sky lounges, and hidden speakeasies. Custom synthetic music loops and AI diagnostics yield unprecedented nightlife intelligence.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] font-sans">
              <div className="flex items-center gap-2">
                <span className="uppercase font-bold text-neutral-400">DJ Schedule</span>
                <span className="font-medium text-white">Solomun • 02:00 AM</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="uppercase font-bold text-neutral-400">VIP Passes</span>
                <span className="font-medium text-cyan-400">Available Tonight</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT STRIP: Stations Search, filter controls & Venue ListCards (Column Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Search and Filter Board in Premium Glassmorphic Styling */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 space-y-5 shadow-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by music, district, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder-neutral-400 text-xs py-3 pl-11 pr-12 rounded-full focus:outline-none focus:border-fuchsia-400 focus:bg-white/10 transition-all font-sans font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Badges strip filter */}
              <div className="flex flex-col gap-3 font-sans text-[10px]">
                <div className="flex items-center justify-between text-neutral-400 font-bold uppercase tracking-widest text-[9px]">
                  <span>Atmosphere Matrix Type</span>
                  <button 
                    onClick={() => {
                      setSelectedTypeFilter("All");
                      setTrendingOnly(false);
                      setSearchQuery("");
                    }}
                    className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors uppercase font-bold"
                  >
                    Reset Grid
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["All", "Club", "Bar", "Lounge", "Warehouse"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTypeFilter(t)}
                      className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider text-[9px] transition-all duration-300 cursor-pointer ${
                        selectedTypeFilter === t
                          ? "bg-fuchsia-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.3)] border border-fuchsia-500"
                          : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
                      }`}
                    >
                      {t === "All" ? "🌌 All" : t}
                    </button>
                  ))}
                  
                  {/* Trending Badge Toggle */}
                  <button
                    onClick={() => setTrendingOnly(!trendingOnly)}
                    className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider text-[9px] transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                      trendingOnly 
                        ? "bg-cyan-600 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]" 
                        : "bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Trending Now
                  </button>
                </div>
              </div>
            </div>

            {/* List Header */}
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500 uppercase tracking-widest px-1">
              <span>ACTIVE LOCATIONS ({filteredVenues.length})</span>
              <span>LIVE CROWD DENSITY</span>
            </div>

            {/* Vertical Venues scrollbox */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2 custom-scroll scrollbar-none">
              {filteredVenues.length === 0 ? (
                <div className="text-center py-12 border border-zinc-900 bg-zinc-950/45 rounded-2xl">
                  <p className="font-mono text-zinc-500 text-xs uppercase tracking-wider">No matching sectors found in grid.</p>
                </div>
              ) : (
                filteredVenues.map((venue) => {
                  const crowd = crowdMetrics[venue.id]?.value || 70;
                  const trend = crowdMetrics[venue.id]?.trend || "stable";
                  const isActive = activeVenue?.id === venue.id;

                  // Evaluate border colors based on specific location active status
                  return (
                    <div
                      key={venue.id}
                      onClick={() => handleSelectVenue(venue)}
                      className={`group p-4 bg-white/5 rounded-2xl border transition-all duration-300 cursor-pointer select-none relative overflow-hidden backdrop-blur-md ${
                        isActive 
                          ? "border-fuchsia-500/80 bg-white/10 shadow-[0_0_20px_rgba(217,70,239,0.15)]"
                          : "border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      {/* Internal absolute indicators */}
                      {venue.isTrending && (
                        <span className="absolute top-0 right-0 bg-fuchsia-600 text-[8px] font-sans font-bold text-white px-2.5 py-0.5 rounded-bl uppercase tracking-widest animate-pulse">
                          TRENDING
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shadow-inner">
                            {venue.avatar}
                          </div>
                          <div>
                            <h3 className="font-sans font-bold text-[13px] text-white leading-snug group-hover:text-fuchsia-400 transition-colors">
                              {venue.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-1 uppercase tracking-tight">
                              <MapPin className="w-3 h-3 text-fuchsia-500 shrink-0" />
                              <span>{venue.sector}</span>
                            </div>
                          </div>
                        </div>

                        {/* Real-time crowd percentage widget info */}
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 font-sans text-xs font-bold text-white">
                            <Users className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                            <span>{crowd}% Capacity</span>
                          </div>
                          <span className={`font-mono text-[8px] uppercase tracking-wider ${
                            trend === "rising" ? "text-fuchsia-400 font-bold" : trend === "falling" ? "text-cyan-400" : "text-neutral-500"
                          }`}>
                            {trend === "rising" ? "▲ INFLOWING" : trend === "falling" ? "▼ OUTFLOWING" : "■ STEADY STATE"}
                          </span>
                        </div>
                      </div>

                      {/* Brief details shown on active card */}
                      {isActive && (
                        <div className="mt-3.5 pt-3.5 border-t border-white/10 flex justify-between items-center text-[10px] font-sans text-neutral-300 gap-2 animate-fade-in uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Artist:</span>
                            <span className="text-white font-bold font-mono">{venue.djTonight}</span>
                          </div>
                          <div className="text-fuchsia-400 font-bold group-hover:text-fuchsia-300 transition-colors">
                            SPEC &amp; COVER &rarr;
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Live Events Section inside sidebar */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-[#ffffff] font-bold">Live Tonight Grid Events</h3>
              </div>

              <div className="space-y-3 font-sans">
                {EVENTS.map((evt) => (
                  <div key={evt.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <h4 className="font-bold text-xs text-white leading-tight">{evt.title}</h4>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{evt.venueName}</div>
                      </div>
                      <span className="text-[9px] font-sans font-bold text-neutral-200 border border-white/15 px-2 py-0.5 rounded-full uppercase">
                        {evt.price}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-sans">
                      <div className="text-fuchsia-400 font-medium font-mono">STARTS: {evt.time.split(",")[1] || evt.time}</div>
                      <span className={`px-2 py-0.5 rounded-full uppercase text-[8px] font-bold ${
                        evt.status === "VIP Exclusive" ? "bg-fuchsia-950 text-fuchsia-450 border border-fuchsia-500/30" : "bg-cyan-950 text-cyan-455"
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT STRIP: Map, Music Preview controls, VIP and AI modules (Column Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* 1. Tactical Interactive Map board */}
            <div id="cyber-map-board" className="scroll-mt-24">
              <MapContainer 
                venues={venues} 
                activeVenue={activeVenue} 
                onSelectVenue={handleSelectVenue}
                crowdMetrics={crowdMetrics}
              />
            </div>

            {/* 2. Deep Active Venue Information Sheet */}
            {activeVenue ? (
              <div className="border border-white/10 bg-white/5 rounded-[32px] p-6 select-none relative overflow-hidden flex flex-col gap-6 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[90px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-widest text-fuchsia-400 font-bold">Venue Profile Spec</span>
                    <h2 className="font-sans font-black italic text-2xl text-white mt-1 uppercase tracking-tight">{activeVenue.name}</h2>
                    <p className="text-neutral-300 text-xs mt-2 leading-relaxed max-w-lg font-light">{activeVenue.description}</p>
                  </div>
                  
                  {/* Reserve pass now */}
                  <div className="shrink-0">
                    <button
                      onClick={handleBookStandardPass}
                      className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 cursor-pointer font-sans text-[10px] font-bold tracking-widest uppercase text-white rounded-full shadow-[0_0_20px_rgba(217,70,239,0.35)] transition-all duration-300 hover:scale-[1.02]"
                    >
                      🎟️ BOOK PASS
                    </button>
                    <div className="text-[9px] font-sans font-bold text-right text-neutral-400 mt-1.5 uppercase">COVER: {activeVenue.coverCharge.split("(")[0]}</div>
                  </div>
                </div>

                {/* Sub features: DJ Schedules Tonight & Current Event in focus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* DJ timetables list */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
                    <div className="font-sans text-[10px] uppercase tracking-wider text-fuchsia-400 font-extrabold border-b border-white/10 pb-2 mb-1 flex items-center justify-between">
                      <span>🎧 DJ Timetable Tonight</span>
                      <span className="text-neutral-400 font-mono tracking-tight font-normal">SEC-7</span>
                    </div>
                    <div className="space-y-3">
                      {activeVenue.djSchedule.map((sch, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="font-mono text-neutral-450 text-[10px]">{sch.time}</span>
                          <span className={`font-sans font-bold ${activeVenue.djTonight === sch.artist ? "text-fuchsia-400 animate-pulse" : "text-neutral-200"}`}>
                            {sch.artist}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Details (Specs, drinks, ratings) */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
                    <div className="font-sans text-[10px] uppercase tracking-wider text-cyan-400 font-extrabold border-b border-white/10 pb-2 mb-1">
                      ⚙️ Atmosphere Metadata Spec
                    </div>
                    <div className="space-y-2 text-xs text-neutral-300 font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-450 text-[11px]">Frequency Alignment:</span>
                        <span className="text-white font-mono text-[11px] font-bold">{activeVenue.musicType.split("/")[0]}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-450 text-[11px]">Rating Index:</span>
                        <span className="text-emerald-400 font-bold font-sans">⭐ {activeVenue.rating} / 5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-450 text-[11px]">Cover Status:</span>
                        <span className="text-neutral-200 text-[10.5px] max-w-[150px] truncate block text-right font-medium">{activeVenue.coverCharge}</span>
                      </div>
                      <div className="flex justify-between items-center text-fuchsia-400">
                        <span className="text-neutral-450 text-[11px]">Signature Elixir:</span>
                        <span className="font-bold text-[11px] text-fuchsia-400">{activeVenue.signatureDrink}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Audio preview loop inside selected venue console */}
                <AudioPreviewController activeVenue={activeVenue} />

              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/20 bg-white/5 rounded-[32px]">
                <p className="font-sans text-neutral-400 text-xs uppercase font-medium">No active sector focused. Select item from map or list.</p>
              </div>
            )}

            {/* 3. VIP packages options */}
            <VipSection 
              onSelectPackage={handleSelectVipPackage} 
              activeVenue={activeVenue} 
            />

            {/* 4. Cognitive intelligence recommendations center */}
            <AIPanel 
              venues={venues} 
              onSelectVenueByName={handleSelectVenueByName} 
            />

          </div>
        </div>

        {/* Live Booking terminal history tracker panel */}
        {reservationsLedger.length > 0 && (
          <div className="border border-purple-500/20 bg-[#040409]/95 rounded-2xl p-5 select-none font-mono">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-900 mb-4 text-[#00ffcc]">
              <Terminal className="w-5 h-5 animate-pulse" />
              <h3 className="text-xs uppercase tracking-widest font-extrabold">LIVE BOOKINGS TERMINAL LEDGER FEED:</h3>
            </div>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scroll scrollbar-none">
              {reservationsLedger.map((booking) => {
                const associatedVenue = VENUES.find(v => v.id === booking.venueId);
                return (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] p-2 bg-black/60 border border-zinc-900 rounded-lg gap-2 text-zinc-400">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-purple-400 font-bold">[{booking.status.toUpperCase()}]</span>
                      <span className="text-white font-semibold">{booking.name}</span>
                      <span className="text-zinc-600">&rarr;</span>
                      <span className="text-purple-300 font-bold uppercase">{associatedVenue ? associatedVenue.name : booking.venueId}</span>
                      <span className="text-zinc-500">({booking.type})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400">{booking.guests} GUESTS</span>
                      <span className="text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded text-[10px]">{booking.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900/90 bg-[#020205] text-zinc-600 p-6 md:p-8 text-center font-mono text-[10px] uppercase tracking-widest select-none space-y-2 relative z-20">
        <div>NIGHTLIFE CORE V4.2 RESERVED RIGHTS &amp; CYBERNETIC INTEL NETWORKS.</div>
        <div className="text-zinc-700">DOCK FEED INTEGRATED VIA SECURE PORTS. SYSTEM OK.</div>
      </footer>

      {/* Pop up Reservation checkout Modal Dialog */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        selectedVenue={activeVenue}
        selectedPackage={customSelectedPackage}
        onBookingSuccess={handleBookingSuccessCallback}
      />
    </div>
  );
}
