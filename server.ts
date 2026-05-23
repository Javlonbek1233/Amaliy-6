import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory simulated live database state for Crowd Tracking and VIP Bookings
let bookings: any[] = [
  {
    id: "booking-1",
    venueId: "neon-grid",
    name: "Avery Sterling",
    type: "VIP Booth - Tier 1",
    date: "2026-05-24",
    guests: 6,
    status: "Confirmed",
    timestamp: "2026-05-23T10:15:00Z"
  }
];

// Simulated real-time crowdedness baseline (0 to 100)
const crowdSensors: { [venueId: string]: { value: number; trend: "rising" | "stable" | "falling"; energy: number } } = {
  "neon-grid": { value: 87, trend: "rising", energy: 94 },
  "retro-wave": { value: 52, trend: "stable", energy: 68 },
  "prism-lounge": { value: 74, trend: "rising", energy: 81 },
  "velocity": { value: 95, trend: "rising", energy: 98 },
  "hologram-sky": { value: 61, trend: "falling", energy: 75 },
  "underground-sub": { value: 41, trend: "stable", energy: 60 }
};

// Lazy initialization of Gemini SDK
let aiClient: any = null;
function getGeminiAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Crowd metrics API
app.get("/api/crowd", (req, res) => {
  // Simulate small real-time fluctuations
  Object.keys(crowdSensors).forEach(id => {
    const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
    let newVal = crowdSensors[id].value + change;
    newVal = Math.max(30, Math.min(100, newVal));
    crowdSensors[id].value = newVal;

    // Fluid trends
    if (change > 0) crowdSensors[id].trend = "rising";
    else if (change < 0) crowdSensors[id].trend = "falling";
    else crowdSensors[id].trend = "stable";

    // Randomize energy a bit
    crowdSensors[id].energy = Math.max(40, Math.min(100, Math.floor(newVal * 1.05 + (Math.random() * 6 - 3))));
  });

  res.json({
    timestamp: new Date().toISOString(),
    sensors: crowdSensors
  });
});

// 2. VIP & Reservation bookings state management
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { venueId, name, type, date, guests } = req.body;
  if (!venueId || !name || !type || !date) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  const newBooking = {
    id: `booking-${Date.now()}`,
    venueId,
    name,
    type,
    date,
    guests: Number(guests) || 2,
    status: "Confirmed",
    timestamp: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

// 3. AI Nightlife Recommendations - using Gemini API server-side
app.post("/api/gemini/recommendations", async (req, res) => {
  const { mood, music, vibe } = req.body;
  if (!mood || !music || !vibe) {
    return res.status(400).json({ error: "Please provide mood, music and vibe inputs." });
  }

  const ai = getGeminiAI();

  if (!ai) {
    // Elegant fallback high-fidelity response if API key is missing
    return res.json({
      usingFallback: true,
      headline: `CHILLING WITH CYBERPUNK SYNTHWAVE`,
      advice: "Your customized AI Vibe Radar suggests hitting retro-themed micro lounges in the sector 6 grid. Stick with neon-inspired cocktails and pulsating synthesizer bass lines.",
      suggestedDrink: "Glitch Tonic (Activated charcoal, elderflower, blue curacao, dry ice vapor)",
      spots: [
        {
          name: "Neon Grid Lounge",
          sector: "Downtown Grid-7",
          reason: `Matches your desire for ${mood} mood & ${music} beats. Has a perfect ${vibe} look.`,
          matchPercentage: 97
        },
        {
          name: "Prism Void speakeasy",
          sector: "Sub-level 4",
          reason: "An underground dark luxury spot mimicking classic holographic designs with bespoke analog synths.",
          matchPercentage: 89
        }
      ]
    });
  }

  try {
    const prompt = `You are a futuristic cyberpunk AI nightlife concierge.
Generate a glowing, energetic nightlife recommendation tailored for:
Mood: ${mood}
Music Genre: ${music}
Vibe/Setting: ${vibe}

Respond in clean JSON format adhering to this structure:
{
  "headline": "A short, catchy neon slogan",
  "advice": "1 to 2 sentences of immersive, exciting nightlife advice in cyberpunk sci-fi tone",
  "suggestedDrink": "A name and brief description of an exotic cyberpunk futuristic drink",
  "spots": [
    {
      "name": "Fictional club name matching the vibe",
      "sector": "A futuristic sector or sub-level name",
      "reason": "Why this fictional club matches their specific request perfectly",
      "matchPercentage": 90
    },
    {
         "name": "Alternative venue name",
         "sector": "Futuristic sector",
         "reason": "Why this matches",
         "matchPercentage": 82
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            advice: { type: Type.STRING },
            suggestedDrink: { type: Type.STRING },
            spots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sector: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER }
                },
                required: ["name", "sector", "reason", "matchPercentage"]
              }
            }
          },
          required: ["headline", "advice", "suggestedDrink", "spots"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (err: any) {
    console.error("Gemini API Error in recommendations:", err);
    res.status(500).json({ error: "Failed to generate recommendations.", details: err.message });
  }
});

// 4. Party Mood Detector Map Tracker using Gemini API
app.post("/api/gemini/party-mood", async (req, res) => {
  const { energyLevel, activityType, drinksSelection, socialMode } = req.body;

  const ai = getGeminiAI();

  if (!ai) {
    // Beautiful mock calculations to satisfy party mood tracker if Gemini is not ready
    const score = Math.floor(Number(energyLevel || 5) * 10 + 20 + Math.random() * 10);
    let moodLabel = "Hyperdrive Elite Party Animal";
    if (score < 50) moodLabel = "Cyber-Nocturnal Lounger";
    else if (score < 80) moodLabel = "High-Voltage Club Hopper";

    return res.json({
      usingFallback: true,
      score: Math.min(100, score),
      moodLabel,
      commentary: "Your cybernetic energy signatures indicate a massive potential for sensory overload. Initiate deep-bass filtration protocols and secure direct VIP shuttle access.",
      recommendedActivity: "Synchronized neon laser dancing with customized soundscapes."
    });
  }

  try {
    const prompt = `You are the ultimate cyberpunk Nightlife AI mood analyzing engine.
Analyze these metrics:
- Energy Level (1 to 10 scale): ${energyLevel}
- Desired Activity: ${activityType}
- Selected Beverage Vibe: ${drinksSelection}
- Social Matrix Mode: ${socialMode}

Determine their party index (0 to 100), assign a futuristic label, write some high-energy, witty, neon-drenched commentary (2 sentences) and suggest an activity.

Respond in exact JSON format:
{
  "score": 85,
  "moodLabel": "A custom futuristic label like 'Hyperdrive Techno Nomad' or 'Synthetic Velvet VIP'",
  "commentary": "Neon commentary about their party potential.",
  "recommendedActivity": "Specfic exotic customized activity matching this exact vibe"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            moodLabel: { type: Type.STRING },
            commentary: { type: Type.STRING },
            recommendedActivity: { type: Type.STRING }
          },
          required: ["score", "moodLabel", "commentary", "recommendedActivity"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (err: any) {
    console.error("Gemini API Error in party-mood detector:", err);
    res.status(500).json({ error: "Failed to calculate party mood.", details: err.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NightLife Backend running on http://localhost:${PORT}`);
  });
}

startServer();
