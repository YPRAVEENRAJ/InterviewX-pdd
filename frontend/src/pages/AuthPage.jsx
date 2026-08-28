import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, Briefcase, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot', 'otp', 'reset', 'onboarding'
  
  // Form State
  const [email, setEmail] = useState('praveen@interviewx.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Praveen');
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '0']);
  
  // Onboarding Wizard State
  const [onboardingData, setOnboardingData] = useState({
    college: 'Stanford University',
    designation: 'Senior Engineer',
    experience: '3.5',
    skills: 'React, Node.js, Python, PostgreSQL, System Design',
    targetRole: 'Full Stack Engineer',
    preferredProgLang: 'Python',
    preferredInterviewLang: 'English',
    goals: 'Crack Tier-1 Tech interviews in 2026'
  });

  // Helper to resolve role dynamically from email domain
  const resolveRoleFromEmail = (targetEmail) => {
    const cleanEmail = (targetEmail || "").trim().toLowerCase();
    if (cleanEmail.endsWith('@interviewx.com')) {
      return 'admin';
    }
    return 'user'; // @gmail.com or other candidate domains
  };

  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        if (data.token) localStorage.setItem('token', data.token);
        onLoginSuccess({
          id: data.user.id,
          name: data.user.full_name || fullName,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          profile: data.user.profile
        });
      } else {
        setAuthError(data.message || 'Login failed.');
      }
    } catch (err) {
      // Fallback if backend is restarting
      const role = resolveRoleFromEmail(email);
      onLoginSuccess({
        name: fullName || (role === 'admin' ? 'Praveen' : 'Candidate User'),
        email: email,
        role: role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Preset Login Handler
  const handleQuickPresetLogin = (presetEmail, presetName) => {
    const role = resolveRoleFromEmail(presetEmail);
    setEmail(presetEmail);
    setFullName(presetName);
    onLoginSuccess({
      name: presetName,
      email: presetEmail,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });
      const data = await response.json();
      
      if (data.success) {
        if (data.token) localStorage.setItem('token', data.token);
        setView('otp');
      } else {
        setAuthError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setView('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = () => {
    setView('onboarding');
  };

  const handleOnboardingComplete = () => {
    const role = resolveRoleFromEmail(email);
    onLoginSuccess({
      name: fullName,
      email: email,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      profile: onboardingData
    });
  };

  return (
    <div class="min-h-[85vh] flex items-center justify-center p-4">
      <div class="w-full max-w-xl glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-1">
            <Sparkles class="w-6 h-6" />
          </div>
          <h2 class="text-2xl font-extrabold text-white">
            {view === 'login' && 'Sign In to InterviewX Platform'}
            {view === 'signup' && 'Create Candidate Account'}
            {view === 'forgot' && 'Reset Your Password'}
            {view === 'otp' && 'Verify Email Security OTP'}
            {view === 'reset' && 'Set New Password'}
            {view === 'onboarding' && 'Personalize Your Candidate Profile'}
          </h2>
          <p class="text-xs text-slate-400">
            {view === 'onboarding' 
              ? 'Set your target role and tech stack preferences'
              : 'Use @interviewx.com for Admin access, or @gmail.com for Candidate access'}
          </p>
        </div>

        {/* View Switcher / Tabs */}
        {(view === 'login' || view === 'signup') && (
          <div class="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setView('login')}
              class={`py-2 text-xs font-bold rounded-lg transition-all ${
                view === 'login' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setView('signup')}
              class={`py-2 text-xs font-bold rounded-lg transition-all ${
                view === 'signup' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {authError && (
          <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
            {authError}
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div class="relative">
                <Mail class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  class="glass-input w-full pl-10 text-xs" 
                  placeholder="praveen@interviewx.com or user@gmail.com"
                  required
                />
              </div>
              <span class="text-[10px] text-slate-500 mt-1 block">
                Domain Rules: <strong class="text-emerald-400">@interviewx.com</strong> = Admin | <strong class="text-indigo-400">@gmail.com</strong> = Candidate User
              </span>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold text-slate-300">Password</label>
                <button type="button" onClick={() => setView('forgot')} class="text-[11px] text-indigo-400 hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div class="relative">
                <Lock class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  class="glass-input w-full pl-10 text-xs" 
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all">
              Sign In to Account
            </button>

            {/* Quick Demo Preset Accounts */}
            <div class="pt-4 border-t border-slate-800 space-y-2">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">Quick Preset Logins</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPresetLogin('praveen@interviewx.com', 'Praveen')}
                  class="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                >
                  <ShieldCheck class="w-4 h-4 text-emerald-400" />
                  <span>Admin (praveen@interviewx.com)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPresetLogin('candidate@gmail.com', 'Candidate User')}
                  class="p-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                >
                  <User class="w-4 h-4 text-indigo-400" />
                  <span>User (candidate@gmail.com)</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. SIGNUP FORM */}
        {view === 'signup' && (
          <form onSubmit={handleSignupSubmit} class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div class="relative">
                <User class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  class="glass-input w-full pl-10 text-xs" 
                  placeholder="Your Full Name"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div class="relative">
                <Mail class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  class="glass-input w-full pl-10 text-xs" 
                  placeholder="user@gmail.com or admin@interviewx.com"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div class="relative">
                <Lock class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  class="glass-input w-full pl-10 text-xs" 
                  placeholder="At least 8 characters"
                  required
                />
              </div>
            </div>

            <button type="submit" class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all">
              Create Account & Verify OTP
            </button>
          </form>
        )}

        {/* 3. OTP VERIFICATION */}
        {view === 'otp' && (
          <div class="text-center space-y-6">
            <p class="text-xs text-slate-300">
              We have sent a 6-digit verification code to <span class="font-bold text-indigo-400">{email}</span>.
            </p>
            <div class="flex justify-center space-x-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  class="w-10 h-12 text-center text-lg font-bold bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
              ))}
            </div>
            <button
              onClick={handleOtpVerify}
              class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
            >
              Verify OTP & Continue
            </button>
          </div>
        )}

        {/* 4. ONBOARDING PROFILE WIZARD */}
        {view === 'onboarding' && (
          <div class="space-y-4 text-left">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">College / Company</label>
                <div class="relative">
                  <GraduationCap class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    value={onboardingData.college}
                    onChange={e => setOnboardingData({...onboardingData, college: e.target.value})}
                    class="glass-input w-full pl-10 text-xs" 
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Current Designation</label>
                <div class="relative">
                  <Briefcase class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    value={onboardingData.designation}
                    onChange={e => setOnboardingData({...onboardingData, designation: e.target.value})}
                    class="glass-input w-full pl-10 text-xs" 
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Target Job Role</label>
                <input 
                  type="text" 
                  value={onboardingData.targetRole}
                  onChange={e => setOnboardingData({...onboardingData, targetRole: e.target.value})}
                  class="glass-input w-full text-xs" 
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
                <input 
                  type="number" 
                  value={onboardingData.experience}
                  onChange={e => setOnboardingData({...onboardingData, experience: e.target.value})}
                  class="glass-input w-full text-xs" 
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Top Skills (Comma Separated)</label>
              <input 
                type="text" 
                value={onboardingData.skills}
                onChange={e => setOnboardingData({...onboardingData, skills: e.target.value})}
                class="glass-input w-full text-xs" 
              />
            </div>

            <button
              onClick={handleOnboardingComplete}
              class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow flex items-center justify-center space-x-2 transition-all mt-4"
            >
              <span>Complete Setup & Go to Dashboard</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
