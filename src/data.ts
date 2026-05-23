import { Venue, LiveEvent, VIPPackage } from "./types";

export const VENUES: Venue[] = [
  {
    id: "neon-grid",
    name: "NEON GRID WAREHOUSE",
    type: "Warehouse",
    description: "An industrial-grade cyber bunker located in Downtown Sector 7. Pulsing with dark synthwave, raw concrete acoustics, and premium custom lasers.",
    sector: "SOMA Sector-7",
    vibe: "Underground Techno Bunker",
    musicType: "Industrial Techno / Synthwave",
    neonColor: "border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]",
    glowHex: "#a855f7",
    rating: 4.9,
    coverCharge: "$25 (Free for Sector-7 key card holders)",
    isTrending: true,
    coordinates: {
      lat: 37.7785,
      lng: -122.4056
    },
    djTonight: "DJ NEON_VORTEX",
    djSchedule: [
      { time: "22:00 - Midnight", artist: "CYBER_MAGE" },
      { time: "Midnight - 02:00", artist: "DJ NEON_VORTEX [Live Set]" },
      { time: "02:00 - Close", artist: "GLITCH_DUST" }
    ],
    currentEvent: {
      title: "SYNAPSE PROTOCOL v3.2",
      description: "An intensive sub-bass audio-visual demonstration featuring customized spatial frequency arrays.",
      time: "22:00 - 04:00"
    },
    avatar: "⚡",
    signatureDrink: "Glitch Tonic",
    synthTheme: {
      type: "sawtooth",
      tempo: 128,
      baseFreq: 110
    }
  },
  {
    id: "velocity",
    name: "VELOCITY HYPERCLUB",
    type: "Club",
    description: "A multi-level cyber-cathedral equipped with full-room reactive holographic walls, zero-gravity VIP platforms, and hyper-dense crowd energy.",
    sector: "Downtown Grid-2",
    vibe: "High-Octane Cyber-Rave",
    musicType: "Acid Techno / Psytrance",
    neonColor: "border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.7)]",
    glowHex: "#ec4899",
    rating: 4.8,
    coverCharge: "$40 (Pre-sales recommended)",
    isTrending: true,
    coordinates: {
      lat: 37.7845,
      lng: -122.4012
    },
    djTonight: "VIRTUAL_VIXEN",
    djSchedule: [
      { time: "21:30 - Midnight", artist: "DATA_STORM" },
      { time: "Midnight - 02:30", artist: "VIRTUAL_VIXEN" },
      { time: "02:30 - Close", artist: "ACID_OVERLOAD" }
    ],
    currentEvent: {
      title: "ZERO GRAVITY MASSIVE",
      description: "Experience maximum kinetic pressure with reactive lasers syncing directly to bio-sensors on the dance floor.",
      time: "21:30 - 05:00"
    },
    avatar: "🔥",
    signatureDrink: "Zero-G Collider",
    synthTheme: {
      type: "square",
      tempo: 140,
      baseFreq: 130
    }
  },
  {
    id: "prism-lounge",
    name: "PRISM SPEAKEASY",
    type: "Lounge",
    description: "An intimate, soundproof sanctuary hidden beneath the historical sub-circuits. Soft dark velvet, retro holographic jazz acts, and slow liquid smoke cocktails.",
    sector: "Sub-Level Chinatown-4",
    vibe: "High-Society Holo-Jazz / Deep Chill",
    musicType: "Holographic Jazz / Chillstep",
    neonColor: "border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]",
    glowHex: "#06b6d4",
    rating: 4.7,
    coverCharge: "$15 (Reservations highly advised)",
    isTrending: false,
    coordinates: {
      lat: 37.7955,
      lng: -122.4082
    },
    djTonight: "ANALOG_KIDS",
    djSchedule: [
      { time: "20:00 - 22:30", artist: "AMBER_GLOW [Live Sax]" },
      { time: "22:30 - 01:00", artist: "ANALOG_KIDS" },
      { time: "01:00 - Close", artist: "CHILL_MATRIX [Lo-fi Room]" }
    ],
    currentEvent: {
      title: "VELVET RAY NOSTALGIA",
      description: "Exclusive retro tribute night, projecting pre-collapse cultural memories with warm custom beverages.",
      time: "20:00 - 03:00"
    },
    avatar: "🎷",
    signatureDrink: "Obsidian Smoke",
    synthTheme: {
      type: "sine",
      tempo: 96,
      baseFreq: 165
    }
  },
  {
    id: "retro-wave",
    name: "RETROWAVE ARCADE BAR",
    type: "Bar",
    description: "An absolute retro palace celebrating custom 80s arcade mechanics, neon grid tables, and authentic outrunner aesthetics. Perfect for competitive fuel.",
    sector: "The Haight Grid-5",
    vibe: "80s Cyber-Laser Arcade",
    musicType: "Outrun / Synthwave",
    neonColor: "border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.7)]",
    glowHex: "#f59e0b",
    rating: 4.6,
    coverCharge: "Free entry before 22:00",
    isTrending: false,
    coordinates: {
      lat: 37.7695,
      lng: -122.4412
    },
    djTonight: "DJ VECTOR_CORE",
    djSchedule: [
      { time: "19:00 - 21:00", artist: "GRID_RUNNER" },
      { time: "21:00 - Close", artist: "DJ VECTOR_CORE [80s Special]" }
    ],
    currentEvent: {
      title: "GRID SPEED RACER tournament",
      description: "Compete in live augmented arcade leaderboards while high-density vapor tracks play overhead.",
      time: "19:00 - 02:00"
    },
    avatar: "🕹️",
    signatureDrink: "Vapor Fuel",
    synthTheme: {
      type: "triangle",
      tempo: 115,
      baseFreq: 220
    }
  },
  {
    id: "hologram-sky",
    name: "HOLOGRAM SKY LOUNGE",
    type: "Lounge",
    description: "Perched 80 levels above the harbor mist, this VIP glass dome presents 360-degree holographic sky views. A dark luxury classic for elite neon nomads.",
    sector: "Waterfront Peak-80",
    vibe: "Cyber-Luxury Sky Dome",
    musicType: "Deep Vocal House / Nu-Disco",
    neonColor: "border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)]",
    glowHex: "#10b981",
    rating: 4.95,
    coverCharge: "$50 (Requires dress code verification)",
    isTrending: true,
    coordinates: {
      lat: 37.8020,
      lng: -122.4030
    },
    djTonight: "MAYA_MISTRAL",
    djSchedule: [
      { time: "22:00 - Midnight", artist: "SATELLITE_WIND" },
      { time: "Midnight - 02:30", artist: "MAYA_MISTRAL [Deep Lounge Set]" },
      { time: "02:30 - Close", artist: "CLOUD_CASTLES" }
    ],
    currentEvent: {
      title: "AURORA HOLOGRAPHIC CELESTIAL",
      description: "Visual projection of synthetic aurora borealis synchronized with live premium acoustic strings.",
      time: "22:00 - 03:30"
    },
    avatar: "🌌",
    signatureDrink: "Stardust Royale",
    synthTheme: {
      type: "sine",
      tempo: 120,
      baseFreq: 330
    }
  },
  {
    id: "underground-sub",
    name: "UNDERGROUND SUB-4",
    type: "Warehouse",
    description: "Strictly word-of-mouth. Access via sewer shaft 11. No photography rule. RAW industrial lighting and pounding sub-bass and distortion.",
    sector: "Industrial Sub-sector 4",
    vibe: "Dark Hardcore Acid Techno",
    musicType: "Acid Techno / Industrial / Hard Trance",
    neonColor: "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]",
    glowHex: "#ef4444",
    rating: 4.5,
    coverCharge: "$15 (Cash Only at the gate-seal)",
    isTrending: false,
    coordinates: {
      lat: 37.7595,
      lng: -122.4112
    },
    djTonight: "ANXIETY_PULSE",
    djSchedule: [
      { time: "23:00 - 01:00", artist: "STEEL_GASKET" },
      { time: "01:00 - Close", artist: "ANXIETY_PULSE" }
    ],
    currentEvent: {
      title: "THE SOUND SEWER DEBATE",
      description: "Unfiltered analogue synthesizers pushed past standard threshold limits. Earplug dispatch is mandatory.",
      time: "23:00 - Until Dawn"
    },
    avatar: "💀",
    signatureDrink: "Synthetic Acid Shot",
    synthTheme: {
      type: "sawtooth",
      tempo: 145,
      baseFreq: 82
    }
  }
];

