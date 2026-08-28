import React from 'react';

export default function ScoreGauge({ score = 85, maxScore = 100, label = "Score", size = 120, strokeWidth = 10, color = "#6366f1" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score / maxScore, 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div class="flex flex-col items-center justify-center">
      <div class="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} class="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            class="text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        <div class="absolute flex flex-col items-center justify-center">
          <span class="text-2xl font-extrabold text-white tracking-tight">{score}</span>
          <span class="text-[10px] uppercase font-semibold text-slate-400">/ {maxScore}</span>
        </div>
      </div>
      {label && <span class="mt-2 text-xs font-semibold text-slate-300">{label}</span>}
    </div>
  );
}
