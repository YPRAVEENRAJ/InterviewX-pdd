import React, { useState } from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Smartphone, 
  Monitor, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  theme, 
  setTheme, 
  isMobileSimulator, 
  setIsMobileSimulator,
  setShowMobileModal,
  activeTab, 
  setActiveTab,
  user,
  setUser,
  setShowNotifications,
  unreadCount
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAdmin = user && (
    (user.email || "").toLowerCase().endsWith('@interviewx.com') || user.role === 'admin'
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">Interview<span className="text-indigo-400">X</span></span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              {isAdmin ? 'Admin Portal' : 'AI Mock Interview Platform'}
            </span>
          </div>
        </div>

        {/* Global Navigation Links (Focused AI Mock Interview Platform) */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'interview-setup', label: 'AI Mock Interview' },
              { id: 'resume-analyzer', label: 'Resume ATS Scanner' },
              { id: 'coding-practice', label: 'Coding Arena' },
              ...(isAdmin ? [{ id: 'admin-panel', label: '🛡️ Admin Portal' }] : [])
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-glow font-bold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Mobile App & Phone Options Button */}
          <button
            onClick={() => setShowMobileModal && setShowMobileModal(true)}
            title="Run on Mobile Phone / Install App"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all shadow-glow"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">📱 Mobile App</span>
          </button>

          {/* Mobile Simulator Toggle Button */}
          <button
            onClick={() => setIsMobileSimulator(!isMobileSimulator)}
            title={isMobileSimulator ? "Switch to Full Desktop View" : "Simulate Mobile App Frame"}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isMobileSimulator
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-glow'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isMobileSimulator ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMobileSimulator ? 'Desktop Mode' : 'Mobile View'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Bell */}
          {user && (
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Auth Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/80 transition-all"
              >
                <img 
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/50"
                />
                <span className="hidden md:inline-block text-xs font-semibold text-slate-200">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className={`mt-1 inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isAdmin ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {isAdmin ? 'System Admin' : 'Candidate User'}
                    </span>
                  </div>

                  <button
                    onClick={() => { setActiveTab('user-profile'); setShowProfileMenu(false); }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>My Profile & Settings</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => { setActiveTab('admin-panel'); setShowProfileMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin Control Portal</span>
                    </button>
                  )}

                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => { setUser(null); setActiveTab('landing'); setShowProfileMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('auth')}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('auth')}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
