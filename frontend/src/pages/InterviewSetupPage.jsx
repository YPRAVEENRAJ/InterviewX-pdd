import React, { useState } from 'react';
import { 
  Bot, 
  Building2, 
  Briefcase, 
  Award, 
  Layers, 
  Code2, 
  Mic, 
  MessageSquare, 
  Play,
  CheckCircle2,
  Camera,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export default function InterviewSetupPage({ onStartInterview }) {
  const [config, setConfig] = useState({
    jobRole: 'AI Engineer (LLMs, GenAI & RAG)',
    customJobRole: '',
    company: 'Google',
    experience: '3-5 Years (Mid-Level)',
    difficulty: 'Medium',
    interviewType: 'Technical',
    language: 'Python 3',
    interviewLang: 'English',
    questionCount: 5,
    timeLimit: 30,
    mode: 'Text', // Text for Technical (Coding) & System Design, Voice for Behavioral
    customJd: ''
  });

  const handleTypeChange = (type) => {
    // Speak / Voice mode is strictly for Behavioral & HR round
    const newMode = type === 'Behavioral & HR' ? 'Voice' : 'Text';
    setConfig({
      ...config,
      interviewType: type,
      mode: newMode
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalRole = config.jobRole === 'Other' && config.customJobRole.trim() 
      ? config.customJobRole.trim() 
      : config.jobRole;

    onStartInterview({
      ...config,
      jobRole: finalRole
    });
  };

  const isBehavioral = config.interviewType === 'Behavioral & HR';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Setup Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
          <Bot className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Configure AI Mock Interview</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Tailor the AI interviewer to your target role, experience level, and company with continuous background AI camera proctoring.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Laptop Camera & Continuous Background Proctoring Banner */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center space-x-2">
                <span>Laptop Webcam AI Background Proctoring</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </p>
              <p className="text-[11px] text-slate-400">Continuous background AI gaze tracking & malpractice monitoring will run until exam completion</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Proctoring Ready</span>
          </span>
        </div>

        {/* 1. Job Role & Target Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Target Job Role</span>
            </label>
            <select
              value={config.jobRole}
              onChange={e => setConfig({...config, jobRole: e.target.value})}
              className="glass-input w-full text-xs font-semibold"
            >
              <option value="AI Engineer (LLMs, GenAI & RAG)" className="bg-slate-900">🤖 AI Engineer (LLMs, GenAI & RAG)</option>
              <option value="Machine Learning Engineer (MLOps & Deep Learning)" className="bg-slate-900">🧠 Machine Learning Engineer (MLOps & PyTorch)</option>
              <option value="Data Scientist (Analytics & Predictive Modeling)" className="bg-slate-900">📊 Data Scientist (Statistics & Modeling)</option>
              <option value="Data Engineer (Spark, Kafka & Pipelines)" className="bg-slate-900">⚡ Data Engineer (Spark, Kafka & Snowflake)</option>
              <option value="Full Stack Engineer (React, Node.js & Cloud)" className="bg-slate-900">💻 Full Stack Engineer (React, Node.js & Cloud)</option>
              <option value="Frontend Developer (React, Next.js & TypeScript)" className="bg-slate-900">🎨 Frontend Developer (React/Next.js)</option>
              <option value="Backend Engineer (Java, Go, Python & Microservices)" className="bg-slate-900">🗄️ Backend Engineer (Java/Go/Python)</option>
              <option value="Software Development Engineer (SDE I/II/III)" className="bg-slate-900">⚡ Software Development Engineer (SDE)</option>
              <option value="Cloud & DevOps Engineer (Kubernetes & AWS/GCP)" className="bg-slate-900">🚀 Cloud & DevOps Engineer (K8s/Terraform)</option>
              <option value="Cybersecurity & Security Engineer" className="bg-slate-900">🔒 Cybersecurity & Security Engineer</option>
              <option value="Mobile App Developer (iOS / Android / React Native)" className="bg-slate-900">📱 Mobile App Developer (iOS/Android)</option>
              <option value="Other" className="bg-slate-900">✨ Other / Custom Role (Type below)</option>
            </select>

            {/* Custom Job Role Input */}
            {config.jobRole === 'Other' && (
              <div className="mt-3 space-y-1 animate-in fade-in">
                <label className="text-[11px] font-bold text-indigo-400 flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Specify Your Custom Role:</span>
                </label>
                <input
                  type="text"
                  value={config.customJobRole}
                  onChange={e => setConfig({...config, customJobRole: e.target.value})}
                  placeholder="e.g. Quantitative Developer, Blockchain Architect, NLP Specialist"
                  className="glass-input w-full text-xs font-semibold"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-pink-400" />
              <span>Target Company (PYQ Engine)</span>
            </label>
            <select
              value={config.company}
              onChange={e => setConfig({...config, company: e.target.value})}
              className="glass-input w-full text-xs font-semibold"
            >
              <option value="Google" className="bg-slate-900">Google</option>
              <option value="Amazon / AWS" className="bg-slate-900">Amazon / AWS</option>
              <option value="Microsoft" className="bg-slate-900">Microsoft</option>
              <option value="Meta" className="bg-slate-900">Meta</option>
              <option value="Apple" className="bg-slate-900">Apple</option>
              <option value="Netflix" className="bg-slate-900">Netflix</option>
              <option value="Uber / Stripe" className="bg-slate-900">Uber / Stripe</option>
              <option value="High-Growth Tech Startup" className="bg-slate-900">High-Growth Tech Startup</option>
            </select>
          </div>
        </div>

        {/* 2. Experience & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Experience Level</span>
            </label>
            <select
              value={config.experience}
              onChange={e => setConfig({...config, experience: e.target.value})}
              className="glass-input w-full text-xs font-semibold"
            >
              <option value="Entry-Level / Graduate (0-1 yrs)" className="bg-slate-900">Entry-Level / Graduate (0-1 yrs)</option>
              <option value="3-5 Years (Mid-Level)" className="bg-slate-900">Mid-Level (2-4 yrs)</option>
              <option value="Senior Engineer (5+ Years)" className="bg-slate-900">Senior Engineer (5+ yrs)</option>
              <option value="Staff / Principal Engineer" className="bg-slate-900">Staff / Principal Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Interview Difficulty</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map(diff => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setConfig({...config, difficulty: diff})}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    config.difficulty === diff
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Interview Type: Technical (Coding & Architecture), System Design, Behavioral */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Select Interview Round</label>
            <span className="text-[11px] font-semibold text-indigo-400">
              {isBehavioral ? '🎙️ Verbal / Microphone Speak' : '💻 Technical Code & Written'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { 
                id: 'Technical', 
                title: 'Technical Round', 
                badge: 'Coding & Algorithms',
                desc: 'Company PYQs: Algorithms, Data Structures & Optimization' 
              },
              { 
                id: 'System Design & Architecture', 
                title: 'System Design', 
                badge: 'Distributed Scale',
                desc: 'Company PYQs: Scalability, microservices, databases & caching' 
              },
              { 
                id: 'Behavioral & HR', 
                title: 'Behavioral & HR', 
                badge: '🎙️ Speak Enabled',
                desc: 'Company Culture: Leadership principles, STAR format & verbal speak' 
              }
            ].map(round => (
              <button
                type="button"
                key={round.id}
                onClick={() => handleTypeChange(round.id)}
                className={`p-4 rounded-2xl text-xs font-semibold border text-left transition-all flex flex-col justify-between space-y-2 ${
                  config.interviewType === round.id
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-glow ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{round.title}</span>
                    {config.interviewType === round.id && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    round.id === 'Behavioral & HR' 
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {round.badge}
                  </span>
                  <p className="text-[11px] text-slate-400 font-normal leading-relaxed">{round.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Language & Interaction Mode Explanation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Primary Tech Stack / Programming Language</span>
            </label>
            <select
              value={config.language}
              onChange={e => setConfig({...config, language: e.target.value})}
              className="glass-input w-full text-xs font-semibold"
            >
              <option value="Python 3" className="bg-slate-900">Python 3 (NumPy, PyTorch, FastAPI)</option>
              <option value="JavaScript / TypeScript" className="bg-slate-900">JavaScript / TypeScript (React, Node.js)</option>
              <option value="Java" className="bg-slate-900">Java (Spring Boot, Microservices)</option>
              <option value="C++" className="bg-slate-900">C++ (STL & Systems)</option>
              <option value="Go" className="bg-slate-900">Go (Golang & Cloud)</option>
              <option value="Rust" className="bg-slate-900">Rust</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Candidate Response Input Mode
            </label>
            <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
              isBehavioral 
                ? 'bg-pink-950/30 border-pink-500/40 text-pink-200' 
                : 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
            }`}>
              {isBehavioral ? (
                <>
                  <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Verbal Speak Input (Behavioral Round)</p>
                    <p className="text-[10px] text-pink-300/80">Speak your answers out loud via microphone</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Technical Code & Written Mode</p>
                    <p className="text-[10px] text-indigo-300/80">Type code and technical answers. Speak is for Behavioral round.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow flex items-center justify-center space-x-2 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch AI Proctored Interview Session</span>
        </button>

      </form>
    </div>
  );
}
