import React, { useContext, useState, useEffect } from 'react';
import { BookingContext } from '../context/BookingContext';
import { X, CreditCard, QrCode } from 'lucide-react';

export default function PaymentModal() {
  const { 
    showPaymentModal, 
    setShowPaymentModal, 
    activeBooking, 
    createBooking, 
    setShowTicketModal,
    resetBookingFlow
  } = useContext(BookingContext);

  const [activeTab, setActiveTab] = useState('card'); // card | upi
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // Card inputs
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState('CARD');

  if (!showPaymentModal || !activeBooking.train) return null;

  const totalCost = activeBooking.totalFare;

  // Sync Card numbers spacing
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += value[i];
    }
    setCardNum(formatted);

    // Determine Card Brand
    if (value.startsWith('4')) {
      setCardBrand('VISA');
    } else if (value.startsWith('5')) {
      setCardBrand('MASTERCARD');
    } else {
      setCardBrand('CARD');
    }
  };

  // Sync Expiry input format
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      setCardExp(value.slice(0, 2) + "/" + value.slice(2, 4));
    } else {
      setCardExp(value);
    }
  };

  const executePayment = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    const statuses = [
      'Establishing secure handshakes with banking node...',
      'Verifying seat availability and reservations locks...',
      'Authorizing gateway merchant ledger entries...',
      'Booking finalized. Printing electronic boarding ticket...'
    ];

    let currentStep = 0;
    setLoadingStatus(statuses[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statuses.length) {
        setLoadingStatus(statuses[currentStep]);
      } else {
        clearInterval(interval);
      }
    }, 550);

    // Backend Submission
    setTimeout(async () => {
      const response = await createBooking({
        trainNumber: activeBooking.train.trainNumber,
        trainName: activeBooking.train.trainName,
        from: activeBooking.train.from,
        to: activeBooking.train.to,
        departure: activeBooking.train.departure,
        arrival: activeBooking.train.arrival,
        duration: activeBooking.train.duration,
        journeyDate: activeBooking.journeyDate,
        selectedClass: activeBooking.selectedClass,
        passengers: activeBooking.passengers,
        selectedSeats: activeBooking.selectedSeats,
        totalFare: activeBooking.totalFare
      });

      setLoading(false);
      if (response.success) {
        setShowPaymentModal(false);
        setShowTicketModal(true);
      } else {
        alert(response.message || 'Payment processing failed. Try again.');
      }
    }, 2400);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#141A2B]/90 border border-borderGlass rounded-2xl w-full max-w-lg shadow-2xl glow-indigo transform scale-100 transition-all duration-300 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan to-indigo-500" />

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-6 min-h-[380px] animate-fadeIn">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute border-4 border-t-accentCyan border-r-transparent border-b-transparent border-l-transparent w-16 h-16 rounded-full animate-spin" />
              <div className="absolute border-4 border-t-transparent border-r-indigo-500 border-b-transparent border-l-transparent w-12 h-12 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Processing Payment</h3>
              <p className="text-xs text-textSecondary italic animate-pulse max-w-xs mx-auto leading-relaxed">
                {loadingStatus}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-borderGlass flex justify-between items-center">
              <h3 className="text-xl font-bold text-white font-headings">Secure Checkout Gate</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-textSecondary hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Payment Methods Tab */}
              <div className="flex bg-[#0d1221] p-1.5 rounded-xl border border-borderGlass">
                <button
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    activeTab === 'card' 
                      ? 'bg-accentCyan/15 text-accentCyan border border-accentCyan/20 shadow-sm' 
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Credit/Debit Card</span>
                </button>
                <button
                  onClick={() => setActiveTab('upi')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    activeTab === 'upi' 
                      ? 'bg-accentCyan/15 text-accentCyan border border-accentCyan/20 shadow-sm' 
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <QrCode size={16} />
                  <span>UPI Scan Payment</span>
                </button>
              </div>

              {/* CARD PAYMENT INTERFACE */}
              {activeTab === 'card' && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  {/* Digital Simulated Card Component */}
                  <div className="h-44 w-full bg-gradient-to-br from-slate-800 to-indigo-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl select-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accentCyan/10 rounded-full blur-2xl" />
                    
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-9 bg-amber-400/25 border border-amber-400/40 rounded-md relative flex items-center justify-center">
                        <div className="w-8 h-6 border-r border-b border-amber-400/30 absolute top-1 left-1" />
                        <div className="w-8 h-6 border-l border-t border-amber-400/30 absolute bottom-1 right-1" />
                      </div>
                      <span className="font-headings font-extrabold italic text-sm tracking-widest text-white/70">
                        {cardBrand}
                      </span>
                    </div>

                    <div className="font-headings font-semibold text-lg text-white tracking-widest text-center my-3 opacity-90">
                      {cardNum || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-center text-[10px] uppercase text-white/50 tracking-wider">
                      <div>
                        <div className="text-[7px]">Cardholder</div>
                        <div className="font-bold text-white/80 text-xs mt-0.5 truncate max-w-[150px]">
                          {cardName.toUpperCase() || 'Your Name'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[7px]">Expiry</div>
                        <div className="font-bold text-white/80 text-xs mt-0.5">
                          {cardExp || 'MM/YY'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card input details */}
                  <form onSubmit={executePayment} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                        Card Number
                      </label>
                      <input 
                        type="text" 
                        placeholder="•••• •••• •••• ••••"
                        maxLength="19"
                        value={cardNum}
                        onChange={handleCardNumberChange}
                        required
                        className="bg-[#121B31]/40 border border-borderGlass rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-accentCyan/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                        Cardholder Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g., Rajesh Kumar"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="bg-[#121B31]/40 border border-borderGlass rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-accentCyan/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                          Expiry Date (MM/YY)
                        </label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardExp}
                          onChange={handleExpiryChange}
                          required
                          className="bg-[#121B31]/40 border border-borderGlass rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-accentCyan/50 text-center"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
                          CVV Security Code
                        </label>
                        <input 
                          type="password" 
                          placeholder="•••"
                          maxLength="3"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/gi, ''))}
                          required
                          className="bg-[#121B31]/40 border border-borderGlass rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-accentCyan/50 text-center"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-4 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-100 transition-all duration-200"
                    >
                      Pay ₹{totalCost}
                    </button>
                  </form>
                </div>
              )}

              {/* UPI QR SCANNER INTERFACE */}
              {activeTab === 'upi' && (
                <div className="flex flex-col items-center gap-6 py-4 text-center animate-fadeIn">
                  <p className="text-xs text-textSecondary leading-relaxed max-w-sm">
                    Scan the secure UPI QR code using BHIM, Google Pay, PhonePe, or Paytm apps to finalize your booking reservation.
                  </p>

                  <div className="bg-white p-4 rounded-2xl border border-white/20 shadow-xl flex items-center justify-center w-48 h-48 select-none">
                    {/* SVG Vector QR Code mock */}
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
                      <rect width="100" height="100" fill="white" />
                      {/* Top Left Square */}
                      <rect x="5" y="5" width="25" height="25" />
                      <rect x="9" y="9" width="17" height="17" fill="white" />
                      <rect x="13" y="13" width="9" height="9" />
                      
                      {/* Top Right Square */}
                      <rect x="70" y="5" width="25" height="25" />
                      <rect x="74" y="9" width="17" height="17" fill="white" />
                      <rect x="78" y="13" width="9" height="9" />
                      
                      {/* Bottom Left Square */}
                      <rect x="5" y="70" width="25" height="25" />
                      <rect x="9" y="74" width="17" height="17" fill="white" />
                      <rect x="13" y="78" width="9" height="9" />

                      {/* Random QR pixels */}
                      <rect x="35" y="5" width="5" height="15" />
                      <rect x="45" y="10" width="10" height="5" />
                      <rect x="60" y="5" width="5" height="25" />
                      <rect x="35" y="25" width="15" height="5" />
                      <rect x="55" y="25" width="5" height="10" />

                      <rect x="5" y="35" width="15" height="5" />
                      <rect x="25" y="35" width="10" height="10" />
                      <rect x="40" y="35" width="5" height="15" />
                      <rect x="50" y="40" width="20" height="5" />
                      <rect x="80" y="35" width="15" height="10" />

                      <rect x="5" y="50" width="10" height="10" />
                      <rect x="20" y="55" width="5" height="10" />
                      <rect x="30" y="50" width="20" height="5" />
                      <rect x="65" y="45" width="10" height="20" />
                      <rect x="85" y="50" width="5" height="15" />

                      <rect x="35" y="60" width="15" height="5" />
                      <rect x="55" y="60" width="5" height="15" />
                      <rect x="75" y="60" width="20" height="5" />

                      <rect x="35" y="75" width="10" height="10" />
                      <rect x="50" y="70" width="5" height="25" />
                      <rect x="60" y="80" width="25" height="5" />
                      <rect x="65" y="90" width="15" height="5" />
                      <rect x="85" y="85" width="10" height="10" />
                    </svg>
                  </div>

                  <div className="flex flex-col gap-1 w-full max-w-sm mt-2">
                    <div className="flex justify-between items-center text-xs text-textSecondary bg-white/5 border border-borderGlass p-3 rounded-lg">
                      <span>Total Amount:</span>
                      <span className="font-extrabold text-accentCyan text-sm">₹{totalCost}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => executePayment()}
                    className="w-full max-w-sm mt-4 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-100 transition-all duration-200"
                  >
                    Simulate Successful Scan
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
