import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Code2, 
  FileCheck, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Play
} from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div class="relative overflow-hidden">
      
      {/* Glow Ambient Orbs */}
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-600/20 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
        
        {/* Top Badge */}
        <div class="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-8 shadow-glow animate-bounce">
          <Sparkles class="w-4 h-4 text-pink-400" />
          <span>Next-Gen Career Readiness Powered by Gemini 3.5 AI</span>
        </div>

        {/* Hero Headline */}
        <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Ace Your Next Tech Interview with <br class="hidden sm:inline" />
          <span class="gradient-text">AI Voice & Live Coding Simulation</span>
        </h1>

        {/* Hero Subtitle */}
        <p class="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Master role-specific AI technical interviews, analyze your resume ATS compliance in seconds, and practice 500+ LeetCode-style DSA challenges with dynamic AI feedback.
        </p>

        {/* CTA Buttons */}
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            class="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-glow flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Start Free AI Technical Interview</span>
            <ArrowRight class="w-5 h-5" />
          </button>
          
          <button
            onClick={onGetStarted}
            class="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-base flex items-center justify-center space-x-2 transition-all"
          >
            <Play class="w-4 h-4 text-indigo-400 fill-indigo-400" />
            <span>Explore Demo Features</span>
          </button>
        </div>

        {/* Trust Badges / Companies */}
        <div class="mt-16 border-t border-slate-800/80 pt-10">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Engineered for candidates interviewing at top-tier companies
          </p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-8 text-slate-300 font-extrabold text-lg opacity-80">
            <span>Google</span>
            <span>Meta</span>
            <span>Amazon</span>
            <span>Microsoft</span>
            <span>Apple</span>
            <span>Netflix</span>
            <span>Uber</span>
          </div>
        </div>

      </section>

      {/* Feature Highlights Grid */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white">Complete 360° AI Preparation Suite</h2>
          <p class="text-slate-400 text-sm mt-2">Everything you need to transform your technical skills and communication into job offers.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: AI Technical Interview */}
          <div class="glass-card glass-card-hover p-8 rounded-3xl border border-slate-800">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6">
              <Bot class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Adaptive AI Voice Interviews</h3>
            <p class="text-slate-400 text-sm leading-relaxed">
              Experience dynamic, multi-turn technical & HR voice interviews. The AI evaluates your clarity, confidence, technical depth, and body language.
            </p>
          </div>

          {/* Card 2: ATS Resume Analyzer */}
          <div class="glass-card glass-card-hover p-8 rounded-3xl border border-slate-800">
            <div class="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6">
              <FileCheck class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">ATS Resume Scanner & Builder</h3>
            <p class="text-slate-400 text-sm leading-relaxed">
              Scan your resume against job descriptions, detect missing keywords, fix grammar, and generate ATS-friendly formatting in one click.
            </p>
          </div>

          {/* Card 3: Coding Practice Arena */}
          <div class="glass-card glass-card-hover p-8 rounded-3xl border border-slate-800">
            <div class="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-6">
              <Code2 class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Multi-Language Code Runner</h3>
            <p class="text-slate-400 text-sm leading-relaxed">
              Solve DSA challenges in Python, Java, JS, C++, C, or SQL. Run code against hidden test cases with execution time metrics.
            </p>
          </div>

        </div>
      </section>

      {/* Metrics Banner */}
      <section class="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border-y border-slate-800 py-12">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl sm:text-4xl font-extrabold text-white">94.8%</div>
            <div class="text-xs text-slate-400 mt-1 font-medium">Offer Conversion Rate</div>
          </div>
          <div>
            <div class="text-3xl sm:text-4xl font-extrabold text-indigo-400">120K+</div>
            <div class="text-xs text-slate-400 mt-1 font-medium">Interviews Completed</div>
          </div>
          <div>
            <div class="text-3xl sm:text-4xl font-extrabold text-pink-400">500+</div>
            <div class="text-xs text-slate-400 mt-1 font-medium">Company-Wise Problems</div>
          </div>
          <div>
            <div class="text-3xl sm:text-4xl font-extrabold text-emerald-400">4.9 / 5</div>
            <div class="text-xs text-slate-400 mt-1 font-medium">Candidate Satisfaction</div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section class="max-w-7xl mx-auto px-4 py-20 text-center">
        <div class="glass-card p-12 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900">
          <h2 class="text-3xl font-extrabold text-white">Ready to Land Your Dream Tech Offer?</h2>
          <p class="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
            Join thousands of candidates using InterviewX to practice, refine skills, and gain confidence.
          </p>
          <button
            onClick={onGetStarted}
            class="mt-8 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-glow transition-all"
          >
            Launch InterviewX Free Demo
          </button>
        </div>
      </section>

    </div>
  );
}
