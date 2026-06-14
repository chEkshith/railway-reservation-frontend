import  { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, Mail, ShieldAlert } from 'lucide-react';

export default function Auth() {
  const { login, register, user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode state: true = Login View, false = Signup View
  const [isLoginView, setIsLoginView] = useState(true);

  // Form Field States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewToggle = (targetMode) => {
    setIsLoginView(targetMode);
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const prefillUser = searchParams.get('username');
    if (prefillUser) {
      setLoginUsername(prefillUser);
    }
  }, [searchParams]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const response = await login(loginUsername.trim(), loginPassword);
    setIsSubmitting(false);

    if (response.success) {
      setSuccess('Login verified. Initializing secure panel...');
      setTimeout(() => navigate('/'), 850);
    } else {
      setError(response.message || 'Invalid credentials.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const response = await register(regUsername.trim(), regEmail.trim(), regPassword);
    setIsSubmitting(false);

    if (response.success) {
      setSuccess('Registered successfully! Switching to login...');
      setLoginUsername(response.username);
      setTimeout(() => {
        handleViewToggle(true);
      }, 1250);
    } else {
      setError(response.message || 'Registration failed.');
    }
  };

  return (
    <main className="w-full min-h-[85vh] flex items-center justify-center p-4 relative z-10 font-sans">
      {/* Background Image Frame */}
      <div 
        className="bg-overlay-img" 
        style={{ backgroundImage: "url('/old-static-html/assets/images/rail3.jpg')" }} 
      />

      {/* Main Structural Shell Container */}
      <div className="relative w-full max-w-[850px] min-h-[550px] bg-cardBg border border-borderGlass rounded-2xl shadow-2xl backdrop-blur-md glow-indigo overflow-hidden grid grid-cols-2 max-md:flex max-md:flex-col">
        
        {/* MOVING ACTION OVERLAY LAYER (Occupies exactly 50% width now) */}
        <div
          className={`absolute top-0 bottom-0 z-30 w-1/2 bg-gradient-to-b from-[#16223F] to-[#0F1626] border-r border-l border-borderGlass p-8 flex flex-col justify-center items-center text-center transition-transform duration-700 ease-in-out max-md:hidden ${
            isLoginView ? 'translate-x-full border-l-borderGlass' : 'translate-x-0 border-r-borderGlass'
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-accentCyan to-indigo-500" />
          
          {isLoginView ? (
            <div className="flex flex-col items-center px-4 animate-fadeIn">
              <h3 className="text-2xl font-headings font-bold text-white tracking-wide">New to RailPass?</h3>
              <p className="text-textSecondary text-xs leading-relaxed mt-3 max-w-[240px]">
                Create a terminal profile to unlock live seat mapping routes.
              </p>
              <button
                type="button"
                onClick={() => handleViewToggle(false)}
                className="mt-8 px-6 py-2.5 rounded-xl border border-accentCyan text-accentCyan font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-accentCyan hover:text-white glow-cyan active:scale-95 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 animate-fadeIn">
              <h3 className="text-2xl font-headings font-bold text-white tracking-wide">Secure Link</h3>
              <p className="text-textSecondary text-xs leading-relaxed mt-3 max-w-[240px]">
                Already possess active infrastructure clearance configurations?
              </p>
              <button
                type="button"
                onClick={() => handleViewToggle(true)}
                className="mt-8 px-6 py-2.5 rounded-xl border border-indigo-400 text-indigo-400 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-indigo-500 hover:text-white active:scale-95 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* LEFT COMPARTMENT: SIGN IN FORM PANEL */}
        <div
          className={`w-full p-8 flex flex-col justify-center transition-all duration-500 max-md:order-1 ${
            isLoginView 
              ? 'opacity-100 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 scale-95 z-10 pointer-events-none max-md:hidden'
          }`}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-wide font-headings text-white">Account Login</h2>
            <p className="text-textSecondary text-xs mt-1">Gain access to custom PNR histories.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Username</label>
              <div className="relative flex items-center">
                <User size={15} className="absolute left-4 text-textSecondary" />
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                  className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock size={15} className="absolute left-4 text-textSecondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-100 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <p className="text-center text-xs text-textSecondary mt-6 md:hidden">
            New to RailPass?{' '}
            <button type="button" onClick={() => handleViewToggle(false)} className="text-accentCyan font-bold underline ml-1 cursor-pointer">Register Account</button>
          </p>
        </div>

        {/* RIGHT COMPARTMENT: SIGN UP FORM PANEL */}
        <div
          className={`w-full p-8 flex flex-col justify-center transition-all duration-500 max-md:order-2 ${
            !isLoginView 
              ? 'opacity-100 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 scale-95 z-10 pointer-events-none max-md:hidden'
          }`}
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-wide font-headings text-white">Create Account</h2>
            <p className="text-textSecondary text-xs mt-1">Join RailPass to monitor pathways.</p>
          </div>

          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Username</label>
              <div className="relative flex items-center">
                <User size={14} className="absolute left-4 text-textSecondary" />
                <input
                  type="text"
                  placeholder="Enter Username"
                  minLength="3"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                  className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-4 text-textSecondary" />
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-4 text-textSecondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  minLength="6"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-12 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-textSecondary">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-4 text-textSecondary" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-[#121B31]/40 border border-borderGlass rounded-lg py-2.5 pl-12 pr-12 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/75"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 text-textSecondary">
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-accentCyan to-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-100 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Registering...' : 'Register Account'}
            </button>
          </form>

          <p className="text-center text-xs text-textSecondary mt-5 md:hidden">
            Already registered?{' '}
            <button type="button" onClick={() => handleViewToggle(true)} className="text-accentCyan font-bold underline ml-1 cursor-pointer">Sign In Here</button>
          </p>
        </div>

        {/* FEEDBACK ERROR BOX */}
        {(error || success) && (
          <div className="absolute bottom-4 left-4 right-4 z-40 md:max-w-[45%] pointer-events-none">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-accentRose/10 border border-accentRose/20 text-accentRose text-xs rounded-lg animate-fadeIn shadow-lg backdrop-blur-md">
                <ShieldAlert size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-accentEmerald/10 border border-accentEmerald/20 text-accentEmerald text-xs rounded-lg text-center font-semibold animate-fadeIn shadow-lg backdrop-blur-md">
                {success}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}