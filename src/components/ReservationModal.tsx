import React, { useState } from "react";
import { Venue, VIPPackage } from "../types";
import { Calendar, User, Users, Check, Loader2, X, ShieldCheck } from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVenue: Venue | null;
  selectedPackage?: VIPPackage | null;
  onBookingSuccess: (booking: any) => void;
}

export default function ReservationModal({
  isOpen,
  onClose,
  selectedVenue,
  selectedPackage,
  onBookingSuccess
}: ReservationModalProps) {
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState("2026-05-24");
  const [guestsCount, setGuestsCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !selectedVenue) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId: selectedVenue.id,
          name: userName,
          type: selectedPackage ? `VIP Package: ${selectedPackage.name}` : "Standard Corridor Pass",
          date,
          guests: guestsCount
        })
      });

      if (!response.ok) {
        throw new Error("Reservation system refused authentication check.");
      }

      const newBooking = await response.json();
      onBookingSuccess(newBooking);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      alert("Error writing to reservation ledger. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCompleted(false);
    setUserName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 select-none animate-fade-in font-sans">
      <div id="booking-modal-card" className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
        {/* Glow corner overlay */}
        <span className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 blur-2xl rounded-full" />

        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
          <div>
            <span className="text-[8px] uppercase tracking-widest text-fuchsia-450 font-extrabold">Reservation Entry Access</span>
            <h3 className="font-sans font-extrabold text-xs uppercase tracking-wider text-white mt-1">RESERVE: {selectedVenue.name}</h3>
          </div>
          <button 
            onClick={handleClose} 
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-neutral-450 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCompleted ? (
          <div className="text-center py-6 space-y-4 animate-fade-in font-sans">
            <div className="w-12 h-12 bg-fuchsia-950/40 border border-fuchsia-500 text-fuchsia-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-fuchsia-400 text-xs uppercase tracking-widest leading-relaxed">Neon Entry Secure</h4>
              <p className="text-neutral-300 text-[11px] mt-1.5 leading-relaxed font-light">
                Reservation logged. Welcome package and dynamic QR passes are fully dispatched via virtual grid.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left font-sans text-[10px] space-y-1.5 text-neutral-300 font-light">
              <div><span className="text-neutral-400 uppercase tracking-wider">SECTOR ASSIGNEES:</span> <span className="text-white font-bold">{userName}</span></div>
              <div><span className="text-neutral-400 uppercase tracking-wider">PROTOCOL VENUE:</span> <span className="text-fuchsia-400 font-bold">{selectedVenue.name}</span></div>
              <div><span className="text-neutral-400 uppercase tracking-wider">SCHED DATE:</span> <span className="text-white font-mono">{date}</span></div>
              <div><span className="text-neutral-400 uppercase tracking-wider">CAP FORCE:</span> <span className="text-cyan-400 font-bold">{guestsCount} GUESTS</span></div>
              {selectedPackage && (
                <div className="text-fuchsia-350 font-bold"><span className="text-neutral-400 uppercase tracking-wider font-light">VIP SCHED TYPE:</span> {selectedPackage.name}</div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-sans text-[9px] uppercase font-bold rounded-full truncate cursor-pointer tracking-widest transition-all duration-300"
            >
              Close Node Connection
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            {selectedPackage && (
              <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-2xl p-3.5">
                <div className="font-sans text-[8px] text-fuchsia-450 uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURING VIP PRIVILEGE MATRIX
                </div>
                <div className="text-xs font-bold text-white mt-1.5">{selectedPackage.name} ({selectedPackage.price})</div>
              </div>
            )}

            {/* Form Input fields */}
            <div className="space-y-3.5 font-sans">
              <div>
                <label className="font-sans text-[8px] uppercase tracking-widest text-[#9ca3af] block mb-1.5 font-bold">
                  Identity Ticket Name:
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-fuchsia-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Avery Sterling"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 text-white rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-fuchsia-500 font-sans font-light placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-[8px] uppercase tracking-widest text-[#9ca3af] block mb-1.5 font-bold">
                    Timeline Date:
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-fuchsia-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white rounded-full py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:border-fuchsia-500 font-mono text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[8px] uppercase tracking-widest text-[#9ca3af] block mb-1.5 font-bold">
                    Guests Force:
                  </label>
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 text-fuchsia-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="1"
                      max={selectedPackage ? selectedPackage.crowdLimit : 20}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-white/10 text-white rounded-full py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:border-fuchsia-500 font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Note about direct security */}
            <div className="text-[9px] text-[#6b7280] text-center leading-relaxed font-light px-2">
              By connecting standard grid protocols, you confirm adherence to club code restrictions and luxury dress norms. Registers expire daily at 05:00 UTC.
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 font-sans text-[9px] font-bold uppercase tracking-widest">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 py-2.5 border border-white/10 text-neutral-450 rounded-full hover:text-white hover:bg-white/5 cursor-pointer transition-all duration-300"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 cursor-pointer text-white font-bold rounded-full shadow-[0_0_15px_rgba(217,70,239,0.35)] transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> Logging...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" /> SECURE ENTRY
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