export const EVENTS: LiveEvent[] = [
  {
    id: "evt-1",
    title: "SYNAPSE PROTOCOL v3.2",
    venueId: "neon-grid",
    venueName: "NEON GRID WAREHOUSE",
    headliner: "DJ NEON_VORTEX",
    support: "CYBER_MAGE, GLITCH_DUST",
    time: "Tonight, 22:00 - 04:00",
    price: "$25",
    status: "Selling Fast",
    attendeesCount: 412,
    neonColor: "from-purple-500 to-indigo-600"
  },
  {
    id: "evt-2",
    title: "ZERO GRAVITY MASSIVE",
    venueId: "velocity",
    venueName: "VELOCITY HYPERCLUB",
    headliner: "VIRTUAL_VIXEN",
    support: "DATA_STORM, ACID_OVERLOAD",
    time: "Tonight, 21:30 - 05:00",
    price: "$40",
    status: "VIP Exclusive",
    attendeesCount: 940,
    neonColor: "from-pink-500 to-red-500"
  },
  {
    id: "evt-3",
    title: "VELVET RAY NOSTALGIA",
    venueId: "prism-lounge",
    venueName: "PRISM SPEAKEASY",
    headliner: "AMBER_GLOW [Live Sax]",
    support: "ANALOG_KIDS, CHILL_MATRIX",
    time: "Tonight, 20:00 - 03:00",
    price: "$15",
    status: "Available",
    attendeesCount: 120,
    neonColor: "from-cyan-500 to-teal-500"
  },
  {
    id: "evt-4",
    title: "AURORA SKY CELESTIAL",
    venueId: "hologram-sky",
    venueName: "HOLOGRAM SKY LOUNGE",
    headliner: "MAYA_MISTRAL",
    support: "SATELLITE_WIND",
    time: "Tomorrow, 22:00 - 03:30",
    price: "$50",
    status: "Sold Out",
    attendeesCount: 300,
    neonColor: "from-emerald-500 to-cyan-500"
  }
];

