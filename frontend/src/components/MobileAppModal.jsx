import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  QrCode, 
  Download, 
  Share2, 
  Monitor, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function MobileAppModal({ isOpen, onClose, isMobileSimulator, setIsMobileSimulator }) {
  const [copied, setCopied] = useState(false);
  const mobileUrl = `http://10.45.163.90:3000`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">InterviewX Mobile App Mode</h3>
              <p className="text-xs text-slate-400">Run on your physical smartphone or simulate mobile frame</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Option 1: Direct Network IP Access */}
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="font-bold text-white text-sm">Open on Phone Browser (Local Wi-Fi)</h4>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Active Live Host
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Connect your mobile phone to the same Wi-Fi network and visit this exact URL:
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <code className="text-xs font-mono text-indigo-300 font-semibold">{mobileUrl}</code>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>
            </div>
          </div>

          {/* Option 2: Mobile Frame Simulator */}
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="font-bold text-white text-sm">Interactive Phone Simulator</h4>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Test full mobile responsiveness in an iPhone 15 Pro or Google Pixel shell directly inside your desktop browser.
            </p>

            <button
              onClick={() => {
                setIsMobileSimulator(!isMobileSimulator);
                onClose();
              }}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                isMobileSimulator
                  ? 'bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-glow'
              }`}
            >
              {isMobileSimulator ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span>{isMobileSimulator ? 'Switch back to Desktop View' : 'Launch Interactive Phone Simulator'}</span>
            </button>
          </div>

          {/* Option 3: PWA Installation Guide */}
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
              <Download className="w-4 h-4" />
              <h4>Install as Native Phone App (PWA / APK)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200 block">🤖 Android (Chrome)</span>
                <p className="text-slate-400 text-[11px]">
                  Open URL in Chrome, tap <strong>⋮ Menu</strong>, then select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200 block">🍎 iPhone (Safari)</span>
                <p className="text-slate-400 text-[11px]">
                  Open URL in Safari, tap <strong><Share2 className="w-3 h-3 inline" /> Share</strong> button, then select <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>PWA Mobile Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
