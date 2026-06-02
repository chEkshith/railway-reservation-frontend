import React, { useContext, useState, useEffect } from 'react';
import { BookingContext } from '../context/BookingContext';
import { X, Check } from 'lucide-react';

export default function SeatMapModal() {
  const { 
    showSeatModal, 
    setShowSeatModal, 
    activeBooking, 
    setActiveBooking, 
    setShowPaymentModal 
  } = useContext(BookingContext);

  const [passengerDetails, setPassengerDetails] = useState({});

  if (!showSeatModal || !activeBooking.train) return null;

  const { train, selectedClass, journeyDate } = activeBooking;

  // Class Multipliers
  const getClassMultiplierFare = (baseFare, travelClass) => {
    let multiplier = 1.0;
    if (travelClass === "1A") multiplier = 2.4;
    else if (travelClass === "2A") multiplier = 1.6;
    else if (travelClass === "3A") multiplier = 1.25;
    else if (travelClass === "CC") multiplier = 1.1;
    else if (travelClass === "SL") multiplier = 0.6;
    return Math.round(baseFare * multiplier);
  };

  const perSeatFare = getClassMultiplierFare(train.fare, selectedClass);
  const totalCost = perSeatFare * activeBooking.selectedSeats.length;

  const handleSeatClick = (seatNum, berthName) => {
    const isAlreadySelected = activeBooking.selectedSeats.some(s => s.num === seatNum);

    if (isAlreadySelected) {
      setActiveBooking(prev => ({
        ...prev,
        selectedSeats: prev.selectedSeats.filter(s => s.num !== seatNum)
      }));
      // Remove passenger fields
      const updatedDetails = { ...passengerDetails };
      delete updatedDetails[seatNum];
      setPassengerDetails(updatedDetails);
    } else {
      if (activeBooking.selectedSeats.length >= 6) {
        alert("Passenger booking limit reached: Maximum 6 seats per transaction.");
        return;
      }
      setActiveBooking(prev => ({
        ...prev,
        selectedSeats: [...prev.selectedSeats, { num: seatNum, berth: berthName }]
      }));
      // Initialize passenger fields
      setPassengerDetails(prev => ({
        ...prev,
        [seatNum]: { name: '', age: '' }
      }));
    }
  };

  const handlePassengerChange = (seatNum, field, val) => {
    setPassengerDetails(prev => ({
      ...prev,
      [seatNum]: {
        ...prev[seatNum],
        [field]: val
      }
    }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    
    // Validate passenger fields
    let isValid = true;
    const passengersList = [];

    activeBooking.selectedSeats.forEach(seat => {
      const details = passengerDetails[seat.num];
      if (!details || !details.name.trim() || !details.age) {
        isValid = false;
      } else {
        passengersList.push({
          name: details.name.trim(),
          age: parseInt(details.age),
          seat: seat.num,
          berth: seat.berth
        });
      }
    });

    if (!isValid) {
      alert("Please enter full details for all passengers matching the selected coach seats.");
      return;
    }

    setActiveBooking(prev => ({
      ...prev,
      passengers: passengersList,
      totalFare: totalCost
    }));

    // Proceed to Payment Modal
    setShowSeatModal(false);
    setShowPaymentModal(true);
  };

  const berths = ["LB", "MB", "UB", "SL", "SU"];
  const seats = [];

  // Generate 24 seats (comp S3 Sleeper layout)
  for (let sNum = 1; sNum <= 24; sNum++) {
    const berthName = berths[(sNum - 1) % berths.length];
    // Mock booked seats (seeded deterministically)
    const isBooked = (sNum * 7) % 10 < 3;
    seats.push({ num: sNum, berth: berthName, isBooked });
  }

  // Sort selected seats by seat number
  const sortedSelected = [...activeBooking.selectedSeats].sort((a, b) => a.num - b.num);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#141A2B]/90 border border-borderGlass rounded-2xl w-full max-w-4xl shadow-2xl glow-indigo transform scale-100 transition-all duration-300 relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan to-indigo-500" />
        
        <div className="p-6 border-b border-borderGlass flex justify-between items-center">
          <h3 className="text-xl font-bold text-white font-headings">Coach Map & Seat Selection</h3>
          <button 
            onClick={() => setShowSeatModal(false)}
            className="text-textSecondary hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Virtual Coach Grid Layout */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white/5 border border-borderGlass p-6 rounded-xl">
              <div className="text-center font-headings text-sm text-textSecondary mb-6 font-semibold uppercase tracking-wider">
                Coach Sleeper Grid - Compartment S3
              </div>
              
              {/* Virtual Train Corridor layout */}
              <div className="grid grid-cols-5 gap-2 select-none relative">
                {seats.map((seat, index) => {
                  const isSelected = activeBooking.selectedSeats.some(s => s.num === seat.num);
                  const showAisle = index > 0 && index % 4 === 2;

                  return (
                    <React.Fragment key={seat.num}>
                      {showAisle && (
                        <div className="col-span-5 h-4 flex items-center justify-center text-[10px] text-textMuted font-bold uppercase tracking-widest border-t border-b border-dashed border-white/5 my-1">
                          Aisle Way
                        </div>
                      )}
                      <div 
                        onClick={() => !seat.isBooked && handleSeatClick(seat.num, seat.berth)}
                        className={`h-14 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border ${
                          seat.isBooked 
                            ? 'bg-accentRose/10 border-accentRose/20 text-accentRose/50 cursor-not-allowed'
                            : isSelected
                              ? 'bg-accentCyan/20 border-accentCyan text-accentCyan shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                              : 'bg-white/[0.02] border-borderGlass text-textSecondary hover:border-accentCyan/40 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="text-xs font-bold">{seat.num}</span>
                        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-85">{seat.berth}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Seat Selection Legend */}
              <div className="flex gap-6 mt-8 text-xs text-textSecondary justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/[0.02] border border-borderGlass" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accentCyan/20 border border-accentCyan" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accentRose/10 border border-accentRose/20" />
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary and Passenger inputs */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="border-b border-borderGlass pb-3">
              <h3 className="text-lg font-bold text-white font-headings">Selected Class: {selectedClass}</h3>
              <p className="text-xs text-textSecondary">Fare multiplier configured for this class choice.</p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-[#1c2438]/50 border border-borderGlass p-5 rounded-xl flex flex-col gap-3.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">Train Name</span>
                <span className="font-semibold text-white text-right max-w-[150px] truncate" title={train.trainName}>
                  {train.trainName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">Class Selected</span>
                <span className="font-semibold text-accentCyan">{selectedClass}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">Date of Journey</span>
                <span className="font-semibold text-white">{journeyDate || 'Not Configured'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">Base Seat Price</span>
                <span className="font-semibold text-white">₹{perSeatFare}</span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-borderGlass pt-3 mt-1">
                <span className="text-textSecondary">Selected Seats</span>
                <span className="font-bold text-accentCyan max-w-[150px] truncate text-right">
                  {sortedSelected.length > 0 
                    ? sortedSelected.map(s => `${s.num} (${s.berth})`).join(', ') 
                    : 'None Selected'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary font-bold text-base">Total Cost</span>
                <span className="font-extrabold text-lg text-accentCyan">₹{totalCost}</span>
              </div>
            </div>

            {/* Passenger Forms */}
            <form onSubmit={handleConfirm} className="flex-1 flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary mt-2">
                Passenger Details
              </h4>

              <div className="flex-1 overflow-y-auto max-h-[220px] flex flex-col gap-3 pr-1.5">
                {sortedSelected.length === 0 ? (
                  <p className="text-xs text-textMuted italic py-4">
                    Select seats inside the virtual coach to add passenger details...
                  </p>
                ) : (
                  sortedSelected.map((seat, index) => (
                    <div key={seat.num} className="flex gap-2 items-center bg-white/[0.01] border border-borderGlass p-3 rounded-lg animate-fadeIn">
                      <div className="flex-1 min-w-0">
                        <input 
                          type="text" 
                          placeholder={`Passenger ${index + 1} Name (Seat ${seat.num})`}
                          value={passengerDetails[seat.num]?.name || ''}
                          onChange={(e) => handlePassengerChange(seat.num, 'name', e.target.value)}
                          required
                          className="w-full bg-[#121B31]/30 border border-borderGlass rounded-md px-3 py-1.5 text-xs text-textPrimary outline-none focus:border-accentCyan/50"
                        />
                      </div>
                      <div className="w-16 flex-shrink-0">
                        <input 
                          type="number" 
                          placeholder="Age"
                          min="1"
                          max="120"
                          value={passengerDetails[seat.num]?.age || ''}
                          onChange={(e) => handlePassengerChange(seat.num, 'age', e.target.value)}
                          required
                          className="w-full bg-[#121B31]/30 border border-borderGlass rounded-md px-2 py-1.5 text-xs text-textPrimary outline-none focus:border-accentCyan/50 text-center"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button 
                type="submit"
                disabled={sortedSelected.length === 0}
                className="w-full mt-4 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Check size={18} />
                <span>Confirm Booking</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
