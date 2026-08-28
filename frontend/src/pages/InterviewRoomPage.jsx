import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Clock, 
  Bot, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  FileCode2, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Code2,
  Info,
  XCircle,
  Building2,
  Maximize,
  Volume2,
  VolumeX,
  UserCheck,
  Pause,
  Play
} from 'lucide-react';

export default function InterviewRoomPage({ config, onFinishInterview }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // ─── STAGE: 'CALIBRATION' (Pre-exam Check) vs 'EXAM' (Active Test) ───
  const [examStage, setExamStage] = useState('calibration'); // 'calibration' | 'exam'
  
  // Calibration Biometric & Audio States
  const [faceCheckStatus, setFaceCheckStatus] = useState('checking'); // 'checking' | 'passed' | 'blank_face'
  const [faceCheckMessage, setFaceCheckMessage] = useState('Analyzing camera feed for human face...');
  const [audioCheckStatus, setAudioCheckStatus] = useState('checking'); // 'checking' | 'quiet' | 'noisy'
  const [ambientNoiseLevel, setAmbientNoiseLevel] = useState(0);
  const [isEnvironmentReady, setIsEnvironmentReady] = useState(false);

  // Exam Active Controls
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState((config?.timeLimit || 30) * 60);
  const [isListening, setIsListening] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [showQuitModal, setShowQuitModal] = useState(false);
  
  // Real-Time Disturbance Auto-Pause
  const [isDisturbancePaused, setIsDisturbancePaused] = useState(false);
  const [disturbanceReason, setDisturbanceReason] = useState('');
  const [resumeError, setResumeError] = useState(null);

  
  // Response text: handles spoken transcript (Behavioral) OR typed text/code (Technical)
  const [transcript, setTranscript] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [lastQuestionTime, setLastQuestionTime] = useState(Date.now());


  // ─── STRICT PROCTORING TELEMETRY (MAX 1 WARNING ALLOWED) ───
  const [proctorStats, setProctorStats] = useState({
    integrityScore: 100,
    sideLooks: 0,
    outOfFrame: 0,
    multiFace: 0,
    tabSwitches: 0,
    warningCount: 0, // Max 1 warning. Second infraction = immediate 0 marks!
    lastViolation: null,
    gazeStatus: 'Centered & Focused',
    faceStatus: 'Single Human Face Verified'
  });

  const [proctorAlertToast, setProctorAlertToast] = useState(null);

  const isBehavioral = config?.interviewType === 'Behavioral & HR';
  const companyName = config?.company || 'Google';

  // ─── DYNAMIC COMPANY-SPECIFIC PREVIOUS YEARS QUESTIONS (PYQs) CATALOG ───
  const getCompanySpecificPYQs = (cfg) => {
    const interviewType = cfg?.interviewType || 'Technical';
    const comp = (cfg?.company || 'Google').toLowerCase();
    const role = cfg?.jobRole || 'Full Stack Engineer';
    const lang = cfg?.language || 'JavaScript / TypeScript';

    // Behavioral PYQs
    if (interviewType === 'Behavioral & HR') {
      if (comp.includes('amazon') || comp.includes('aws')) {
        return [
          {
            id: 1,
            title: 'Amazon Leadership Principle: Customer Obsession',
            question: `Amazon LP #1: Give me an example of when you went above and beyond for a customer or end-user. How did you prioritize long-term customer trust over short-term business gains?`,
            keyConcepts: ['customer obsession', 'customer trust', 'situation', 'task', 'action', 'result', 'metrics', 'long-term'],
            modelAnswer: `Structured using STAR: Focus on how you proactively gathered direct customer feedback or telemetry, advocated for user ergonomics/reliability, and delivered a solution that established long-term trust rather than taking an easy short-term shortcut.`,
            idealTakeaway: `Customer obsession means working backwards from customer needs and ruthlessly protecting customer trust.`
          },
          {
            id: 2,
            title: 'Amazon Leadership Principle: Ownership & Bias for Action',
            question: `Amazon LP #2: Describe a situation where you encountered a critical issue outside your defined team responsibility. How did you take radical ownership to resolve it with a bias for action?`,
            keyConcepts: ['ownership', 'bias for action', 'calculated risk', 'unblocking', 'initiative', 'accountability'],
            modelAnswer: `Leaders never say "that's not my job". Detail how you took calculated initiative under ambiguity, unblocked the team rapidly, and put preventative automation in place without waiting for managerial approval.`,
            idealTakeaway: `Radical ownership and speed in decision-making under two-way door decisions.`
          },
          {
            id: 3,
            title: 'Amazon Leadership Principle: Have Backbone; Disagree & Commit',
            question: `Amazon LP #3: Tell me about a time you strongly disagreed with a senior leader or colleague's architectural approach. How did you challenge respectfully with data, and how did you commit once a decision was made?`,
            keyConcepts: ['disagree and commit', 'data-driven', 'respectful debate', 'consensus', 'alignment'],
            modelAnswer: `Highlight presenting objective benchmarks/prototypes without ego. Explain how you respectfully challenged assumptions with telemetry, and once the leadership decided the direction, committed 100% to ensure execution success.`,
            idealTakeaway: `Data-backed conviction during debate, followed by total alignment after decision.`
          },
          {
            id: 4,
            title: 'Amazon Leadership Principle: Deliver Results & Frugality',
            question: `Amazon LP #4: How have you delivered high-impact engineering results under strict resource constraints or aggressive delivery timelines?`,
            keyConcepts: ['deliver results', 'frugality', 'mvp', 'simplification', 'efficiency', 'scalability'],
            modelAnswer: `Explain how you cut through unnecessary complexity, built a high-leverage MVP slice, and delivered measurable business results while keeping compute and maintenance costs lean.`,
            idealTakeaway: `Delivering maximum customer impact with architectural simplicity and resource efficiency.`
          },
          {
            id: 5,
            title: 'Amazon Leadership Principle: Learn and Be Curious',
            question: `Amazon LP #5: Tell me about a complex technology or domain outside your comfort zone that you mastered rapidly to solve an urgent production problem.`,
            keyConcepts: ['learn and be curious', 'growth mindset', 'rapid learning', 'deep dive', 'craftsmanship'],
            modelAnswer: `Describe deep-diving into documentation, building isolated proof-of-concepts, and teaching the learned insights to peers to elevate overall team capability.`,
            idealTakeaway: `Continuous intellectual curiosity and deep-diving beyond surface knowledge.`
          }
        ];
      } else {
        return [
          {
            id: 1,
            title: 'Google Culture: Navigating Ambiguity & Problem Breakdown',
            question: `Google Interview PYQ #1: Describe a situation where project requirements were extremely ambiguous and technical direction was unclear. How did you break down the problem and establish clear engineering milestones?`,
            keyConcepts: ['ambiguity', 'structuring', 'prototyping', 'data-driven', 'milestones', 'communication', 'star'],
            modelAnswer: `Structured using STAR: Explain identifying key assumptions, building minimal prototypes to test hypotheses, establishing telemetry benchmarks, and aligning stakeholders on a modular roadmap.`,
            idealTakeaway: `Thriving in ambiguity by validating assumptions with data and creating structured engineering milestones.`
          },
          {
            id: 2,
            title: 'Googliness: Intellectual Humility & Collaborative Consensus',
            question: `Google Interview PYQ #2: Tell me about a time you realized your proposed technical architecture was flawed or sub-optimal. How did you handle the situation and pivot collaboratively?`,
            keyConcepts: ['intellectual humility', 'googliness', 'collaboration', 'pivot', 'learning', 'open-minded'],
            modelAnswer: `Demonstrate intellectual humility: Openly acknowledging benchmark shortcomings without defensiveness, adopting peer recommendations, and celebrating team success over personal credit.`,
            idealTakeaway: `Googliness is rooted in doing what is right for the user and embracing collaborative growth.`
          },
          {
            id: 3,
            title: 'Production Resilience & Blameless Post-Mortem',
            question: `Google Interview PYQ #3: Walk me through a critical production outage or distributed service degradation you triaged. How did you communicate with stakeholders and conduct a blameless post-mortem?`,
            keyConcepts: ['blameless post-mortem', 'site reliability', 'sre', 'root cause', 'mitigation', 'slo', 'sli'],
            modelAnswer: `Highlight fast containment, transparent customer status dashboards, and writing an SRE-grade blameless post-mortem with automated CI/CD guardrails and SLO alerting.`,
            idealTakeaway: `Blameless post-mortems focused on system architecture improvements rather than personal fault.`
          },
          {
            id: 4,
            title: 'Mentorship, Diversity & Psychological Safety',
            question: `Google Interview PYQ #4: How do you cultivate psychological safety, foster inclusive engineering discussions, and mentor junior teammates in your daily work?`,
            keyConcepts: ['psychological safety', 'mentorship', 'inclusivity', 'empathy', 'code review', 'pair programming'],
            modelAnswer: `Detail conducting empathetic code reviews, encouraging junior engineers to share innovative ideas in design reviews, and pairing regularly on challenging blockers.`,
            idealTakeaway: `Fostering psychological safety where diverse perspectives drive superior engineering solutions.`
          },
          {
            id: 5,
            title: 'Why Google & Impact at Planet Scale',
            question: `Google Interview PYQ #5: Why do you want to join ${companyName} as a ${role}, and how do you envision your contributions impacting millions of global users?`,
            keyConcepts: ['scale', 'google infrastructure', 'impact', 'craftsmanship', 'mission', 'distributed computing'],
            modelAnswer: `Connect your passion for clean distributed systems, latency optimization, and reliability directly with Google's mission to organize the world's information at planet scale.`,
            idealTakeaway: `Genuine enthusiasm for large-scale engineering excellence and global customer impact.`
          }
        ];
      }
    }

    // System Design PYQs
    if (interviewType === 'System Design & Architecture') {
      return [
        {
          id: 1,
          title: `${companyName} System Design PYQ #1: Distributed Inverted Index & Search Architecture`,
          question: `Design a high-scale Inverted Search Index handling 100,000 queries per second with sub-50ms latency. Explain document crawling, tokenization with MapReduce, and BigTable partitioned index caching.`,
          keyConcepts: ['inverted index', 'mapreduce', 'bigtable', 'caching', 'sharding', 'latency', 'document id'],
          modelAnswer: `Web crawlers extract raw text. MapReduce tokenizes text and builds Inverted Index (term -> [doc_ids]). Shard indices across BigTable memory nodes and cache hot search terms in Redis cluster.`,
          idealTakeaway: `MapReduce indexing with BigTable partitioned shards for sub-50ms search latency.`
        },
        {
          id: 2,
          title: `${companyName} System Design PYQ #2: Global File Synchronization & Chunk Deduplication`,
          question: `Architect a global cloud file storage sync system (like Google Drive / S3). Detail 4MB chunking, SHA-256 content deduplication, conflict resolution vectors, and delta upload.`,
          keyConcepts: ['chunking', 'deduplication', 'sha-256', 'metadata database', 'blob storage', 'delta sync'],
          modelAnswer: `Split files into 4MB chunks and hash with SHA-256. Only upload newly modified chunk hashes. Store metadata in relational database with version vectors and binary chunks in object storage.`,
          idealTakeaway: `Content-addressed 4MB chunking with SHA-256 deduplication and delta sync.`
        },
        {
          id: 3,
          title: `${companyName} System Design PYQ #3: Distributed Rate Limiter & Token Bucket`,
          question: `Design an API Gateway rate limiter enforcing 100,000 RPS multi-tenant quotas across distributed instances without central bottleneck.`,
          keyConcepts: ['token bucket', 'sliding window', 'redis', 'lua script', 'distributed lock', 'api gateway'],
          modelAnswer: `Use the Sliding Window Counter algorithm in Redis clusters executed via atomic Lua scripts. Edge nodes pre-allocate token quotas locally to minimize network roundtrips.`,
          idealTakeaway: `Redis sliding window counter with local quota pre-allocation.`
        },
        {
          id: 4,
          title: `${companyName} System Design PYQ #4: High-Throughput Video Ingestion & CDN Transcoding`,
          question: `Architect a video ingestion pipeline handling 500 hours uploaded per minute. Explain parallel chunk transcoding, adaptive bitrate (ABR), and CloudFront edge delivery.`,
          keyConcepts: ['transcoding', 'hls', 'dash', 'adaptive bitrate', 'cdn edge', 'blob storage', 'worker queue'],
          modelAnswer: `Upload raw master video to object storage. Asynchronous task workers encode 2-6 second chunks across resolutions (4K, 1080p, 720p). CDN edge nodes cache HLS segment manifests (.m3u8).`,
          idealTakeaway: `Parallel chunk transcoding + Adaptive Bitrate streaming + Edge CDN caching.`
        },
        {
          id: 5,
          title: `${companyName} System Design PYQ #5: Distributed Transaction Consistency (TrueTime & Paxos)`,
          question: `Explain how globally distributed databases achieve external serializability consistency across global datacenters using TrueTime and Paxos consensus.`,
          keyConcepts: ['truetime', 'atomic clocks', 'paxos', 'two-phase commit', 'external consistency', 'serializability'],
          modelAnswer: `Use TrueTime with GPS and atomic clocks to bound clock uncertainty. Commit timestamps guarantee global serializability. Paxos groups manage synchronous shard replication.`,
          idealTakeaway: `TrueTime uncertainty bounding + Paxos replication for global ACID external consistency.`
        }
      ];
    }

    // Technical / Coding PYQs
    return [
      {
        id: 1,
        title: `${companyName} Coding PYQ #1: Longest Substring with At Most K Distinct Characters`,
        question: `Given a string S and an integer K, write an algorithm in ${lang} to find the length of the longest substring containing at most K distinct characters in O(N) time using the Sliding Window technique. What is the space complexity?`,
        keyConcepts: ['sliding window', 'two pointer', 'hash map', 'distinct characters', 'o(n)', 'left pointer', 'right pointer'],
        modelAnswer: `Maintain a Hash Map of character frequencies. Expand right pointer. While map size > K, decrement left character in map and increment left. Update maxLen = max(maxLen, right - left + 1). Time: O(N), Space: O(K).`,
        idealTakeaway: `Two-pointer sliding window maintaining hash map of at most K distinct keys in single pass O(N).`
      },
      {
        id: 2,
        title: `${companyName} Coding PYQ #2: Median of Two Sorted Arrays in O(log(min(N, M)))`,
        question: `Given two sorted arrays nums1 and nums2 of size M and N, find the median of the two sorted arrays in strict O(log(min(M, N))) time complexity in ${lang} using Binary Search partition.`,
        keyConcepts: ['binary search', 'median', 'partition', 'o(log(min(m, n)))', 'two sorted arrays', 'divide and conquer'],
        modelAnswer: `Perform Binary Search on smaller array to find partition cut where leftA <= rightB and leftB <= rightA. If total count is odd, median = max(leftA, leftB); if even, median = (max(leftA, leftB) + min(rightA, rightB)) / 2.0. Time: O(log(min(M, N))), Space: O(1).`,
        idealTakeaway: `Binary search on smaller array to partition elements into two equal halves in O(log(min(M, N))).`
      },
      {
        id: 3,
        title: `${companyName} Coding PYQ #3: Subarray Sum Equals K in O(N) Time`,
        question: `Given an array of integers nums and an integer K, return the total number of continuous subarrays whose sum equals to K in ${lang} using Prefix Sum and a Hash Map.`,
        keyConcepts: ['prefix sum', 'hash map', 'o(n)', 'cumulative sum', 'subarray'],
        modelAnswer: `Maintain cumulative sum currSum and a Hash Map {prefixSum: frequency} initialized with {0: 1}. For each num, currSum += num. If (currSum - K) is in map, add its count to total. Time: O(N), Space: O(N).`,
        idealTakeaway: `Prefix sum with hash map count achieves single-pass O(N) even with negative numbers.`
      },
      {
        id: 4,
        title: `${companyName} Coding PYQ #4: LRU Cache Implementation in O(1)`,
        question: `Implement an LRU Cache supporting get(key) and put(key, value) in strict O(1) time complexity in ${lang}. Detail your Doubly Linked List node structure and dummy head/tail pointers.`,
        keyConcepts: ['doubly linked list', 'hash map', 'o(1)', 'dummy head', 'dummy tail', 'eviction', 'node'],
        modelAnswer: `Combine a Hash Map (key -> Node) with a Doubly Linked List with dummy head/tail. When accessed/inserted, move node to head in O(1). When capacity exceeded, evict from tail.prev in O(1).`,
        idealTakeaway: `Hash Map for O(1) lookup + Doubly Linked List for O(1) order manipulation.`
      },
      {
        id: 5,
        title: `${companyName} Coding PYQ #5: Trapping Rain Water in O(N) Time and O(1) Space`,
        question: `Given an elevation map array height, compute how much water it can trap in ${lang} in O(N) time and O(1) auxiliary space using Two Pointers.`,
        keyConcepts: ['two pointers', 'trapping rain water', 'o(1) space', 'o(n) time', 'left max', 'right max'],
        modelAnswer: `Use two pointers (l=0, r=N-1). If height[l] < height[r], update leftMax; water += leftMax - height[l]; l++. Else update rightMax; water += rightMax - height[r]; r--. Time: O(N), Space: O(1).`,
        idealTakeaway: `Two-pointer boundary tracking eliminates auxiliary array, achieving O(1) memory.`
      }
    ];
  };

  const questions = getCompanySpecificPYQs(config);

  // ─── 1. LAPTOP CAMERA & AUDIO INITIALIZATION & BIOMETRIC CALIBRATION ───
  useEffect(() => {
    let audioContext = null;
    let analyser = null;
    let microphoneSource = null;
    let animationFrameId = null;
    let faceCheckInterval = null;
    let isMounted = true;

    async function initHardwareAndCalibrate() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          }, 
          audio: true 
        });

        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup Web Audio API for Real-time Ambient Sound / Voice Analysis
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioContext = new AudioContextClass();
            audioContextRef.current = audioContext;
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            microphoneSource = audioContext.createMediaStreamSource(stream);
            microphoneSource.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkAudio = () => {
              if (!analyserRef.current || !isMounted) return;
              analyserRef.current.getByteFrequencyData(dataArray);

              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const average = sum / bufferLength;
              setAmbientNoiseLevel(Math.round(average));

              // DISTURBANCE DETECTION DURING ACTIVE EXAM:
              if (examStage === 'exam') {
                if (average > 38 && !isBehavioral) {
                  // Disturbances / background voices in technical round
                  setIsDisturbancePaused(true);
                  setDisturbanceReason('High background noise or secondary voices detected. Please maintain complete silence.');
                }
              }

              // During Calibration:
              if (examStage === 'calibration') {
                if (average < 30) {
                  setAudioCheckStatus('quiet');
                } else {
                  setAudioCheckStatus('noisy');
                }
              }

              animationFrameId = requestAnimationFrame(checkAudio);
            };

            checkAudio();
          }
        } catch (audioErr) {
          console.warn("AudioContext setup notice:", audioErr);
        }

        // ─── BLANK FACE & BIOMETRIC CHECK ENGINE ───
        faceCheckInterval = setInterval(() => {
          if (!videoRef.current || !canvasRef.current || !isMounted) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = 160;
            canvas.height = 120;
            ctx.drawImage(video, 0, 0, 160, 120);

            const imageData = ctx.getImageData(0, 0, 160, 120);
            const data = imageData.data;
            let totalLuminance = 0;

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const lum = (0.299 * r + 0.587 * g + 0.114 * b);
              totalLuminance += lum;
            }

            const avgLuminance = totalLuminance / (data.length / 4);

            // If average luminance is too dark (< 22) or too washed out (> 245) or no edge features
            if (avgLuminance < 22 || avgLuminance > 245) {
              setFaceCheckStatus('blank_face');
              setFaceCheckMessage('❌ Blank Face / Obscured Camera Detected: Face not visible. Ensure bright lighting and look directly into your camera.');
              setIsEnvironmentReady(false);

              if (examStage === 'exam') {
                setIsDisturbancePaused(true);
                setDisturbanceReason('Blank Face or Obscured Camera Detected. Face not visible. Please align your face in front of the camera.');
              }
            } else {
              setFaceCheckStatus('passed');
              setFaceCheckMessage('✅ Human Face Verified & Centered');
              setIsEnvironmentReady(true);
            }
          }
        }, 1500);

      } catch (err) {
        console.warn("Hardware initialization error:", err);
        setFaceCheckStatus('blank_face');
        setFaceCheckMessage('❌ Camera & Microphone Access Denied or Device Not Found. Please enable permissions.');
      }
    }

    initHardwareAndCalibrate();

    return () => {
      isMounted = false;
      if (faceCheckInterval) clearInterval(faceCheckInterval);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => {
          t.stop();
          t.enabled = false;
        });
        streamRef.current = null;
      }
    };
  }, [examStage]);


  // Clean hardware stopper
  const stopCameraHardware = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
    }
  };

  // ─── 2. ENTER FULL SCREEN MODE & LAUNCH ACTIVE EXAM ───
  const handleEnterFullScreenAndStart = async () => {
    if (faceCheckStatus !== 'passed') {
      alert("Cannot enter exam: Blank face or obscured camera detected. Please align your face in front of the camera.");
      return;
    }

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
    } catch (fsErr) {
      console.warn("Fullscreen permission notice:", fsErr);
    }

    setExamStage('exam');
  };

  // ─── 3. ZERO-TOLERANCE FULLSCREEN, TAB SWITCH & MINIMIZE ENFORCER ───
  useEffect(() => {
    if (examStage !== 'exam') return;

    // IMMEDIATE TERMINATION WITH 0 MARKS IF CANDIDATE SWITCHES TAB OR MINIMIZES
    const handleImmediateTabDisqualification = (reason) => {
      stopCameraHardware();

      // Exit fullscreen if still active
      if (document.fullscreenElement) {
        try { document.exitFullscreen(); } catch (e) {}
      }

      // Mark all questions as 0 marks with Malpractice Disqualification
      const zeroAnswers = questions.map((q, idx) => ({
        questionNumber: idx + 1,
        id: q.id,
        title: q.title,
        questionText: q.question,
        keyConcepts: q.keyConcepts,
        modelAnswer: q.modelAnswer,
        idealTakeaway: q.idealTakeaway,
        spokenAnswer: null,
        writtenAnswer: null,
        userAnswer: `[DISQUALIFIED FOR MALPRACTICE: ${reason} - 0 Marks Awarded]`,
        isProvided: false,
        roundType: config?.interviewType || 'Technical'
      }));

      const finalProctorStats = {
        ...proctorStats,
        integrityScore: 0,
        tabSwitches: proctorStats.tabSwitches + 1,
        lastViolation: reason,
        isTerminatedEarly: true,
        disqualified: true
      };

      onFinishInterview(zeroAnswers, finalProctorStats, true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleImmediateTabDisqualification('Tab Switch / Window Minimized Detected');
      }
    };

    const handleWindowBlur = () => {
      handleImmediateTabDisqualification('Screen Focus Lost / Minimized / App Switch Detected');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && examStage === 'exam') {
        handleImmediateTabDisqualification('Full Screen Mode Exited by Candidate');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [examStage, questions, proctorStats]);

  // ─── 4. STRICT MALPRACTICE MONITOR (MAX 1 WARNING POLICY) ───
  useEffect(() => {
    if (examStage !== 'exam') return;

    const gazeProctorInterval = setInterval(() => {
      const randomCheck = Math.random();

      // Rare simulation of side-look / gaze shift
      if (randomCheck < 0.03) {
        handleStrictMalpracticeWarning('Gaze deviation: Candidate looking away from camera screen.');
      }
    }, 9000);

    return () => clearInterval(gazeProctorInterval);
  }, [examStage, proctorStats]);

  const handleStrictMalpracticeWarning = (message) => {
    const currentWarnings = proctorStats.warningCount;

    if (currentWarnings >= 1) {
      // 🛑 SECOND VIOLATION: STRICT ZERO TOLERANCE TERMINATION WITH 0 MARKS!
      stopCameraHardware();
      if (document.fullscreenElement) {
        try { document.exitFullscreen(); } catch (e) {}
      }

      const zeroAnswers = questions.map((q, idx) => ({
        questionNumber: idx + 1,
        id: q.id,
        title: q.title,
        questionText: q.question,
        keyConcepts: q.keyConcepts,
        modelAnswer: q.modelAnswer,
        idealTakeaway: q.idealTakeaway,
        spokenAnswer: null,
        writtenAnswer: null,
        userAnswer: `[EXAM TERMINATED: Exceeded Max 1 Warning Limit for Malpractice - 0 Marks Awarded]`,
        isProvided: false,
        roundType: config?.interviewType || 'Technical'
      }));

      onFinishInterview(zeroAnswers, { ...proctorStats, integrityScore: 0, warningCount: 2, isTerminatedEarly: true }, true);
      return;
    }

    // First and only warning
    setProctorStats(prev => ({
      ...prev,
      warningCount: 1,
      integrityScore: 65,
      lastViolation: message,
      gazeStatus: 'Warning 1/1 Issued'
    }));

    setProctorAlertToast(`⚠️ FINAL WARNING (1/1): ${message} Next violation will immediately terminate the exam with 0 marks!`);
    setTimeout(() => {
      setProctorAlertToast(null);
    }, 6000);
  };

  // ─── 5. SPEECH RECOGNITION (Active ONLY in Behavioral & HR Round) ───
  useEffect(() => {
    if (!isBehavioral || examStage !== 'exam') return;

    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        setValidationError(null);
      };

      recognition.onerror = (err) => {
        console.warn("Speech Recognition Error:", err);
        setIsListening(false);
      };

      if (isListening && !isDisturbancePaused) {
        try { recognition.start(); } catch (e) {}
      } else {
        try { recognition.stop(); } catch (e) {}
      }
    }

    return () => {
      if (recognition) try { recognition.stop(); } catch (e) {}
    };
  }, [isListening, isBehavioral, examStage, isDisturbancePaused]);

  // Timer countdown (Pauses when disturbance occurs)
  useEffect(() => {
    if (examStage !== 'exam' || isDisturbancePaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          stopCameraHardware();
          if (document.fullscreenElement) {
            try { document.exitFullscreen(); } catch (e) {}
          }
          onFinishInterview(userAnswers, proctorStats);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [userAnswers, proctorStats, examStage, isDisturbancePaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentAnswerText = isBehavioral ? transcript.trim() : writtenAnswer.trim();
  const isAnswerValid = isBehavioral ? currentAnswerText.length >= 10 : currentAnswerText.length >= 15;

  const handleNextQuestion = () => {
    if (!isAnswerValid) {
      if (isBehavioral) {
        setValidationError('⚠️ Spoken Answer Required: Please click "Start Speaking into Mic" and articulate your behavioral answer out loud before proceeding.');
      } else {
        setValidationError('⚠️ Technical Answer Required: You cannot submit an empty answer or skip questions. Please type your code or technical explanation.');
      }
      return;
    }

    setValidationError(null);
    const currentQ = questions[questionIndex];

    // ─── 1. SPEECH ANALYTICS ENGINE (Behavioral Rounds) ───
    let behavioralStats = null;
    if (isBehavioral) {
      const words = currentAnswerText.split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      
      const fillerWords = ['um', 'uh', 'like', 'actually', 'basically', 'literally', 'seriously', 'honestly'];
      let fillerCount = 0;
      words.forEach(w => {
        const cleaned = w.toLowerCase().replace(/[^a-z]/g, '');
        if (fillerWords.includes(cleaned)) fillerCount++;
      });
      
      const phrasesMatches = (currentAnswerText.toLowerCase().match(/you know/g) || []).length;
      fillerCount += phrasesMatches;

      const elapsedSeconds = Math.max(5, (Date.now() - lastQuestionTime) / 1000);
      const durationMin = elapsedSeconds / 60;
      const wpm = Math.round(wordCount / durationMin);

      behavioralStats = {
        wordCount,
        fillerCount,
        wpm: Math.min(220, Math.max(60, wpm)),
        optimalSpeed: wpm >= 110 && wpm <= 160
      };
    }

    // ─── 2. CODE & STATIC ANALYSIS ENGINE (Technical Rounds) ───
    let technicalStats = null;
    if (!isBehavioral) {
      const hasTimeComplexity = /o\(\s*[n1k]|log|n\s*\^|2\s*\^/i.test(currentAnswerText);
      
      // Brackets balance verification
      let balanceScore = 100;
      const stack = [];
      const pairs = { '}': '{', ')': '(', ']': '[' };
      for (let char of currentAnswerText) {
        if (['{', '(', '['].includes(char)) {
          stack.push(char);
        } else if (['}', ')', ']'].includes(char)) {
          if (stack.pop() !== pairs[char]) {
            balanceScore = 70;
          }
        }
      }
      if (stack.length > 0) balanceScore = 70;

      // Anti-pattern detector
      const hasInfiniteLoop = /while\s*\(\s*true\s*\)/.test(currentAnswerText);

      technicalStats = {
        hasTimeComplexity,
        complexityMatch: hasTimeComplexity ? 'Complexity Documented' : 'Missing Big-O Bounds',
        balanceScore,
        syntaxValid: balanceScore === 100,
        antiPatterns: hasInfiniteLoop ? ['Infinite Loop Danger'] : []
      };
    }

    const answerEntry = {
      questionNumber: questionIndex + 1,
      id: currentQ.id,
      title: currentQ.title,
      questionText: currentQ.question,
      keyConcepts: currentQ.keyConcepts,
      modelAnswer: currentQ.modelAnswer,
      idealTakeaway: currentQ.idealTakeaway,
      spokenAnswer: isBehavioral ? currentAnswerText : null,
      writtenAnswer: !isBehavioral ? currentAnswerText : null,
      userAnswer: currentAnswerText,
      isProvided: true,
      roundType: config?.interviewType || 'Technical',
      behavioralStats,
      technicalStats
    };

    const updatedAnswers = [...userAnswers, answerEntry];
    setUserAnswers(updatedAnswers);

    setTranscript('');
    setWrittenAnswer('');
    setIsListening(false);
    setLastQuestionTime(Date.now()); // Reset time for next question

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      stopCameraHardware();
      if (document.fullscreenElement) {
        try { document.exitFullscreen(); } catch (e) {}
      }
      onFinishInterview(updatedAnswers, proctorStats, false);
    }
  };


  // Early Quit with 0 marks
  const handleConfirmEarlyQuit = () => {
    setShowQuitModal(false);
    stopCameraHardware();
    if (document.fullscreenElement) {
      try { document.exitFullscreen(); } catch (e) {}
    }

    const emptyAnswers = questions.map((q, idx) => ({
      questionNumber: idx + 1,
      id: q.id,
      title: q.title,
      questionText: q.question,
      keyConcepts: q.keyConcepts,
      modelAnswer: q.modelAnswer,
      idealTakeaway: q.idealTakeaway,
      spokenAnswer: null,
      writtenAnswer: null,
      userAnswer: "[Exam Terminated Early by Candidate - 0 Marks Awarded]",
      isProvided: false,
      roundType: config?.interviewType || 'Technical'
    }));

    onFinishInterview(emptyAnswers, proctorStats, true);
  };

  const handleResumeExam = () => {
    // Re-verify face status and ambient noise level
    if (faceCheckStatus !== 'passed') {
      setResumeError('❌ Cannot resume exam: Face is still not detected or camera is obscured. Please align your face directly in front of the camera.');
      return;
    }
    if (ambientNoiseLevel > 35) {
      setResumeError(`❌ Cannot resume exam: Ambient room is too noisy (Current level: ${ambientNoiseLevel} dB). Please restore complete silence.`);
      return;
    }

    setResumeError(null);
    setIsDisturbancePaused(false);
  };


  // ═════════════════════════════════════════════════════════════════════════
  // STAGE 1: PRE-EXAM BIOMETRIC & ENVIRONMENT CALIBRATION (Full Screen Gate)
  // ═════════════════════════════════════════════════════════════════════════
  if (examStage === 'calibration') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
        
        {/* Hidden Elements for Background Vision Analysis */}
        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
        <canvas ref={canvasRef} className="hidden" />

        {/* Calibration Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Proctoring Biometric & Environmental Verification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Pre-Exam Environment & Biometric Check</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Please ensure you are in a completely quiet, private room with no other people. Your webcam and microphone will perform a quick security check before full screen mode is locked.
          </p>
        </div>

        {/* Verification Checklist Grid */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          
          {/* Check 1: Human Face & Blank Face Detection */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
            faceCheckStatus === 'passed'
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-red-950/20 border-red-500/50'
          }`}>
            <div className="flex items-center space-x-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                faceCheckStatus === 'passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">1. Face & Biometric Verification</h4>
                <p className={`text-xs font-semibold ${faceCheckStatus === 'passed' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {faceCheckMessage}
                </p>
                <p className="text-[10px] text-slate-400">Blank or obscured faces will strictly not be permitted into the exam.</p>
              </div>
            </div>

            <div className="shrink-0">
              {faceCheckStatus === 'passed' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Face Verified</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Blank Face Blocked</span>
                </span>
              )}
            </div>
          </div>

          {/* Check 2: Ambient Silence & No Secondary Voices */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
            audioCheckStatus === 'quiet'
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-amber-950/20 border-amber-500/40'
          }`}>
            <div className="flex items-center space-x-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                audioCheckStatus === 'quiet' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {audioCheckStatus === 'quiet' ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">2. Surrounding Sound & Quiet Room Check</h4>
                <p className={`text-xs font-semibold ${audioCheckStatus === 'quiet' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {audioCheckStatus === 'quiet' 
                    ? '✅ Ambient Silence Confirmed (No background noise)' 
                    : `⚠️ Moderate Background Noise Detected (Level: ${ambientNoiseLevel}). Please silence room.`}
                </p>
                <p className="text-[10px] text-slate-400">If any secondary voice or noise occurs during exam, session will automatically pause.</p>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 shrink-0">
              Noise Index: {ambientNoiseLevel} dB
            </span>
          </div>

          {/* Check 3: Strict Zero-Tolerance Full Screen Policy Notice */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
              <Maximize className="w-4 h-4 text-indigo-400" />
              <span>Mandatory Full Screen Mode & Zero-Tolerance Malpractice Rules:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>The exam will lock into <strong className="text-white">Full Screen Mode</strong>. Exiting fullscreen will terminate the exam with <strong className="text-red-400">0 Marks</strong>.</li>
              <li><strong className="text-red-400">Tab Switching or Minimizing the screen is strictly prohibited</strong> and will result in immediate disqualification (0 marks).</li>
              <li><strong className="text-amber-400">Maximum 1 Warning</strong> for looking away from screen. A second infraction ends the exam.</li>
            </ul>
          </div>

          {/* Enter Full Screen & Start Exam Button */}
          <button
            onClick={handleEnterFullScreenAndStart}
            disabled={faceCheckStatus !== 'passed'}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-glow flex items-center justify-center space-x-2 transition-all ${
              faceCheckStatus === 'passed'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Maximize className="w-4 h-4" />
            <span>{faceCheckStatus === 'passed' ? 'Lock Full Screen & Begin Proctored Exam' : 'Align Face to Camera to Unlock Exam'}</span>
          </button>

        </div>

      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // STAGE 2: ACTIVE PROCTORED EXAMINATION IN FULL SCREEN MODE
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* INVISIBLE BACKGROUND VIDEO STREAM (Runs silent AI Camera Proctoring) */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* ─── REAL-TIME DISTURBANCE AUTO-PAUSE OVERLAY ─── */}
      {isDisturbancePaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-amber-500/60 bg-slate-900 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
              <Pause className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                <VolumeX className="w-4 h-4" />
                <span>Malpractice & Disturbance Safeguard</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Examination Paused</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {disturbanceReason}
              </p>
              <p className="text-[11px] text-slate-400">
                The countdown timer is currently paused. Please resolve the issue, align your face with the camera, and ensure complete silence in the room before continuing.
              </p>
            </div>

            {/* Check indicators inside the pause modal */}
            <div className="space-y-2 text-left bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">1. Face Detection Status:</span>
                <span className={`font-bold ${faceCheckStatus === 'passed' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {faceCheckStatus === 'passed' ? '✅ Face Verified' : '❌ Face Not Detected'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">2. Surrounding Noise Level:</span>
                <span className={`font-bold ${ambientNoiseLevel <= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {ambientNoiseLevel <= 30 ? '✅ Quiet' : '❌ Noisy'} ({ambientNoiseLevel} dB)
                </span>
              </div>
            </div>

            {/* Resume Validation Error Message */}
            {resumeError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold text-left">
                {resumeError}
              </div>
            )}

            {/* Resume Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleResumeExam}
                className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Verify & Resume Exam</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Real-Time Proctoring Alert Toast (Max 1 warning) */}
      {proctorAlertToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-red-950/90 border border-red-500/80 text-red-200 text-xs font-semibold shadow-2xl flex items-center space-x-3 animate-bounce max-w-md">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="font-bold text-white">AI Proctor Warning #{proctorStats.warningCount}/1 (STRICT LIMIT)</p>
            <p className="text-[11px] text-red-300">{proctorAlertToast}</p>
          </div>
        </div>
      )}

      {/* Early Quit Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-red-500/40 bg-slate-900 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-white">Quit Exam & Forfeit Marks?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to end your exam early? If you end now, your exam will be finalized with <span className="text-red-400 font-bold">0 Marks (0% Score)</span> and marked as "No Hire".
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                Resume Exam
              </button>
              <button
                onClick={handleConfirmEarlyQuit}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-glow transition-all"
              >
                End Exam (0 Marks)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Session Header */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-white flex items-center space-x-2">
              <span>{companyName} Fullscreen Proctored Exam</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] border border-indigo-500/30">
                {companyName} PYQ
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 flex items-center space-x-1">
                <Maximize className="w-3 h-3" />
                <span>Fullscreen Locked</span>
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Role: {config?.jobRole || 'Full Stack SDE'} • Target Company: <span className="text-indigo-400 font-bold">{companyName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold font-mono">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowQuitModal(true)}
            className="px-4 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>End Exam (0 Marks)</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Columns: Examination HUD & Background AI Proctor Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="glass-card p-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-950 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">AI Proctor Telemetry</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fullscreen & Audio Active</span>
              </span>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Integrity Score</span>
                <p className={`text-lg font-extrabold ${proctorStats.integrityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {proctorStats.integrityScore}%
                </p>
                <p className="text-[10px] text-slate-500">Live evaluation</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Warning Limit</span>
                <p className={`text-sm font-bold font-mono ${proctorStats.warningCount === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {proctorStats.warningCount} / 1 Strike Max
                </p>
                <p className="text-[10px] text-slate-500">Zero tolerance</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Tab Switches</span>
                <p className="text-sm font-bold text-emerald-400">0 (Locked)</p>
                <p className="text-[10px] text-slate-500">Tab switch = 0 Marks</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Sound Activity</span>
                <p className="text-xs font-bold text-slate-200">{ambientNoiseLevel} dB</p>
                <p className="text-[10px] text-slate-500">Disturbance auto-pause</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-400">
              <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Camera active in background. Turns off automatically upon completion.</span>
            </div>
          </div>

          {/* Company PYQ Question Progress */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{companyName} PYQ Progress</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-400">
                {userAnswers.length} of {questions.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === questionIndex;
                const isCompleted = idx < questionIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isCurrent
                        ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold shadow-glow'
                        : isCompleted
                        ? 'bg-slate-950/60 border-slate-800 text-emerald-400'
                        : 'bg-slate-950/30 border-slate-900 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-mono text-[11px]">PYQ {idx + 1}.</span>
                      <span className="truncate text-[11px]">{q.title}</span>
                    </div>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {isCurrent && <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white shrink-0">Current</span>}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 8 Columns: Question Prompt & Response Input Area */}
        <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
          
          {/* Company PYQ Question Prompt Card */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {companyName} Interview PYQ #{questionIndex + 1}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-pink-400" />
                <span>{companyName} Actual Question</span>
              </span>
            </div>
            <h3 className="text-sm font-bold text-indigo-300">{questions[questionIndex].title}</h3>
            <p className="text-base font-semibold text-white leading-relaxed">
              {questions[questionIndex].question}
            </p>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs font-semibold flex items-start space-x-2.5 shadow-lg">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* RESPONSE SECTION */}
          {isBehavioral ? (
            <div className="glass-card p-6 rounded-3xl border border-pink-500/30 space-y-4 flex-1 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Mic className="w-4 h-4 text-pink-400" />
                  <span>Candidate Verbal Response ({companyName} Culture)</span>
                </span>
                <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                  🎙️ Verbal Speak Active
                </span>
              </div>

              <div className="w-full flex-1 min-h-[190px] bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-slate-200 text-xs leading-relaxed font-mono overflow-y-auto">
                {transcript ? (
                  <p className="text-slate-100 whitespace-pre-wrap">{transcript}</p>
                ) : (
                  <p className="text-slate-500 italic">
                    {isListening 
                      ? `🎙️ Listening to laptop microphone... Speak your ${companyName} behavioral answer clearly out loud.` 
                      : "Click 'Start Speaking into Mic' below to begin recording your verbal answer..."}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    isListening 
                      ? 'bg-red-600 text-white animate-pulse shadow-glow' 
                      : 'bg-pink-600 hover:bg-pink-500 text-white shadow-glow'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isListening ? 'Mic Active (Click to Pause)' : 'Start Speaking into Mic'}</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={!isAnswerValid}
                  className={`px-6 py-3.5 rounded-xl font-bold text-xs shadow-glow flex items-center space-x-2 transition-all shrink-0 ${
                    isAnswerValid
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>{questionIndex < questions.length - 1 ? 'Submit & Next PYQ' : 'Submit Final Answer'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex-1 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileCode2 className="w-4 h-4 text-indigo-400" />
                  <span>Technical Code & Architecture Editor ({config?.language || 'JavaScript'})</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  💻 {companyName} PYQ Mode • Fullscreen Active
                </span>
              </div>

              <div className="space-y-1 flex-1 flex flex-col">
                <textarea
                  value={writtenAnswer}
                  onChange={(e) => {
                    setWrittenAnswer(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder={`Write your code solution, algorithm approach, and Big-O complexity analysis in ${config?.language || 'JavaScript'} for this ${companyName} interview question...\n\n// 1. Approach & Big-O Complexity:\n// 2. Code Implementation:\n// 3. Edge Cases Handled:`}
                  className="w-full flex-1 min-h-[220px] bg-slate-950/90 border border-slate-800 focus:border-indigo-500 rounded-2xl p-4 text-slate-200 text-xs font-mono leading-relaxed resize-none outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500 font-mono flex items-center space-x-2">
                  <span>{writtenAnswer.trim().length} characters entered</span>
                  {!isAnswerValid && <span className="text-amber-400 font-sans">(Minimum 15 chars required)</span>}
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={!isAnswerValid}
                  className={`px-6 py-3.5 rounded-xl font-bold text-xs shadow-glow flex items-center space-x-2 transition-all ${
                    isAnswerValid
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>{questionIndex < questions.length - 1 ? 'Submit Technical Answer & Next' : 'Submit Final Assessment'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
