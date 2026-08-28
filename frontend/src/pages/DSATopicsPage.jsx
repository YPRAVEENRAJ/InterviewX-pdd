import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  Code, 
  ChevronRight, 
  Sparkles, 
  Trophy,
  Search
} from 'lucide-react';

export default function DSATopicsPage({ onSelectTopic }) {
  const [searchQuery, setSearchQuery] = useState('');

  const dsaTopics = [
    { title: 'RTOS & Embedded Systems (FreeRTOS / C / C++)', count: 28, completed: 22, difficulty: 'Medium-Hard', icon: '⚡', color: 'from-amber-600 to-orange-600' },
    { title: 'Arrays', count: 45, completed: 32, difficulty: 'Easy-Hard', icon: '🔢', color: 'from-blue-600 to-indigo-600' },
    { title: 'Strings', count: 38, completed: 28, difficulty: 'Easy-Hard', icon: '🔤', color: 'from-purple-600 to-pink-600' },
    { title: 'Linked Lists', count: 24, completed: 18, difficulty: 'Easy-Medium', icon: '🔗', color: 'from-emerald-600 to-teal-600' },
    { title: 'Stacks', count: 20, completed: 15, difficulty: 'Easy-Medium', icon: '📚', color: 'from-amber-600 to-orange-600' },
    { title: 'Queues', count: 18, completed: 14, difficulty: 'Easy-Medium', icon: '🚶‍♂️', color: 'from-indigo-600 to-purple-600' },
    { title: 'Trees & BST', count: 42, completed: 25, difficulty: 'Medium-Hard', icon: '🌳', color: 'from-emerald-600 to-green-600' },
    { title: 'Graphs', count: 36, completed: 19, difficulty: 'Medium-Hard', icon: '🕸️', color: 'from-red-600 to-pink-600' },
    { title: 'Dynamic Programming', count: 50, completed: 22, difficulty: 'Hard', icon: '🧩', color: 'from-purple-600 to-indigo-600' },
    { title: 'Greedy Algorithms', count: 22, completed: 16, difficulty: 'Medium', icon: '⚡', color: 'from-amber-600 to-yellow-600' },
    { title: 'Backtracking', count: 26, completed: 12, difficulty: 'Medium-Hard', icon: '🔄', color: 'from-pink-600 to-rose-600' },
    { title: 'Recursion', count: 20, completed: 18, difficulty: 'Easy-Medium', icon: '🪆', color: 'from-teal-600 to-cyan-600' },
    { title: 'Sliding Window', count: 25, completed: 20, difficulty: 'Medium', icon: '🪟', color: 'from-blue-600 to-cyan-600' },
    { title: 'Heaps & Priority Queues', count: 22, completed: 14, difficulty: 'Medium', icon: '🏔️', color: 'from-indigo-600 to-blue-600' },
    { title: 'Tries', count: 15, completed: 9, difficulty: 'Medium-Hard', icon: '🌲', color: 'from-emerald-600 to-teal-600' },
    { title: 'Sorting Algorithms', count: 18, completed: 16, difficulty: 'Easy-Medium', icon: '📶', color: 'from-orange-600 to-amber-600' },
    { title: 'Searching Algorithms', count: 16, completed: 15, difficulty: 'Easy-Medium', icon: '🔍', color: 'from-cyan-600 to-blue-600' },
    { title: 'Hashing & HashMaps', count: 30, completed: 24, difficulty: 'Easy-Medium', icon: '🔑', color: 'from-pink-600 to-purple-600' },
    { title: 'Bit Manipulation', count: 18, completed: 11, difficulty: 'Medium-Hard', icon: '⚡', color: 'from-violet-600 to-purple-600' }
  ];

  const filteredTopics = dsaTopics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
            <Layers class="w-3.5 h-3.5" />
            <span>Structured Data Structures & Algorithms Path</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white">18 Essential DSA Topics</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">Master core computer science topics with curated company-wise questions.</p>
        </div>

        {/* Search Bar */}
        <div class="relative w-full md:w-72">
          <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search DSA topics..."
            class="glass-input w-full pl-10 text-xs py-2"
          />
        </div>
      </div>

      {/* Grid of 18 DSA Topics */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((t, idx) => {
          const pct = Math.round((t.completed / t.count) * 100);
          return (
            <div 
              key={idx}
              class="glass-card glass-card-hover p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 group cursor-pointer"
              onClick={onSelectTopic}
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-glow">
                    {t.icon}
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{t.title}</h3>
                    <span class="text-[11px] text-slate-400 font-semibold">{t.difficulty}</span>
                  </div>
                </div>

                <span class="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                  {t.completed}/{t.count} Solved
                </span>
              </div>

              {/* Progress bar */}
              <div class="space-y-1.5 pt-2">
                <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Topic Completion</span>
                  <span class="text-indigo-400 font-bold">{pct}%</span>
                </div>
                <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    style={{ width: `${pct}%` }} 
                    class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" 
                  />
                </div>
              </div>

              <div class="pt-2 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Practice Topic Problems</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
