export interface Venue {
  id: string;
  name: string;
  type: "Club" | "Bar" | "Lounge" | "Warehouse";
  description: string;
  sector: string;
  vibe: string;
  musicType: string;
  neonColor: string; // Tailwind glow class e.g., 'border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
  glowHex: string; // Hex color for maps e.g. #d946ef
  rating: number;
  coverCharge: string;
  isTrending: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  djTonight: string;
  djSchedule: { time: string; artist: string }[];
  currentEvent: {
    title: string;
    description: string;
    time: string;
  };
  avatar: string;
  signatureDrink: string;
  synthTheme: {
    type: "sawtooth" | "sine" | "triangle" | "square";
    tempo: number;
    baseFreq: number;
  };
}

export interface LiveEvent {
  id: string;
  title: string;
  venueId: string;
  venueName: string;
  headliner: string;
  support: string;
  time: string;
  price: string;
  status: "Sold Out" | "Selling Fast" | "Available" | "VIP Exclusive";
  attendeesCount: number;
  neonColor: string;
}

export interface VIPPackage {
  id: string;
  name: string;
  price: string;
  perks: string[];
  crowdLimit: number;
}

export interface AIRecommendation {
  usingFallback?: boolean;
  headline: string;
  advice: string;
  suggestedDrink: string;
  spots: {
    name: string;
    sector: string;
    reason: string;
    matchPercentage: number;
  }[];
}

export interface PartyMoodResult {
  usingFallback?: boolean;
  score: number;
  moodLabel: string;
  commentary: string;
  recommendedActivity: string;
}
