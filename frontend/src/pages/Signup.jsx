import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, Mail, ShieldAlert } from 'lucide-react';

export default function Signup() {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Reset validations
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const response = await register(username.trim(), email.trim(), password);
    setIsSubmitting(false);

    if (response.success) {
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(`/login?username=${encodeURIComponent(response.username)}`);
      }, 1250);
    } else {
      setError(response.message || 'Registration failed. Try again.');
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
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-wide font-headings text-white">Create Account</h2>
          <p className="text-textSecondary text-xs leading-relaxed mt-2 max-w-[300px] mx-auto">
            Join RailPass to manage bookings, track real-time trains, and access custom seat maps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
              Username
            </label>
            <div className="relative flex items-center">
              <User size={15} className="absolute left-4 text-textSecondary pointer-events-none" />
              <input 
                type="text" 
                id="username" 
                placeholder="Enter Username"
                minLength="3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={15} className="absolute left-4 text-textSecondary pointer-events-none" />
              <input 
                type="email" 
                id="email" 
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-4 text-textSecondary pointer-events-none" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                placeholder="Min 6 characters"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-12 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-textSecondary hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm-password" className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-4 text-textSecondary pointer-events-none" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirm-password" 
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-12 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-textSecondary hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="text-[10px] text-textSecondary leading-normal mt-1.5">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-accentCyan hover:underline">Terms of Carriage</a> and{' '}
            <a href="#" className="text-accentCyan hover:underline">Privacy Policy</a>.
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Registering...' : 'Register Account'}
          </button>

          {/* Feedback */}
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

        {/* Toggle to Login Page */}
        <div className="text-center text-xs text-textSecondary mt-6 pt-4 border-t border-white/5">
          Already registered?{' '}
          <Link to="/login" className="text-accentCyan font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </main>
  );
}
