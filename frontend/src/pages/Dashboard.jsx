import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import { Train, MapPin, Loader2, Calendar, ShieldCheck, Navigation, Info, X } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { myBookings, isLoadingBookings, fetchUserBookings } = useContext(BookingContext);
  const navigate = useNavigate();

  const [trackingRoute, setTrackingRoute] = useState(null); // { trainName, stations: [], currentIdx: 0 }
  const [showTrackerModal, setShowTrackerModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUserBookings(user);
    }
  }, [user, navigate]);

  // GPS routing mappings
  const routesGPS = {
    "Noida-Bengaluru": ["Noida", "Agra", "Nagpur", "Secunderabad", "Bengaluru"],
    "Noida-Delhi": ["Noida", "Ghaziabad", "New Delhi"],
    "Mumbai-Agra": ["Mumbai", "Surat", "Ratlam", "Kota", "Agra"],
    "Kolkata-Delhi": ["Howrah", "Patna", "Prayagraj", "Kanpur", "Delhi"],
    "Delhi-Kolkata": ["Delhi", "Kanpur", "Prayagraj", "Patna", "Howrah"]
  };

  const handleTrackTrain = (booking) => {
    // Generate route identifier (from-to)
    const routeKey = `${booking.from}-${booking.to}`;
    let routeNodes = routesGPS[routeKey];
    
    // Fallback if not mapped
    if (!routeNodes) {
      routeNodes = [booking.from, "Junction Hub A", "Junction Hub B", booking.to];
    }

    // Determine mock current location index based on hour of day
    const hour = new Date().getHours();
    const currentIdx = Math.abs(hour % routeNodes.length);

    setTrackingRoute({
      trainName: booking.trainName,
      pnr: booking.pnr,
      stations: routeNodes,
      currentIdx,
    });
    setShowTrackerModal(true);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8 flex-1 w-full animate-fadeIn">
      {/* Background Image Overlay */}
      <div 
        className="bg-overlay-img" 
        style={{ backgroundImage: "url('/old-static-html/assets/images/rail2.jpg')" }} 
      />

      <div className="border-b border-borderGlass pb-4">
        <h1 className="text-3xl font-extrabold tracking-wide text-white font-headings">My Bookings Dashboard</h1>
        <p className="text-textSecondary text-xs sm:text-sm mt-1.5 leading-relaxed">
          Manage your electronic boarding passes, inspect billing fares, and monitor real-time satellite GPS tracking of your journeys.
        </p>
      </div>

      {isLoadingBookings ? (
        <div className="flex justify-center items-center py-20 text-textSecondary gap-2">
          <Loader2 size={24} className="animate-spin text-accentCyan" />
          <span className="font-semibold text-sm">Retrieving your secure reservation logs...</span>
        </div>
      ) : myBookings.length === 0 ? (
        <div className="bg-[#141A2B]/60 border border-dashed border-borderGlass rounded-2xl p-12 text-center flex flex-col items-center gap-4">
          <Train size={48} className="text-textMuted" />
          <div>
            <h3 className="font-headings font-bold text-lg text-white mb-1">No Bookings Found</h3>
            <p className="text-textSecondary text-sm max-w-xs mx-auto leading-relaxed">
              You haven't reserved any tickets yet. Return to the home screen to search journeys and secure seats.
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-2 bg-gradient-to-r from-accentCyan to-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-md hover:scale-102 transition-all duration-200"
          >
            Book A Ticket Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {myBookings.map((booking) => (
            <div 
              key={booking.pnr} 
              className="bg-cardBg border border-borderGlass rounded-2xl p-6 md:p-8 flex flex-col gap-6 hover:border-accentCyan/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Header Details */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accentCyan/10 border border-accentCyan/20 flex items-center justify-center text-accentCyan shadow-sm">
                    <Train size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base leading-tight font-headings">
                      {booking.trainName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-white/5 border border-borderGlass px-2 py-0.5 rounded text-textSecondary font-bold">
                        Class: {booking.selectedClass}
                      </span>
                      <span className="text-[10px] text-textSecondary flex items-center gap-1">
                        <Calendar size={10} className="text-accentCyan" />
                        <span>{booking.journeyDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] text-textSecondary font-bold uppercase tracking-wider">PNR Number</div>
                  <div className="font-bold font-headings text-accentCyan text-sm tracking-wider mt-0.5">
                    {booking.pnr}
                  </div>
                </div>
              </div>

              {/* Journey Path info */}
              <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl flex-col sm:flex-row gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Departure</div>
                  <div className="font-bold text-white text-base font-headings mt-0.5">{booking.departure}</div>
                  <div className="text-xs text-textSecondary font-medium">{booking.from}</div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[9px] text-textMuted font-bold uppercase tracking-wider mb-1">
                    {booking.duration}
                  </span>
                  <div className="w-24 sm:w-32 flex items-center gap-1">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <Navigation size={12} className="text-accentCyan rotate-90" />
                    <div className="h-[1px] bg-white/10 flex-1" />
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Arrival</div>
                  <div className="font-bold text-white text-base font-headings mt-0.5">{booking.arrival}</div>
                  <div className="text-xs text-textSecondary font-medium">{booking.to}</div>
                </div>
              </div>

              {/* Passenger and Fare details */}
              <div className="flex justify-between items-center flex-wrap gap-4 text-xs">
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <span className="text-[9px] text-textMuted uppercase tracking-wider font-bold">Passengers Info</span>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.passengers.map((p, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-textSecondary font-medium">
                        {p.name} ({p.seat}-{p.berth})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto border-t border-white/5 pt-3 sm:pt-0 sm:border-none">
                  <div>
                    <span className="text-[9px] text-textMuted uppercase tracking-wider font-bold block text-right">Fare Paid</span>
                    <span className="font-bold text-accentCyan text-sm">₹{booking.totalFare}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleTrackTrain(booking)}
                    className="bg-[#121B31]/80 border border-accentCyan/30 hover:border-accentCyan hover:bg-accentCyan/10 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Track Train
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRACKER MODAL OVERLAY */}
      {showTrackerModal && trackingRoute && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn">
          <div className="bg-[#141A2B]/90 border border-borderGlass rounded-2xl w-full max-w-lg shadow-2xl glow-indigo transform scale-100 transition-all duration-300 relative flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan to-indigo-500" />

            <div className="p-6 border-b border-borderGlass flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white font-headings">{trackingRoute.trainName}</h3>
                <span className="text-[10px] text-textSecondary font-medium">PNR Tracking: {trackingRoute.pnr}</span>
              </div>
              <button 
                onClick={() => setShowTrackerModal(false)}
                className="text-textSecondary hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col gap-6 items-center">
              <div className="flex items-center gap-1.5 text-accentCyan bg-accentCyan/10 px-3 py-1.5 rounded-full text-xs font-bold border border-accentCyan/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accentCyan animate-ping" />
                <span>Live Satellite Feed Connected</span>
              </div>

              {/* Vertical GPS Path timeline */}
              <div className="flex flex-col gap-10 w-full max-w-xs relative my-4 pl-4">
                {/* Timeline vertical bar */}
                <div className="absolute left-[20px] top-[10px] bottom-[10px] w-[2px] bg-white/10" />

                {trackingRoute.stations.map((station, idx) => {
                  const isCurrent = trackingRoute.currentIdx === idx;
                  const isPassed = idx < trackingRoute.currentIdx;
                  
                  let bulletColor = "bg-[#0d1221] border-white/20";
                  let textColor = "text-textMuted";
                  let note = "";

                  if (isCurrent) {
                    bulletColor = "bg-accentCyan border-accentCyan scale-110 shadow-[0_0_10px_rgba(6,182,212,0.6)]";
                    textColor = "text-white font-extrabold";
                    note = "Current Location (Satellite Lock)";
                  } else if (isPassed) {
                    bulletColor = "bg-indigo-500 border-indigo-500";
                    textColor = "text-textSecondary font-medium line-through decoration-white/10";
                    note = "Passed & Logged";
                  } else {
                    note = "Scheduled Halt";
                  }

                  return (
                    <div key={idx} className="flex items-center gap-6 relative animate-fadeIn">
                      {/* Circle Bullet */}
                      <div className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${bulletColor} transition-all duration-300`} />
                      
                      <div className="flex flex-col">
                        <span className={`text-sm tracking-wide ${textColor}`}>
                          {station}
                        </span>
                        <span className="text-[9px] text-textMuted mt-0.5">{note}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