export const VIP_PACKAGES: VIPPackage[] = [
  {
    id: "package-standard",
    name: "NEON PROTOCOL ACCESS",
    price: "$120",
    perks: [
      "Queue bypass privilege (Direct access)",
      "Dedicated cocktail station lounge access",
      "Signature glowing wristband",
      "1 Cyber-Beverage voucher included"
    ],
    crowdLimit: 20
  },
  {
    id: "package-luxe",
    name: "CYBER NET VIP LOUNGE",
    price: "$350",
    perks: [
      "Exclusive custom leather booths overlooking the dancefloor",
      "Full bottle of synthetic premium vodka/champagne",
      "Dedicated server for instant liquid refuelling",
      "Access to safe chillout capsules & personal security guard",
      "Holographic identity projection on the club's display rail"
    ],
    crowdLimit: 8
  },
  {
    id: "package-matrix",
    name: "HYPERDRIVE OVERLORD ENCLAVE",
    price: "$850",
    perks: [
      "Fully sound-isolated luxury capsule overlooking DJ mainstage",
      "Private bar with unlimited access to premium rare glow tonics",
      "DJ meet & greet + custom neon souvenir card",
      "On-demand personal security android services",
      "Private premium rooftop transit shuttle priority access"
    ],
    crowdLimit: 4
  }
];
