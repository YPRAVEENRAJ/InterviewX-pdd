import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  FileText, 
  CheckCircle2, 
  Save, 
  Settings, 
  Trophy,
  Sparkles
} from 'lucide-react';

export default function UserProfilePage({ user }) {
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex@interviewx.ai',
    college: 'Stanford University',
    designation: 'Senior SDE Candidate',
    experience: '3.5',
    targetRole: 'Full Stack Engineer',
    skills: ['Python', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'System Design', 'Redis'],
    interviewScore: 780,
    codingRating: 1650
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'achievements', 'settings'

  return (
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Header Banner */}
      <div class="glass-card p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative overflow-hidden">
        <img 
          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"} 
          alt="Avatar"
          class="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/60 shadow-glow shrink-0" 
        />
        <div class="space-y-1 text-center sm:text-left flex-1">
          <div class="flex items-center justify-center sm:justify-start space-x-2">
            <h1 class="text-2xl font-extrabold text-white">{profile.name}</h1>
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold border border-indigo-500/30">PRO Candidate</span>
          </div>
          <p class="text-xs text-slate-300">{profile.designation} • {profile.college}</p>
          <p class="text-xs text-indigo-400 font-bold mt-1">Targeting: {profile.targetRole}</p>
        </div>

        <div class="flex items-center space-x-3 shrink-0">
          <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Interview Rating</span>
            <div class="text-xl font-extrabold text-indigo-400">{profile.interviewScore}</div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Coding Rating</span>
            <div class="text-xl font-extrabold text-amber-400">{profile.codingRating}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div class="flex space-x-2 border-b border-slate-800 pb-2">
        {['overview', 'achievements', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            class={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Personal Info Box */}
          <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center space-x-2">
              <User class="w-4 h-4 text-indigo-400" />
              <span>Personal Information</span>
            </h3>

            <div class="space-y-3 text-xs text-slate-300">
              <div>
                <span class="text-slate-500 font-medium">Email:</span>
                <p class="font-bold text-white mt-0.5">{profile.email}</p>
              </div>
              <div>
                <span class="text-slate-500 font-medium">College / University:</span>
                <p class="font-bold text-white mt-0.5">{profile.college}</p>
              </div>
              <div>
                <span class="text-slate-500 font-medium">Experience:</span>
                <p class="font-bold text-white mt-0.5">{profile.experience} Years</p>
              </div>
            </div>
          </div>

          {/* Skills Cloud Box */}
          <div class="md:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center space-x-2">
              <Code class="w-4 h-4 text-emerald-400" />
              <span>Technical Skills Cloud</span>
            </h3>

            <div class="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={i} class="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Achievements Tab Content */}
      {activeTab === 'achievements' && (
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: 'Top 5% AI Mock Interviewer', desc: 'Scored above 90% in 5 consecutive technical interviews', icon: '🏆', color: 'from-amber-500/20 to-orange-500/10' },
            { title: 'Algorithm Master Knight', desc: 'Solved over 40 hard-level dynamic programming challenges', icon: '⚔️', color: 'from-indigo-500/20 to-purple-500/10' },
            { title: 'ATS 90+ Champion', desc: 'Achieved a perfect ATS resume match for Tier-1 Tech roles', icon: '📜', color: 'from-emerald-500/20 to-teal-500/10' }
          ].map((item, idx) => (
            <div key={idx} class={`glass-card p-6 rounded-3xl border border-slate-800 bg-gradient-to-b ${item.color} text-center space-y-2`}>
              <div class="text-3xl">{item.icon}</div>
              <h4 class="text-sm font-bold text-white">{item.title}</h4>
              <p class="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab Content */}
      {activeTab === 'settings' && (
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 max-w-xl">
          <h3 class="text-sm font-bold text-white flex items-center space-x-2">
            <Settings class="w-4 h-4 text-indigo-400" />
            <span>Platform & AI Preferences</span>
          </h3>

          <div class="space-y-4 text-xs text-slate-300">
            <div class="flex items-center justify-between">
              <span>Enable AI Voice Text-to-Speech Output</span>
              <input type="checkbox" defaultChecked class="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700" />
            </div>
            <div class="flex items-center justify-between">
              <span>Receive Daily Interview Practice Reminders</span>
              <input type="checkbox" defaultChecked class="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700" />
            </div>
            <div class="flex items-center justify-between">
              <span>Auto-Scan Uploaded Resumes for ATS Match</span>
              <input type="checkbox" defaultChecked class="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
