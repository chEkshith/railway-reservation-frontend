import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import AutocompleteInput from '../components/AutocompleteInput';
import SeatMapModal from '../components/SeatMapModal';
import PaymentModal from '../components/PaymentModal';
import TicketModal from '../components/TicketModal';
import AuthRequiredModal from '../components/AuthRequiredModal';
import { Calendar, Search, Navigation, Info, ShieldAlert, Train } from 'lucide-react';

export default function Home() {
  const { user } = useContext(AuthContext);
  const { 
    searchTrains, 
    searchResults, 
    isSearching, 
    activeBooking,
    setActiveBooking,
    showSeatModal,
    setShowSeatModal,
    showPaymentModal,
    showTicketModal,
    showAuthModal,
    setShowAuthModal
  } = useContext(BookingContext);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  
  // Set default date to today
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [travelClass, setTravelClass] = useState('3A');
  const [tripType, setTripType] = useState('one-way'); // one-way | round-trip

  // --- Interactive mouse-tracking glow & tilt for the booking box ---
  const bookingBoxRef = useRef(null);
  const [mouseGlow, setMouseGlow] = useState({ x: 50, y: 50, opacity: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleBoxMouseMove = useCallback((e) => {
    const el = bookingBoxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseGlow({ x, y, opacity: 1 });

    // Subtle 3D tilt: max ±3 degrees
    const tiltX = ((y - 50) / 50) * -3;
    const tiltY = ((x - 50) / 50) * 3;
    setTilt({ rotateX: tiltX, rotateY: tiltY });
  }, []);

  const handleBoxMouseLeave = useCallback(() => {
    setMouseGlow((prev) => ({ ...prev, opacity: 0 }));
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    searchTrains(from.trim(), to.trim(), date, travelClass);
  };

  const handleBookNow = (train) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setActiveBooking({
        train,
        selectedSeats: [],
        passengers: [],
        selectedClass: travelClass,
        journeyDate: date,
      });
      setShowSeatModal(true);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10 flex-1">
      {/* Background Image Overlay */}
      <div 
        className="bg-overlay-img" 
        style={{ backgroundImage: "url('/old-static-html/assets/images/rail2.jpg')" }} 
      />

      {/* Glassmorphic Search Form Box — with interactive mouse glow & tilt */}
      <section
        ref={bookingBoxRef}
        onMouseMove={handleBoxMouseMove}
        onMouseLeave={handleBoxMouseLeave}
        className="bg-cardBg border border-borderGlass rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md glow-indigo"
        style={{
          perspective: '1000px',
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Animated gradient spotlight that follows the cursor */}
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          style={{
            background: `radial-gradient(600px circle at ${mouseGlow.x}% ${mouseGlow.y}%, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.06) 40%, transparent 70%)`,
            opacity: mouseGlow.opacity,
            transition: 'opacity 0.4s ease',
          }}
        />
        {/* Border shimmer on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          style={{
            background: `radial-gradient(400px circle at ${mouseGlow.x}% ${mouseGlow.y}%, rgba(6, 182, 212, 0.25), transparent 60%)`,
            opacity: mouseGlow.opacity,
            transition: 'opacity 0.4s ease',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan via-indigo-500 to-amber-500 z-10" />
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight text-white mb-8 font-headings">
          Book Your Train Tickets
        </h1>

        {/* Trip Toggles */}
        <div className="flex gap-3 mb-6 justify-center">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
              tripType === 'one-way'
                ? 'bg-accentCyan/10 border-accentCyan text-accentCyan shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'bg-white/5 border-borderGlass text-textSecondary hover:text-white'
            }`}
          >
            One-Way Journey
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
              tripType === 'round-trip'
                ? 'bg-accentCyan/10 border-accentCyan text-accentCyan shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'bg-white/5 border-borderGlass text-textSecondary hover:text-white'
            }`}
          >
            Round-Trip Journey
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* From Input */}
            <AutocompleteInput 
              id="from"
              label="From Station"
              placeholder="Departure City (e.g., Noida)"
              value={from}
              onChange={setFrom}
              icon={<Navigation size={18} className="rotate-45" />}
            />

            {/* To Input */}
            <AutocompleteInput 
              id="to"
              label="To Station"
              placeholder="Arrival City (e.g., Bengaluru)"
              value={to}
              onChange={setTo}
              icon={<Navigation size={18} className="rotate-135" />}
            />

            {/* Date Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="journey-date" className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                Date of Journey
              </label>
              <div className="relative flex items-center">
                <Calendar size={18} className="absolute left-4 text-textSecondary pointer-events-none" />
                <input 
                  type="date" 
                  id="journey-date" 
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-[#121B31]/50 border border-borderGlass rounded-lg py-3 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/85 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                />
              </div>
            </div>

            {/* Class Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="travel-class" className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                Travel Class
              </label>
              <div className="relative flex items-center">
                <Train size={18} className="absolute left-4 text-textSecondary pointer-events-none" />
                <select 
                  id="travel-class" 
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="w-full bg-[#121B31]/50 border border-borderGlass rounded-lg py-3 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/85 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)] appearance-none cursor-pointer"
                >
                  <option value="1A">AC First Class (1A)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                  <option value="SL">Sleeper Class (SL)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-3">
            <button 
              type="submit"
              className="bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-headings font-bold text-lg px-12 py-3.5 rounded-full shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_22px_rgba(6,182,212,0.45)] hover:scale-[1.02] active:scale-100 transition-all duration-300 flex items-center gap-2"
            >
              <Search size={18} />
              <span>Search Trains</span>
            </button>
          </div>
        </form>
      </section>

      {/* Results populator section */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-6 min-h-[150px]">
        {isSearching && (
          <div className="flex flex-col items-center gap-4 py-12 text-center animate-fadeIn">
            <div className="train-track-loader" />
            <p className="text-textSecondary text-sm font-medium">
              Searching Indian Railway network for real-time trains...
            </p>
          </div>
        )}

        {!isSearching && searchResults && searchResults.length === 0 && (
          <div className="bg-[#141A2B]/60 border border-dashed border-borderGlass rounded-xl p-12 text-center flex flex-col items-center gap-4 animate-fadeIn">
            <ShieldAlert size={48} className="text-textMuted" />
            <div>
              <h3 className="font-headings font-bold text-lg text-white mb-1">No Direct Trains Found</h3>
              <p className="text-textSecondary text-sm max-w-sm mx-auto leading-relaxed">
                We couldn't locate direct trains matching this specific route. Try selecting another hub like Delhi, Mumbai, or Bengaluru.
              </p>
            </div>
          </div>
        )}

        {!isSearching && searchResults && searchResults.length > 0 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-headings text-white">
                {searchResults.length} Trains Connecting {from} to {to}
              </h2>
              <p className="text-textSecondary text-xs mt-1">
                Fares are updated. Click Book Now to configure coach seat selection.
              </p>
            </div>

            {searchResults.map((train, idx) => {
              const isBooked = train.availability === "Booked";
              const isWaiting = train.availability.includes("Waiting List");
              
              let statusColor = "bg-accentEmerald shadow-[0_0_8px_#10B981]";
              let statusTextClass = "text-accentEmerald";
              let statusLabel = `Available - ${train.availableSeatsCount} seats`;

              if (isBooked) {
                statusColor = "bg-accentRose shadow-[0_0_8px_#F43F5E]";
                statusTextClass = "text-accentRose";
                statusLabel = "Fully Booked";
              } else if (isWaiting) {
                statusColor = "bg-accentAmber shadow-[0_0_8px_#F59E0B]";
                statusTextClass = "text-accentAmber";
                statusLabel = train.availability;
              }

              return (
                <div 
                  key={train.trainNumber}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                  className="bg-cardBg border border-borderGlass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-accentCyan/40 hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:shadow-accentCyan/5 transition-all duration-300 animate-fadeUpIn relative overflow-hidden"
                >
                  {/* Left Column: Title / class pills */}
                  <div className="flex flex-col gap-3.5 min-w-[200px] w-full md:w-auto">
                    <div className="flex items-center gap-2 font-headings font-bold text-lg text-white">
                      <Train size={18} className="text-accentCyan" />
                      <span>{train.trainName}</span>
                    </div>
                    <div className="flex gap-2">
                      {train.classes.map(c => (
                        <span key={c} className="text-[10px] font-bold bg-white/5 border border-borderGlass px-2.5 py-1 rounded text-textSecondary">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                      <span className={statusTextClass}>{statusLabel}</span>
                    </div>
                  </div>

                  {/* Middle Column: Journey timings timeline */}
                  <div className="flex items-center gap-5 flex-1 w-full justify-between sm:justify-start">
                    <div className="text-center min-w-[80px]">
                      <div className="font-headings font-bold text-lg text-white">{train.departure}</div>
                      <div className="text-xs text-textSecondary mt-0.5 font-medium">{train.from}</div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider mb-1">
                        {train.duration}
                      </span>
                      <div className="w-full flex items-center justify-center gap-1">
                        <div className="h-[2px] bg-borderGlass flex-1 relative">
                          <div className="w-1.5 h-1.5 rounded-full bg-textMuted absolute top-[-2px] left-0" />
                        </div>
                        <Train size={14} className="text-accentCyan" />
                        <div className="h-[2px] bg-borderGlass flex-1 relative">
                          <div className="w-1.5 h-1.5 rounded-full bg-textMuted absolute top-[-2px] right-0" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <div className="font-headings font-bold text-lg text-white">{train.arrival}</div>
                      <div className="text-xs text-textSecondary mt-0.5 font-medium">{train.to}</div>
                    </div>
                  </div>

                  {/* Right Column: CTA Fares */}
                  <div className="flex flex-col items-end gap-3 min-w-[130px] border-t border-borderGlass pt-4 md:pt-0 md:border-none w-full md:w-auto md:flex-col md:items-end justify-between flex-row">
                    <div className="text-right md:text-right">
                      <div className="text-[10px] text-textMuted uppercase tracking-wider font-semibold">Class Fare</div>
                      <div className="text-2xl font-extrabold text-accentCyan mt-0.5">₹{train.fare}</div>
                    </div>
                    <button 
                      onClick={() => handleBookNow(train)}
                      disabled={isBooked}
                      className="bg-gradient-to-r from-indigo-500 to-accentCyan text-white font-headings font-bold text-sm px-6 py-2.5 rounded-lg shadow-md hover:scale-[1.03] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isBooked ? 'Unavailable' : 'Book Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* OVERLAY MODAL MANAGERS */}
      <SeatMapModal />
      <PaymentModal />
      <TicketModal />
      <AuthRequiredModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </main>
  );
}
