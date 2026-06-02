import React, { useContext, useRef } from 'react';
import { BookingContext } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { X, Printer, Calendar, Train, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function TicketModal() {
  const { 
    showTicketModal, 
    setShowTicketModal, 
    confirmedTicket, 
    resetBookingFlow 
  } = useContext(BookingContext);

  const printRef = useRef(null);
  const navigate = useNavigate();

  if (!showTicketModal || !confirmedTicket) return null;

  const ticket = confirmedTicket;

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Direct window print support
    document.body.innerHTML = `
      <div style="background-color: white; color: black; padding: 2rem; font-family: sans-serif;">
        ${printContent}
      </div>
    `;
    window.print();
    // Restore original window
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleClose = () => {
    setShowTicketModal(false);
    resetBookingFlow();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#141A2B]/90 border border-borderGlass rounded-2xl w-full max-w-2xl shadow-2xl glow-indigo transform scale-100 transition-all duration-300 relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan to-indigo-500" />

        <div className="p-6 border-b border-borderGlass flex justify-between items-center">
          <h3 className="text-xl font-bold text-white font-headings">Electronic Boarding Ticket</h3>
          <button 
            onClick={handleClose}
            className="text-textSecondary hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6" ref={printRef}>
          <div className="bg-[#182033] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col gap-6 text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accentCyan/5 rounded-full blur-xl" />
            
            {/* Ticket Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Train className="text-accentCyan" size={24} />
                <div>
                  <h4 className="font-headings font-extrabold text-base tracking-wide text-white">INDIAN RAILWAYS</h4>
                  <p className="text-[10px] text-textSecondary uppercase tracking-widest">Boarding Pass Portal</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">PNR Number</div>
                <div className="font-headings font-extrabold text-accentCyan text-lg tracking-wider mt-0.5">
                  {ticket.pnr}
                </div>
              </div>
            </div>

            {/* Travel Path Block */}
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-lg">
              <div className="text-center min-w-[100px]">
                <div className="text-xs text-textSecondary font-medium uppercase">Departure</div>
                <div className="text-lg font-bold mt-1 font-headings text-white">{ticket.departure}</div>
                <div className="text-sm font-semibold text-textSecondary mt-0.5">{ticket.from}</div>
              </div>

              <div className="flex-1 flex flex-col items-center px-4">
                <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider mb-1">
                  {ticket.duration}
                </span>
                <div className="w-full flex items-center justify-center gap-1.5">
                  <div className="h-[2px] bg-white/10 flex-1 relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 absolute top-[-2px] left-0" />
                  </div>
                  <ArrowRight size={14} className="text-accentCyan" />
                  <div className="h-[2px] bg-white/10 flex-1 relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 absolute top-[-2px] right-0" />
                  </div>
                </div>
                <span className="text-[9px] text-accentCyan uppercase font-semibold tracking-wider mt-1.5">
                  Class: {ticket.selectedClass}
                </span>
              </div>

              <div className="text-center min-w-[100px]">
                <div className="text-xs text-textSecondary font-medium uppercase">Arrival</div>
                <div className="text-lg font-bold mt-1 font-headings text-white">{ticket.arrival}</div>
                <div className="text-sm font-semibold text-textSecondary mt-0.5">{ticket.to}</div>
              </div>
            </div>

            {/* General Trip Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-textSecondary uppercase tracking-wider text-[9px]">Train Name / Number</span>
                <span className="font-semibold text-white truncate" title={ticket.trainName}>
                  {ticket.trainName}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-textSecondary uppercase tracking-wider text-[9px]">Date of Journey</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <Calendar size={12} className="text-accentCyan" />
                  <span>{ticket.journeyDate}</span>
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <span className="text-textSecondary uppercase tracking-wider text-[9px]">Booking Status</span>
                <span className="font-semibold text-accentEmerald flex items-center gap-1 uppercase tracking-wide">
                  <ShieldCheck size={12} />
                  <span>Paid & Confirmed</span>
                </span>
              </div>
            </div>

            {/* Passenger Tables */}
            <div className="flex flex-col gap-3">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-textSecondary border-b border-white/5 pb-1">
                Passenger / Berth Information
              </h5>
              
              <div className="flex flex-col gap-2">
                {ticket.passengers.map((pass, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/[0.01] border border-white/5 px-4 py-2.5 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck size={12} className="text-textSecondary" />
                      <span className="font-semibold text-white">{pass.name}</span>
                      <span className="text-textSecondary font-medium">({pass.age} Yrs)</span>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-textSecondary text-[9px] uppercase mr-1.5">Seat</span>
                        <span className="font-bold text-accentCyan">{pass.seat}</span>
                      </div>
                      <div>
                        <span className="text-textSecondary text-[9px] uppercase mr-1.5">Berth</span>
                        <span className="font-bold text-accentCyan uppercase">{pass.berth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barcode Mock Design / Verification section */}
            <div className="border-t border-white/5 pt-6 mt-2 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <span className="text-[9px] text-textMuted uppercase tracking-wider">Boarding Security Verification</span>
                {/* Horizontal barcode stripes */}
                <div className="flex gap-[2px] h-8 items-stretch select-none mt-1 opacity-70">
                  <div className="w-[1px] bg-white" />
                  <div className="w-[2px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[3px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[2px] bg-white" />
                  <div className="w-[4px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[3px] bg-white" />
                  <div className="w-[2px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[4px] bg-white" />
                  <div className="w-[2px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[3px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[2px] bg-white" />
                  <div className="w-[4px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[2px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[3px] bg-white" />
                  <div className="w-[1px] bg-white" />
                  <div className="w-[2px] bg-white" />
                  <div className="w-[4px] bg-white" />
                </div>
              </div>
              
              <div className="text-center sm:text-right">
                <span className="text-[9px] text-textSecondary uppercase tracking-wider">Total Ticket Fare</span>
                <div className="text-xl font-extrabold text-accentCyan mt-0.5">₹{ticket.totalFare}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-6 border-t border-borderGlass flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-white/5 border border-borderGlass text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <Printer size={16} />
            <span>Print Ticket</span>
          </button>
          <button 
            onClick={handleClose}
            className="flex-1 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl hover:opacity-95 hover:scale-[1.01] transition-all duration-200 text-center"
          >
            Go to Bookings Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
