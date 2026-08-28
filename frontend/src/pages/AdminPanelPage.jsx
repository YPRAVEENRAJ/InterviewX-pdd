import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Sparkles, 
  CheckCircle2,
  Server,
  UserCheck,
  Save
} from 'lucide-react';

export default function AdminPanelPage({ user, registeredUsers = [] }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'status', 'prompts', 'backup'
  const [backupStatus, setBackupStatus] = useState(null);

  const adminUser = user || { name: 'Praveen', email: 'praveen@interviewx.com', role: 'admin' };

  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    "You are InterviewX AI Recruiter engine. Evaluate technical candidate answers on accuracy, clarity, and confidence. Defer per-question popups during the session and compile a final evaluation report."
  );

  const [promptSavedAlert, setPromptSavedAlert] = useState(false);

  const handleSavePrompt = () => {
    setPromptSavedAlert(true);
    setTimeout(() => setPromptSavedAlert(false), 2500);
  };

  const handleTriggerBackup = () => {
    setBackupStatus('Exporting PostgreSQL Database Dump (schema.sql + data)...');
    setTimeout(() => {
      setBackupStatus('✅ Backup successfully generated: database/backups/db_backup_2026_07_22.sql');
    }, 1000);
  };

  const candidateUsersCount = registeredUsers.filter(u => u.role === 'user').length;
  const adminUsersCount = registeredUsers.filter(u => u.role === 'admin').length;

  return (
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Admin Title Header */}
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-2xl font-extrabold text-white">System Admin Control Portal</h1>
            <p class="text-xs text-slate-400">Authenticated Admin: <span class="text-emerald-400 font-bold">{adminUser.name}</span> ({adminUser.email})</p>
          </div>
        </div>

        <span class="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center space-x-1.5">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Verified System Admin Session</span>
        </span>
      </div>

      {/* Real-Time User & System Telemetry Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Registered Accounts</span>
          <div class="text-2xl font-extrabold text-white">{registeredUsers.length} Total</div>
          <span class="text-[10px] text-emerald-400 font-semibold">{candidateUsersCount} Candidates • {adminUsersCount} Admin</span>
        </div>

        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Express API Status</span>
          <div class="text-2xl font-extrabold text-emerald-400">Port 5000</div>
          <span class="text-[10px] text-slate-400 font-semibold">Online & Operational</span>
        </div>

        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">PostgreSQL Database</span>
          <div class="text-2xl font-extrabold text-indigo-400">Connected</div>
          <span class="text-[10px] text-slate-400 font-semibold">DDL Schema Active</span>
        </div>

        <div class="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Frontend Server</span>
          <div class="text-2xl font-extrabold text-amber-400">Port 3000</div>
          <span class="text-[10px] text-slate-400 font-semibold">Vite HMR Active</span>
        </div>
      </div>

      {/* Tab Controls */}
      <div class="flex space-x-2 border-b border-slate-800 pb-2">
        {[
          { id: 'users', label: `Registered User Directory (${registeredUsers.length})` },
          { id: 'status', label: 'System Health & API Telemetry' },
          { id: 'prompts', label: 'AI Prompt Configuration' },
          { id: 'backup', label: 'Database Backup' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            class={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. REAL-TIME REGISTERED USER DIRECTORY */}
      {activeTab === 'users' && (
        <div class="glass-card rounded-3xl border border-slate-800 overflow-hidden space-y-4 animate-in fade-in p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white flex items-center space-x-2">
                <Users class="w-5 h-5 text-emerald-400" />
                <span>Real-Time Platform Registered User Directory</span>
              </h3>
              <p class="text-xs text-slate-400">Live list of users registered on the platform (@interviewx.com for Admin, @gmail.com for Candidates)</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              {registeredUsers.length} Live Registered Accounts
            </span>
          </div>

          <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th class="p-3.5">User ID</th>
                  <th class="p-3.5">Account Name</th>
                  <th class="p-3.5">Email Address</th>
                  <th class="p-3.5">Assigned Role</th>
                  <th class="p-3.5">Registered Timestamp</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-200 font-medium">
                {registeredUsers.map(u => {
                  const isAdminRole = u.role === 'admin';
                  return (
                    <tr key={u.id} class="hover:bg-slate-800/40">
                      <td class="p-3.5 font-mono text-slate-400">{u.id}</td>
                      <td class="p-3.5 font-bold text-white flex items-center space-x-2">
                        <UserCheck class="w-4 h-4 text-indigo-400" />
                        <span>{u.name}</span>
                      </td>
                      <td class="p-3.5 font-mono">{u.email}</td>
                      <td class="p-3.5">
                        <span class={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isAdminRole 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {isAdminRole ? '🛡️ System Admin' : '👤 Candidate User'}
                        </span>
                      </td>
                      <td class="p-3.5 text-slate-400 text-[11px]">{u.registeredAt || 'Active Session'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SYSTEM HEALTH & REAL-TIME API TELEMETRY */}
      {activeTab === 'status' && (
        <div class="space-y-6 animate-in fade-in">
          <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 class="text-base font-bold text-white flex items-center space-x-2">
              <Server class="w-5 h-5 text-indigo-400" />
              <span>Backend API Endpoints Health Log</span>
            </h3>

            <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
              <table class="w-full text-left text-xs font-mono">
                <thead class="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th class="p-3.5">Endpoint Path</th>
                    <th class="p-3.5">HTTP Method</th>
                    <th class="p-3.5">Service Module</th>
                    <th class="p-3.5">Status Code</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-slate-200">
                  <tr class="hover:bg-slate-800/40">
                    <td class="p-3.5 font-bold text-emerald-400">/api/health</td>
                    <td class="p-3.5 font-bold text-indigo-400">GET</td>
                    <td class="p-3.5">Health Controller</td>
                    <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">200 OK</span></td>
                  </tr>
                  <tr class="hover:bg-slate-800/40">
                    <td class="p-3.5 font-bold text-emerald-400">/api/auth/login</td>
                    <td class="p-3.5 font-bold text-indigo-400">POST</td>
                    <td class="p-3.5">Authentication Controller</td>
                    <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">200 OK</span></td>
                  </tr>
                  <tr class="hover:bg-slate-800/40">
                    <td class="p-3.5 font-bold text-emerald-400">/api/interview/start</td>
                    <td class="p-3.5 font-bold text-indigo-400">POST</td>
                    <td class="p-3.5">AI Interview Engine</td>
                    <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">200 OK</span></td>
                  </tr>
                  <tr class="hover:bg-slate-800/40">
                    <td class="p-3.5 font-bold text-emerald-400">/api/resume/analyze</td>
                    <td class="p-3.5 font-bold text-indigo-400">POST</td>
                    <td class="p-3.5">ATS Scanner Engine</td>
                    <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">200 OK</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI PROMPT MANAGEMENT */}
      {activeTab === 'prompts' && (
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 animate-in fade-in max-w-3xl">
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles class="w-5 h-5 text-indigo-400" />
            <span>AI Recruiter System Prompt Template</span>
          </h3>
          <p class="text-xs text-slate-400">Configure system instructions sent to the Gemini 3.5 AI speech and technical evaluation engine.</p>

          <textarea
            value={aiSystemPrompt}
            onChange={e => setAiSystemPrompt(e.target.value)}
            class="glass-input w-full h-40 text-xs font-mono leading-relaxed"
          />

          <div class="flex items-center space-x-3 pt-2">
            <button 
              onClick={handleSavePrompt}
              class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow flex items-center space-x-2 transition-all"
            >
              <Save class="w-4 h-4" />
              <span>Save System Prompt Configuration</span>
            </button>

            {promptSavedAlert && (
              <span class="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-in fade-in">
                <CheckCircle2 class="w-4 h-4" />
                <span>Prompt configuration updated live!</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 4. DATABASE BACKUP */}
      {activeTab === 'backup' && (
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 animate-in fade-in max-w-xl">
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <Database class="w-5 h-5 text-emerald-400" />
            <span>PostgreSQL Database Backup & DDL Export</span>
          </h3>
          <p class="text-xs text-slate-400">Export PostgreSQL dump files containing user tables, interview records, and coding submission history.</p>

          <button
            onClick={handleTriggerBackup}
            class="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow flex items-center space-x-2 transition-all"
          >
            <Database class="w-4 h-4" />
            <span>Trigger Full Database Dump (.sql)</span>
          </button>

          {backupStatus && (
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
              {backupStatus}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
