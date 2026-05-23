import React from "react";
import { VIP_PACKAGES } from "../data";
import { VIPPackage, Venue } from "../types";
import { ShieldAlert, CheckCircle, ChevronRight, Diamond } from "lucide-react";

interface VipSectionProps {
  onSelectPackage: (pack: VIPPackage) => void;
  activeVenue: Venue | null;
}

export default function VipSection({ onSelectPackage, activeVenue }: VipSectionProps) {
  return (
    <div id="vip-packages-section" className="flex flex-col border border-white/10 bg-white/5 rounded-[32px] p-6 select-none relative overflow-hidden transition-all duration-300 hover:border-fuchsia-500/30 backdrop-blur-md">
      <span className="absolute bottom-0 right-0 w-36 h-36 bg-fuchsia-500/5 blur-3xl rounded-full" />

      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Diamond className="w-5 h-5 text-fuchsia-400 animate-pulse" />
          <h3 className="font-sans text-xs uppercase tracking-widest text-white font-bold">Neon Velvet VIP Access</h3>
        </div>
        <span className="text-[9px] font-sans text-fuchsia-400 bg-fuchsia-950/40 px-3 py-1 rounded-full border border-fuchsia-500/20 uppercase font-bold">
          Elite Access Only
        </span>
      </div>

      <p className="text-neutral-300 text-xs mb-5 font-light leading-relaxed">
        Deploy premium clearance protocols. VIP entitlements integrate guaranteed seating force, rare molecular liquor mixtures, and direct capsule elevator privileges.
      </p>

      {/* VIP Cards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VIP_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="flex flex-col border border-white/5 bg-white/5 hover:bg-white/10 p-4 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-fuchsia-500/30"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-1 pb-2 border-b border-white/10 mb-3">
              <div>
                <h4 className="font-sans font-bold text-[12px] uppercase tracking-wider text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors">
                  {pkg.name}
                </h4>
                <div className="text-[8px] font-mono text-neutral-400 uppercase mt-0.5">
                  LIMIT: &lt;= {pkg.crowdLimit} GUESTS
                </div>
              </div>
              <div className="font-sans font-black text-md text-white">{pkg.price}</div>
            </div>

            {/* Perks bullet list */}
            <ul className="space-y-1.5 flex-grow mb-4">
              {pkg.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-300 text-[10px] leading-relaxed font-light">
                  <CheckCircle className="w-3 h-3 text-fuchsia-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            {/* Sched link button */}
            <button
              onClick={() => onSelectPackage(pkg)}
              className="w-full py-2 bg-white/5 border border-white/10 text-fuchsia-400 font-sans text-[9px] uppercase font-bold tracking-widest rounded-full group-hover:bg-fuchsia-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 cursor-pointer flex items-center justify-center gap-1"
            >
              Secure Package <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Small foot safety guidelines */}
      <div className="mt-4 bg-fuchsia-950/20 p-3 border border-fuchsia-500/10 rounded-2xl flex items-center gap-2.5 font-sans text-[9px] text-fuchsia-350 leading-relaxed font-light">
        <ShieldAlert className="w-4 h-4 shrink-0 text-fuchsia-450" />
        <span>RESTAURANT &amp; CABARET NOTE: ALL VIP RESERVATIONS ARE SUBJECT TO STRICT CAPACITY STANDARDS. SECURE COVER CHARGES REMAIN FIXED ON STAGE.</span>
      </div>
    </div>
  );
}
