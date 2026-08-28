import React, { useState } from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

export default function MobileFrameSimulator({ children, isEnabled, onToggle }) {
  const [deviceModel, setDeviceModel] = useState('iphone'); // 'iphone' or 'android'

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <div class="min-h-screen bg-slate-950 py-8 px-4 flex flex-col items-center justify-center">
      
      {/* Device Toolbar */}
      <div class="mb-6 flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-full px-5 py-2 shadow-2xl">
        <span class="text-xs font-bold text-slate-300">Mobile Simulator Mode</span>
        <div class="h-4 w-px bg-slate-800" />
        <button
          onClick={() => setDeviceModel('iphone')}
          class={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            deviceModel === 'iphone' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          iPhone 15 Pro
        </button>
        <button
          onClick={() => setDeviceModel('android')}
          class={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            deviceModel === 'android' ? 'bg-emerald-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pixel 8 Pro
        </button>
        <div class="h-4 w-px bg-slate-800" />
        <button
          onClick={onToggle}
          class="flex items-center space-x-1.5 text-xs text-pink-400 font-semibold hover:text-pink-300"
        >
          <Monitor class="w-3.5 h-3.5" />
          <span>Exit Simulator</span>
        </button>
      </div>

      {/* Realistic Smartphone Shell */}
      <div class={`relative transition-all duration-300 ${
        deviceModel === 'iphone' 
          ? 'w-[390px] h-[844px] rounded-[52px] ring-[14px] ring-slate-800 border-[3px] border-slate-700 shadow-[0_0_60px_rgba(0,0,0,0.8)]' 
          : 'w-[412px] h-[892px] rounded-[44px] ring-[12px] ring-slate-800 border-[3px] border-slate-700 shadow-[0_0_60px_rgba(0,0,0,0.8)]'
      } bg-slate-900 overflow-hidden flex flex-col`}>
        
        {/* Dynamic Island / Notch */}
        <div class="absolute top-0 left-0 right-0 h-11 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-between px-6 select-none">
          <span class="text-xs font-bold text-white tracking-tight">9:41</span>
          
          {/* Dynamic Island Capsule */}
          <div class="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 space-x-1 border border-slate-800">
            <div class="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          <div class="flex items-center space-x-1.5 text-slate-200">
            <Signal class="w-3.5 h-3.5" />
            <Wifi class="w-3.5 h-3.5" />
            <Battery class="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Mobile App Screen */}
        <div class="flex-1 pt-11 overflow-y-auto overflow-x-hidden relative bg-[#0B0F17]">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div class="h-6 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center">
          <div class="w-32 h-1 bg-slate-600 rounded-full" />
        </div>

      </div>

    </div>
  );
}
