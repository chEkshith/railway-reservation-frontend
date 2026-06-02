import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Prefill username from URL query param if present
  useEffect(() => {
    const prefillUser = searchParams.get('username');
    if (prefillUser) {
      setUsername(prefillUser);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const response = await login(username.trim(), password);
    setIsSubmitting(false);

    if (response.success) {
      setSuccess('Login verified. Initializing secure panel...');
      setTimeout(() => {
        navigate('/');
      }, 850);
    } else {
      setError(response.message || 'Invalid username or password credentials.');
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col justify-center flex-1 w-full animate-fadeIn relative z-10">
      {/* Background Image Overlay */}
      <div 
        className="bg-overlay-img" 
        style={{ backgroundImage: "url('/old-static-html/assets/images/rail3.jpg')" }} 
      />

      <div className="bg-cardBg border border-borderGlass rounded-2xl p-8 shadow-2xl relative backdrop-blur-md glow-indigo overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan to-indigo-500" />
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-wide font-headings text-white">Account Login</h2>
          <p className="text-textSecondary text-xs leading-relaxed mt-2 max-w-[280px] mx-auto">
            Gain access to custom PNR histories and rapid bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username Input */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="username" className="text-xs font-bold text-textSecondary uppercase tracking-wider">
              Username
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-4 text-textSecondary pointer-events-none" />
              <input 
                type="text" 
                id="username" 
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="password" className="text-xs font-bold text-textSecondary uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-4 text-textSecondary pointer-events-none" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-12 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-textSecondary hover:text-white transition-colors"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember & Forget */}
          <div className="flex justify-between items-center text-xs text-textSecondary mt-1 select-none">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="rounded border-borderGlass bg-[#121B31]/40 text-accentCyan focus:ring-accentCyan focus:ring-opacity-25" />
              <span>Remember Me</span>
            </label>
            <a href="#" className="text-accentCyan hover:underline transition-all">Forgot Credentials?</a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Authenticating...' : 'Secure Login'}
          </button>

          {/* Error / Success Feedback */}
          {error && (
            <div className="flex items-center gap-2 mt-2 p-3 bg-accentRose/10 border border-accentRose/20 text-accentRose text-xs rounded-lg animate-fadeIn">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-2 p-3 bg-accentEmerald/10 border border-accentEmerald/20 text-accentEmerald text-xs rounded-lg text-center font-semibold animate-fadeIn">
              {success}
            </div>
          )}
        </form>

        {/* Toggle to Signup Page */}
        <div className="text-center text-xs text-textSecondary mt-8 pt-4 border-t border-white/5">
          New to RailPass?{' '}
          <Link to="/signup" className="text-accentCyan font-bold hover:underline">
            Create Account Here
          </Link>
        </div>
      </div>
    </main>
  );
}
