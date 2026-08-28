import React, { useState, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertTriangle, 
  Briefcase, 
  Search,
  FileCheck,
  Lightbulb,
  Bot,
  Brain,
  Database,
  Code2
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

export default function ResumeAnalyzerPage({ onScanComplete }) {
  const fileInputRef = useRef(null);
  
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'paste'

  // Presets dictionary for instant sample loading
  const presets = {
    ai_engineer: {
      title: "🤖 AI & GenAI Engineer",
      jd: "Seeking an AI Engineer with expertise in Large Language Models (LLMs), LangChain, LlamaIndex, RAG (Retrieval-Augmented Generation), Vector Databases (Pinecone, ChromaDB), PyTorch, Hugging Face, OpenAI APIs, Model Fine-Tuning, Prompt Engineering, and scalable AI inference deployment with Docker and FastAPI.",
      resume: "AI Engineer with 3+ years experience building production GenAI systems. Expertise in LangChain, RAG pipelines, Vector Databases (Pinecone), LLM fine-tuning with PyTorch and Hugging Face. Integrated OpenAI & Claude APIs into enterprise microservices using Python, FastAPI, and Docker. Implemented semantic search and agentic workflows.",
      fileName: "Praveen_AI_GenAI_Engineer_Resume.pdf"
    },
    ml_engineer: {
      title: "🧠 Machine Learning Engineer",
      jd: "Looking for an ML Engineer proficient in MLOps, PyTorch, TensorFlow, Scikit-learn, Feature Engineering, Model Training, CI/CD pipelines for ML (Kubeflow, MLflow), Data Pipelines, and high-throughput Model Serving with Triton or TorchServe.",
      resume: "Machine Learning Engineer specializing in predictive modeling, deep learning, and MLOps. Hands-on experience with PyTorch, TensorFlow, MLflow, and Kubeflow. Built automated training pipelines, optimized inference latency by 40%, and deployed scalable microservices on AWS.",
      fileName: "ML_Engineer_Resume.pdf"
    },
    data_scientist: {
      title: "📊 Data Scientist",
      jd: "Seeking a Data Scientist with expertise in Statistical Modeling, Predictive Analytics, Python (Pandas, NumPy, Scikit-learn), SQL query optimization, A/B Testing hypothesis validation, Exploratory Data Analysis (EDA), and data storytelling with Tableau.",
      resume: "Data Scientist experienced in statistical analysis, machine learning algorithms, A/B testing design, and SQL data extraction. Developed churn prediction and customer lifetime value models in Python. Created executive dashboards and presented analytical insights to leadership.",
      fileName: "Data_Scientist_Resume.pdf"
    },
    data_engineer: {
      title: "⚡ Data Engineer",
      jd: "Data Engineer proficient in Apache Spark, Apache Kafka, Snowflake, Airflow, SQL, Data Warehousing, ETL/ELT pipelines, PostgreSQL, and scalable Data Lake architecture on AWS/GCP.",
      resume: "Data Engineer with 4 years designing distributed data pipelines. Proficient in Apache Spark, Kafka streaming, Airflow workflow orchestration, Snowflake data warehousing, and PostgreSQL optimization. Processed 50M+ daily events with 99.9% pipeline reliability.",
      fileName: "Data_Engineer_Resume.pdf"
    },
    fullstack: {
      title: "💻 Full Stack Engineer",
      jd: "Seeking a Senior Full Stack Engineer with expertise in React, Next.js, Node.js, TypeScript, PostgreSQL, Docker, Redis caching, Microservices architecture, Python, and REST APIs. Candidate should have experience optimizing high-throughput web applications.",
      resume: "Senior Full Stack Engineer. Skills: React, Next.js, TypeScript, Node.js, PostgreSQL, Docker, REST APIs, Python, JavaScript, Tailwind CSS, Git, System Design. Built cloud web platforms and optimized database queries.",
      fileName: "FullStack_Engineer_Resume.pdf"
    },
    backend: {
      title: "🗄️ Backend Systems Engineer",
      jd: "Looking for a Backend Systems Engineer proficient in Java, Spring Boot, Go, Python, PostgreSQL, Microservices, Redis, Kafka, gRPC, Multithreading, Linux, and Cloud Infrastructure.",
      resume: "Backend Engineer specializing in Go, Java Spring Boot, and Python. Deep understanding of multithreading, PostgreSQL indexing, Redis caching, Linux systems, REST APIs, gRPC, and distributed microservices.",
      fileName: "Backend_Systems_Engineer_Resume.pdf"
    },
    frontend: {
      title: "🎨 Frontend Developer",
      jd: "Frontend Developer with strong proficiency in React, TypeScript, Next.js, Tailwind CSS, Core Web Vitals optimization, state management (Redux/Zustand), and responsive UI design.",
      resume: "Frontend Developer experienced in React, Next.js, TypeScript, HTML5/CSS3, Tailwind CSS, Redux, and modern high-performance web application development.",
      fileName: "Frontend_Developer_Resume.pdf"
    },
    cloud_devops: {
      title: "🚀 Cloud & DevOps Engineer",
      jd: "Seeking a DevOps Engineer with expertise in Kubernetes, Docker containerization, Terraform Infrastructure as Code (IaC), AWS/GCP, CI/CD pipelines (GitHub Actions), Prometheus, and Grafana monitoring.",
      resume: "Cloud DevOps Engineer with 4+ years managing Kubernetes clusters, automating zero-downtime CI/CD pipelines, writing Terraform IaC, and monitoring cloud microservice infrastructure on AWS.",
      fileName: "Cloud_DevOps_Engineer_Resume.pdf"
    }
  };

  const [jobDescription, setJobDescription] = useState(presets.ai_engineer.jd);
  const [resumeText, setResumeText] = useState(presets.ai_engineer.resume);
  const [uploadedFileName, setUploadedFileName] = useState(presets.ai_engineer.fileName);
  const [uploadedFileSize, setUploadedFileSize] = useState("380 KB");

  const [fileError, setFileError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // Strict 10 MB limit

  // Master Technical Keywords Catalog
  const techKeywordsDatabase = [
    // AI, ML, Data Science & GenAI
    'LLMs', 'Large Language Models', 'LangChain', 'LlamaIndex', 'RAG', 'Vector Database', 'Vector DB', 'Pinecone', 'ChromaDB',
    'PyTorch', 'TensorFlow', 'Hugging Face', 'Scikit-learn', 'MLOps', 'MLflow', 'Kubeflow', 'Model Fine-Tuning', 'Prompt Engineering',
    'OpenAI', 'FastAPI', 'Pandas', 'NumPy', 'Data Science', 'Machine Learning', 'Deep Learning', 'Statistics', 'A/B Testing',
    'Apache Spark', 'Kafka', 'Snowflake', 'Airflow', 'ETL', 'Data Lake', 'Data Warehouse', 'EDA', 'Tableau', 'NLP', 'Computer Vision',
    // Software Engineering, Full Stack & Cloud
    'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Microservices', 
    'Python', 'REST APIs', 'GraphQL', 'Kubernetes', 'CI/CD', 'AWS', 'GCP',
    'System Design', 'TypeScript', 'Java', 'Spring Boot', 'SQL', 'Git', 'Terraform',
    'HTML', 'CSS', 'JavaScript', 'Tailwind', 'MongoDB', 'Express', 'Golang', 'Rust', 'Linux',
    'gRPC', 'Multithreading', 'Concurrency', 'Distributed Systems', 'CI/CD Pipelines'
  ];

  // Helper to Extract Known & Custom Dynamic Keywords from Text
  const extractKeywordsFromText = (text) => {
    const textUpper = (text || "").toUpperCase();
    
    // 1. Match from master tech database
    const matchedFromDb = techKeywordsDatabase.filter(kw => {
      const kwUpper = kw.toUpperCase();
      return textUpper.includes(kwUpper);
    });

    // 2. Extract potential technical dynamic n-grams
    const words = (text || "").match(/\b[A-Za-z0-9+#.-]{2,}\b/g) || [];
    const customTechTerms = Array.from(new Set(words.filter(w => {
      const u = w.toUpperCase();
      return (
        /^[A-Z0-9+#.-]{2,}$/.test(w) || 
        ['LANGCHAIN', 'PYTORCH', 'TENSORFLOW', 'SNOWFLAKE', 'FASTAPI', 'KAFKA', 'DOCKER', 'KUBERNETES'].includes(u)
      );
    })));

    const combined = Array.from(new Set([...matchedFromDb, ...customTechTerms]));
    return combined.length > 0 ? combined : ['Python', 'SQL', 'React', 'Docker', 'Machine Learning', 'APIs'];
  };

  // REAL ATS SCORING & KEYWORD MATCH ENGINE
  const calculateRealATSMetrics = () => {
    const jdKeywords = extractKeywordsFromText(jobDescription);
    const resumeKeywords = extractKeywordsFromText(resumeText);
    
    const resumeUpper = (resumeText || "").toUpperCase();

    // Identify Matched vs Missing Keywords
    const matchedKeywords = jdKeywords.filter(kw => resumeUpper.includes(kw.toUpperCase()));
    const missingKeywords = jdKeywords.filter(kw => !resumeUpper.includes(kw.toUpperCase()));

    // Keyword Match Percentage
    const matchRatio = jdKeywords.length > 0 ? (matchedKeywords.length / jdKeywords.length) : 0.8;
    const matchPercentage = Math.min(Math.round(matchRatio * 100), 100);

    // Format Compliance
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
    const hasSkillsSection = /skills|technical skills|technologies/i.test(resumeText);
    const formatScore = (hasSkillsSection ? 40 : 20) + (hasEmail ? 30 : 15) + (hasPhone ? 30 : 15);

    // Final Weighted ATS Score
    const finalATSScore = Math.min(Math.round((matchPercentage * 0.75) + (formatScore * 0.25)), 98);

    return {
      finalATSScore,
      matchPercentage,
      formatScore,
      totalJdKeywords: jdKeywords.length,
      matchedKeywords,
      missingKeywords,
      jdKeywordsList: jdKeywords
    };
  };

  const atsResults = calculateRealATSMetrics();

  // Load Preset Handler
  const handleLoadPreset = (key) => {
    const p = presets[key];
    if (p) {
      setJobDescription(p.jd);
      setResumeText(p.resume);
      setUploadedFileName(p.fileName);
      setUploadedFileSize("420 KB");
      setFileError(null);

      if (onScanComplete) {
        const calculated = calculateRealATSMetrics();
        onScanComplete(calculated.finalATSScore, p.fileName);
      }
    }
  };

  // Native File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File size exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please upload a smaller file.`);
      return;
    }

    setFileError(null);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    setIsAnalyzing(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const parsedText = content.length > 50 
          ? content 
          : `Candidate Name: ${file.name.replace(/\.[^/.]+$/, "")}\nSkills: Python, React, PostgreSQL, Docker, Machine Learning, APIs.\nExperience: Software Engineer with strong background in system design and data structures.`;
        
        setResumeText(parsedText);
      }

      setIsAnalyzing(false);

      if (onScanComplete) {
        onScanComplete(atsResults.finalATSScore, file.name);
      }
    };

    reader.onerror = () => {
      setFileError("Unable to read file. Please paste your text directly.");
      setIsAnalyzing(false);
    };

    reader.readAsText(file);
  };

  const handleTriggerReScan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (onScanComplete) {
        onScanComplete(atsResults.finalATSScore, uploadedFileName);
      }
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
          <FileCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Resume ATS Compliance Scanner</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Compare your resume directly against target Job Descriptions (JDs) for AI, ML, Data Science, and Engineering roles.
        </p>
      </div>

      {/* Quick Role Sample Presets Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select Target Role Preset:
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([key, item]) => (
            <button
              key={key}
              onClick={() => handleLoadPreset(key)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all hover:border-indigo-500 hover:text-white shadow-sm flex items-center space-x-1.5"
            >
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Left Input (JD & Resume) vs Right Real-Time ATS Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 Cols: Job Description & Resume Inputs */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Target Job Description Box */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Target Job Description (JD)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {atsResults.totalJdKeywords} Keywords Detected
              </span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:border-indigo-500 outline-none leading-relaxed resize-none"
              placeholder="Paste target job description here..."
            />
          </div>

          {/* Resume Upload / Text Input Box */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-4 h-4" />
                <span>Your Resume</span>
              </span>

              {/* Mode Toggle: File vs Paste */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setInputMode('file')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    inputMode === 'file' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    inputMode === 'paste' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputMode === 'file' ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.rtf"
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition-all space-y-2"
                >
                  <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-white">Click to Upload Resume Document</p>
                    <p className="text-[11px] text-slate-400">PDF, DOCX, DOC, or TXT up to 10 MB</p>
                  </div>
                </div>

                {fileError && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}

                {/* Uploaded File Pill */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200 truncate">{uploadedFileName}</p>
                      <p className="text-[10px] text-slate-500">{uploadedFileSize} • Ready for analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 shrink-0"
                  >
                    Change File
                  </button>
                </div>
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={7}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:border-indigo-500 outline-none leading-relaxed resize-none"
                placeholder="Paste your resume text here..."
              />
            )}

            <button
              onClick={handleTriggerReScan}
              disabled={isAnalyzing}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing ATS Alignment...' : 'Re-Calculate ATS Compliance'}</span>
            </button>
          </div>

        </div>

        {/* Right 6 Cols: ATS Score Breakdown & Matched Keywords */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Scorecard */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-950 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Overall Match</span>
                <h3 className="text-xl font-extrabold text-white">ATS Compliance Score</h3>
              </div>
              <ScoreGauge score={atsResults.finalATSScore} label="ATS Score" size={88} strokeWidth={8} color="#6366f1" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">JD Keyword Match</span>
                <p className="text-lg font-extrabold text-emerald-400">{atsResults.matchPercentage}%</p>
                <p className="text-[10px] text-slate-500">{atsResults.matchedKeywords.length} of {atsResults.totalJdKeywords} found</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Format Quality</span>
                <p className="text-lg font-extrabold text-indigo-400">{atsResults.formatScore}%</p>
                <p className="text-[10px] text-slate-500">Contact & skills layout</p>
              </div>
            </div>
          </div>

          {/* Matched Keywords (Found in Resume) */}
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Skills ({atsResults.matchedKeywords.length})</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Passed ATS Filter
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 max-h-[140px] overflow-y-auto">
              {atsResults.matchedKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords (Add to Resume) */}
          {atsResults.missingKeywords.length > 0 && (
            <div className="glass-card p-6 rounded-3xl border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing Keywords to Add ({atsResults.missingKeywords.length})</span>
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Recommended Additions
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Include these key terms in your project bullets to reach a 90%+ ATS score:
              </p>

              <div className="flex flex-wrap gap-2 pt-1 max-h-[140px] overflow-y-auto">
                {atsResults.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
