import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-opacity-70 bg-[#060913] backdrop-blur-md border-b border-borderGlass">
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4 w-full">
        <Link to="/" className="flex items-center gap-2 font-headings text-2xl font-extrabold tracking-tight bg-gradient-to-r from-accentCyan to-indigo-500 bg-clip-text text-transparent">
          <svg className="w-8 h-8 fill-accentCyan drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" viewBox="0 0 24 24">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm0 2c3.5 0 6 .5 6 2H6c0-1.5 2.5-2 6-2zm5 11.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-8 0c0 .83-.67 1.5-1.5 1.5S6 16.33 6 15.5 6.67 14 7.5 14s1.5.67 1.5 1.5zM17 11H7V8h10v3z"/>
          </svg>
          <span>RailPass</span>
        </Link>

        <ul className="flex items-center gap-6">
          <li>
            <Link 
              to="/" 
              className={`font-semibold text-sm transition-all duration-300 relative py-1 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-accentCyan after:to-indigo-500 after:transition-all after:duration-300 ${
                isActive('/') ? 'text-accentCyan after:w-full' : 'text-textSecondary after:w-0 hover:after:w-full'
              }`}
            >
              Home
            </Link>
          </li>
          
          {user && (
            <li>
              <Link 
                to="/dashboard" 
                className={`font-semibold text-sm transition-all duration-300 relative py-1 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-accentCyan after:to-indigo-500 after:transition-all after:duration-300 ${
                  isActive('/dashboard') ? 'text-accentCyan after:w-full' : 'text-textSecondary after:w-0 hover:after:w-full'
                }`}
              >
                My Bookings
              </Link>
            </li>
          )}

          <li>
            <Link 
              to="/train-info" 
              className={`font-semibold text-sm transition-all duration-300 relative py-1 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-accentCyan after:to-indigo-500 after:transition-all after:duration-300 ${
                isActive('/train-info') ? 'text-accentCyan after:w-full' : 'text-textSecondary after:w-0 hover:after:w-full'
              }`}
            >
              Train Info
            </Link>
          </li>

          <li>
            {user ? (
              <div className="flex items-center gap-3 bg-white bg-opacity-[0.04] border border-borderGlass px-4 py-1.5 rounded-full hover:bg-opacity-[0.08] hover:border-accentCyan/50 transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accentCyan to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {user.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-textPrimary max-w-[100px] truncate">Welcome, {user}</span>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }} 
                  title="Logout"
                  className="text-accentRose hover:text-red-400 p-0.5 rounded transition-colors"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-indigo-500 to-accentCyan text-white text-xs font-bold px-5 py-2 rounded-full shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_18px_rgba(99,102,241,0.4)] hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
