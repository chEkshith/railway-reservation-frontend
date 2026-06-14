import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#04060c] border-t border-borderGlass pt-12 pb-6 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="flex flex-col gap-3">
          <h4 className="text-xl font-bold text-white tracking-wide">RailPass</h4>
          <p className="text-textSecondary text-sm leading-relaxed max-w-sm">
            A next-generation, high-performance web platform designed to streamline national railway ticket distribution with absolute visual precision and speed.
          </p>
          {/* <p className="text-textMuted text-xs mt-2">Made by Group No.3 | Production Ready</p> */}
        </div>

        <div className="flex flex-col gap-3">
          <h5 className="text-sm font-bold uppercase tracking-wider text-accentCyan">Quick Portals</h5>
          <ul className="flex flex-col gap-2 text-sm text-textSecondary">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Search Journeys</Link>
            </li>
            <li>
              <Link to="/train-info" className="hover:text-white transition-colors">Train Information</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">Member Access</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h5 className="text-sm font-bold uppercase tracking-wider text-accentCyan">Legal & Safety</h5>
          <ul className="flex flex-col gap-2 text-sm text-textSecondary">
            <li>
              <a href="#" className="hover:text-white transition-colors">Privacy Framework</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Terms of Carriage</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Refund Guidelines</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-textMuted gap-4">
        <p>&copy; 2026 RailPass Reservation. Designed for absolute production standards.</p>
        {/* <p>System Online: 99.9% SLA</p> */}
      </div>
    </footer>
  );
}
