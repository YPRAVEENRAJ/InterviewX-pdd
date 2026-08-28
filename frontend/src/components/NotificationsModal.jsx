import React from 'react';
import { Bell, X, CheckCircle, Calendar, FileText, Code, Briefcase } from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, notifications, markAsRead }) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'Interview Reminders': return <Calendar class="w-4 h-4 text-indigo-400" />;
      case 'Resume Analysis': return <FileText class="w-4 h-4 text-emerald-400" />;
      case 'Coding Challenges': return <Code class="w-4 h-4 text-amber-400" />;
      case 'Job Alerts': return <Briefcase class="w-4 h-4 text-pink-400" />;
      default: return <Bell class="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Bell class="w-5 h-5 text-indigo-400" />
            <h3 class="text-base font-bold text-white">Notifications Center</h3>
          </div>
          <button 
            onClick={onClose}
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div class="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 p-2">
          {notifications.map(item => (
            <div 
              key={item.id} 
              onClick={() => markAsRead(item.id)}
              class={`p-3 rounded-xl transition-all cursor-pointer flex items-start space-x-3 ${
                item.is_read ? 'bg-transparent opacity-60' : 'bg-indigo-950/20 hover:bg-slate-800/80 border border-indigo-500/20'
              }`}
            >
              <div class="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 shrink-0">
                {getIcon(item.type)}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-semibold text-white truncate">{item.title}</p>
                  <span class="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p class="text-xs text-slate-300 mt-0.5 line-clamp-2">{item.message}</p>
              </div>
              {!item.is_read && (
                <div class="w-2 h-2 rounded-full bg-pink-500 shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div class="px-4 py-3 bg-slate-950/60 border-t border-slate-800 text-center">
          <button 
            onClick={onClose}
            class="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Mark All as Read
          </button>
        </div>

      </div>
    </div>
  );
}
