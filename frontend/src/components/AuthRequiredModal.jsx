import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, X } from 'lucide-react';

export default function AuthRequiredModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fadeIn">
      <div className="bg-[#141A2B]/90 border border-borderGlass rounded-2xl w-full max-w-md shadow-2xl glow-indigo transform scale-100 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan to-indigo-500" />
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-textSecondary hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center flex flex-col items-center gap-4 mt-4">
          <div className="w-16 h-16 rounded-full bg-accentCyan/10 flex items-center justify-center text-accentCyan border border-accentCyan/20 mb-2">
            <Lock size={32} />
          </div>

          <h3 className="text-xl font-bold text-white tracking-wide">Member Authentication Required</h3>
          <p className="text-textSecondary text-sm leading-relaxed max-w-xs">
            To secure seat maps, execute payments, and store active ticket boards, please sign up or log in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
            <Link 
              to="/login"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-accentCyan text-white text-center font-bold py-3 rounded-lg shadow-md hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
            >
              Log In
            </Link>
            <Link 
              to="/signup"
              onClick={onClose}
              className="flex-1 bg-white/5 border border-borderGlass text-white text-center font-bold py-3 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
