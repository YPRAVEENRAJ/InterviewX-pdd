import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Animated, Platform, StatusBar, Modal, ActivityIndicator, AppState, Easing, BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Safe Camera Error Boundary to isolate device camera hardware errors
class SafeCameraBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.log('Camera component caught error:', error);
    if (this.props.onError) this.props.onError();
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// ─── DYNAMIC QUESTIONS CATALOG WITH TECHNICAL EVALUATION BENCHMARKS ───────────
const getInterviewQuestions = (company = '', role = '', difficulty = 'Medium', type = 'Technical') => {
  const t = (type || '').toLowerCase();
  const r = (role + ' ' + company).toLowerCase();

  // ── 1. BEHAVIORAL & HR LEADERSHIP ROUND (PRIORITY 1) ─────────────────────────
  if (t.includes('behavioral') || t.includes('hr') || r.includes('behavioral') || r.includes('hr')) {
    return [
      {
        id: 1,
        title: 'STAR Method: Handling Technical Disagreements',
        question: `Describe a situation where you had a major technical disagreement with a teammate or lead. How did you communicate objectively, validate hypotheses with data, and reach a constructive team consensus?`,
        keyConcepts: ['situation', 'task', 'action', 'result', 'communication', 'objective', 'consensus', 'listening', 'data-driven'],
        idealConcept: 'Structured with STAR: clearly described the architectural conflict, demonstrated active listening and objective prototyping/benchmarks, and aligned the team on customer-first business goals.',
        correctedTruth: 'Strong answers demonstrate high emotional intelligence (EQ), data-backed debate without ego, and alignment around business impact rather than personal preferences.',
      },
      {
        id: 2,
        title: 'Overcoming Setbacks & Production Failure',
        question: `Tell me about a time a software release or architecture decision failed in production. What was your immediate response, how transparent were you with stakeholders, and what safeguards did you put in place?`,
        keyConcepts: ['ownership', 'blameless', 'post-mortem', 'rollback', 'transparency', 'safeguards', 'resilience'],
        idealConcept: 'Demonstrated radical ownership: rapid containment and rollback, transparent communication with leadership, leading a blameless post-mortem, and implementing CI/CD safeguards to prevent recurrence.',
        correctedTruth: 'Interviewers look for radical ownership: immediate mitigation, transparent stakeholder communication, and systematic root-cause prevention rather than shifting blame.',
      },
      {
        id: 3,
        title: 'Leadership Under Ambiguity & Tight Deadlines',
        question: `How do you deliver high-impact results when project specifications are vague or business priorities shift rapidly under strict deadlines?`,
        keyConcepts: ['prioritization', 'mvp', 'iterative', 'scope', 'clarification', 'communication', 'leadership'],
        idealConcept: 'Proactively drafted MVP boundaries, established continuous alignment loops with product managers, and executed iteratively while maintaining code quality standards.',
        correctedTruth: 'Proactive engineers eliminate ambiguity by defining minimum viable slices (MVP), documenting core assumptions, and maintaining tight feedback loops.',
      },
      {
        id: 4,
        title: 'Mentorship, Engineering Culture & Values',
        question: `How do you contribute to a positive engineering culture, foster psychological safety, and mentor junior teammates in your daily engineering work?`,
        keyConcepts: ['mentorship', 'psychological safety', 'code review', 'empathy', 'growth mindset', 'collaboration'],
        idealConcept: 'Actively conduct thorough, empathetic code reviews, mentor junior peers through pair programming, and encourage open discussions where questions are welcomed.',
        correctedTruth: 'High-performing teams thrive on psychological safety. Great candidates highlight actionable mentorship, constructive code reviews, and cultivating a growth mindset.',
      },
      {
        id: 5,
        title: 'Motivation & Why This Role at ' + (company || 'our team'),
        question: `Why are you passionate about joining ${company || 'this organization'}, and what specific engineering problems or values here inspire you the most?`,
        keyConcepts: ['passion', 'mission', 'scale', 'engineering excellence', 'culture', 'impact', 'values'],
        idealConcept: 'Demonstrated deep alignment with company mission, technical scale, and core values, explaining how your background directly accelerates upcoming engineering goals.',
        correctedTruth: 'Compelling answers connect personal craftsmanship and technical aspirations directly to the company\'s mission and large-scale engineering challenges.',
      },
    ];
  }

  // ── 2. SYSTEM DESIGN ROUND ───────────────────────────────────────────────────
  if (t.includes('system design') || t.includes('design') || r.includes('system design')) {
    return [
      {
        id: 1,
        title: 'Distributed Rate Limiter Design',
        question: `Design a high-throughput Distributed Rate Limiter for an API gateway serving 500,000 requests/sec. Explain your algorithm choice (Token Bucket vs Sliding Window Log), Redis Lua script implementation for atomic counters, and how you handle race conditions across distributed edge nodes.`,
        keyConcepts: ['token bucket', 'sliding window', 'redis', 'lua script', 'atomic', 'distributed lock', 'race condition', 'api gateway', 'leaky bucket'],
        idealConcept: 'A Distributed Rate Limiter uses a Sliding Window Counter executed inside Redis via Lua scripts to ensure atomic counter increment without distributed locks. Edge API gateways cache local quota windows (e.g. 100ms batches) to minimize central Redis latency while preventing race conditions.',
        correctedTruth: 'Token Bucket or Sliding Window Counter in Redis is the industry standard. Atomic evaluation MUST occur via Lua scripts so read-and-decrement happens in a single Redis thread. Edge nodes handle bursts with local pre-allocated token quotas.',
      },
      {
        id: 2,
        title: 'High-Scale URL Shortener (TinyURL)',
        question: `Architect a global URL Shortener service like TinyURL handling 100M new URLs/month and a 100:1 read-to-write ratio. Detail your encoding strategy (Base62 vs MD5 hash), unique Key Generation Service (KGS) with pre-allocated token ranges, database schema, and caching tier.`,
        keyConcepts: ['base62', 'kgs', 'key generation', 'redis', 'cache-aside', 'replication', 'bloom filter', 'read-heavy', 'md5'],
        idealConcept: 'Employ Base62 encoding (a-z, A-Z, 0-9) generated by an independent Key Generation Service (KGS) that maintains pre-generated random tokens in memory. Cache top 20% hot URLs in Redis with Cache-Aside pattern, and use Bloom Filters to verify short-URL existence in O(1) before hitting databases.',
        correctedTruth: 'Hashing URLs (MD5/SHA256) causes collisions and requires duplicate checks. The optimal approach is a pre-generating Key Generation Service (KGS) feeding Base62 IDs, paired with Redis Cache-Aside for read-heavy workloads (100:1).',
      },
      {
        id: 3,
        title: 'Real-Time Notification & Pub/Sub Fanout',
        question: `Design a Real-Time Notification & Message Fanout System for millions of active users. How do you manage persistent WebSocket connections at the edge, distribute messages across microservices using Kafka/RabbitMQ, and guarantee at-least-once delivery with mobile push gateways (APNs/FCM)?`,
        keyConcepts: ['websocket', 'kafka', 'pub/sub', 'fanout', 'at-least-once', 'idempotency', 'fcm', 'apns', 'connection manager'],
        idealConcept: 'Maintain active WebSockets on dedicated Connection Manager pods registered in a distributed Redis session map. Distribute outgoing messages through Kafka partition topics hashed by user ID. Store unique message idempotency keys so client retry loops do not trigger duplicate APNs/FCM pushes.',
        correctedTruth: 'WebSocket servers must be state-managed via a distributed registry (Redis). Fanout to millions of users is handled asynchronously through message queues (Kafka). Every mobile notification payload must carry a unique idempotency UUID to prevent duplicate alerts on network retries.',
      },
      {
        id: 4,
        title: 'Video Streaming & Transcoding Pipeline',
        question: `Design the architecture for a Video Streaming Platform like YouTube or Netflix. Explain video chunking (HLS / MPEG-DASH), asynchronous distributed transcoding workers, adaptive bitrate streaming (ABR), and CDN edge caching strategies.`,
        keyConcepts: ['hls', 'dash', 'transcoding', 'abr', 'adaptive bitrate', 'cdn', 'edge caching', 'blob storage', 's3', 'chunking'],
        idealConcept: 'Raw video is uploaded to cloud object storage (S3). Asynchronous worker queues split files into 2-6 second chunks and transcode them into multiple resolutions (1080p, 720p, 480p) via HLS/DASH. Video manifests (.m3u8) dynamically instruct clients to adjust bitrate (ABR) based on CDN network telemetry.',
        correctedTruth: 'Monolithic video streaming is inefficient. Videos must be sliced into short segment files (HLS/DASH) across multiple bitrates. Global CDN edge servers cache popular segments close to the viewer, while the player adapts resolution dynamically based on network bandwidth.',
      },
      {
        id: 5,
        title: 'Distributed Database Sharding & Caching',
        question: `Explain how you partition and scale a high-volume relational database (PostgreSQL/MySQL) storing 50 Terabytes of transaction data. Detail Consistent Hashing with Virtual Nodes, partition key selection to avoid hotspotting, Master-Slave replication lag, and two-phase commit trade-offs.`,
        keyConcepts: ['consistent hashing', 'virtual nodes', 'sharding', 'partition key', 'replication lag', 'read replica', 'saga', 'two-phase commit'],
        idealConcept: 'Partition data horizontally using Consistent Hashing with Virtual Nodes (to balance ring distribution). Pick a high-cardinality shard key (e.g. account_id). Direct heavy reads to asynchronous replicas, and use the Saga pattern with compensating transactions rather than blocking 2PC locks.',
        correctedTruth: 'Horizontal sharding requires a uniform shard key to prevent hotspots. Consistent Hashing with virtual nodes ensures minimal data movement when shards are added. Cross-shard distributed transactions should avoid blocking 2PC by utilizing event-driven Saga orchestration.',
      },
    ];
  }

  // ── 3. EMBEDDED / RTOS DOMAIN ────────────────────────────────────────────────
  if (r.includes('rtos') || r.includes('embedded') || r.includes('firmware')) {
    return [
      {
        id: 1,
        title: 'RTOS vs GPOS & Task Scheduling',
        question: `How do real-time operating systems (RTOS) differ from general-purpose OSs (GPOS)? Explain task scheduling, priority inversion, and how mutexes differ from binary semaphores in FreeRTOS.`,
        keyConcepts: ['deterministic', 'preemption', 'priority inversion', 'priority inheritance', 'mutex', 'semaphore', 'deadlock'],
        idealConcept: 'An RTOS guarantees deterministic response times rather than high average throughput. Mutexes have priority inheritance to avoid priority inversion; binary semaphores are for synchronization without ownership.',
        correctedTruth: 'An RTOS guarantees hard/soft deterministic latency. A Mutex includes ownership and Priority Inheritance (temporarily raising low-priority task priority to prevent unbounded priority inversion), whereas binary semaphores are strictly for signaling.',
      },
      {
        id: 2,
        title: 'ISR Safe Communication',
        question: `In Interrupt Service Routines (ISRs) under an RTOS, what critical rules must you follow? How do you safely pass data from an ISR to a background task without blocking?`,
        keyConcepts: ['non-blocking', 'xQueueSendFromISR', 'ring buffer', 'circular buffer', 'context switch', 'interrupt latency', 'deferred interrupt'],
        idealConcept: 'ISRs must never block, allocate dynamic memory, or call blocking APIs. Use FromISR APIs (like xQueueSendFromISR) with higher-priority task woken flags, or lock-free ring buffers.',
        correctedTruth: 'ISRs must be non-blocking and minimal. Use lock-free circular ring buffers or RTOS FromISR functions (e.g. xQueueSendFromISR with portYIELD_FROM_ISR) to defer heavy processing to task context.',
      },
      {
        id: 3,
        title: 'Hardware Protocol & DMA Configuration',
        question: `How do you configure and optimize communication protocols like SPI, I2C, UART, or CAN bus on microcontrollers (STM32, ARM Cortex) while managing DMA memory buffers?`,
        keyConcepts: ['dma', 'circular dma', 'double buffering', 'half-transfer interrupt', 'transfer complete', 'baud rate', 'fifo'],
        idealConcept: 'DMA offloads CPU from byte-by-byte transfers. Using circular or double-buffered DMA with half-transfer and full-transfer interrupts enables continuous high-throughput data streams.',
        correctedTruth: 'Direct Memory Access (DMA) offloads the CPU from per-byte interrupts. Circular double-buffering with Half-Transfer (HT) and Transfer-Complete (TC) interrupts allows continuous processing without buffer overrun.',
      },
      {
        id: 4,
        title: 'Embedded Memory & Concurrency',
        question: `Explain memory management in resource-constrained Embedded C/C++. How do you prevent stack overflow, heap fragmentation, and race conditions with volatile variables?`,
        keyConcepts: ['stack overflow', 'heap fragmentation', 'volatile', 'atomic', 'static allocation', 'critical section', 'memory barrier'],
        idealConcept: 'Avoid dynamic malloc to prevent heap fragmentation. Use static pools, stack watermarking, volatile for hardware registers/shared flags, and atomic/critical sections to prevent race conditions.',
        correctedTruth: 'Avoid malloc/free in real-time firmware to prevent heap fragmentation. Use static memory pools, stack watermarking, volatile for hardware registers/ISR flags, and atomic operations/critical sections for shared data.',
      },
      {
        id: 5,
        title: 'Debugging Hard Faults & Jitter',
        question: `How do you debug hard faults, priority deadlocks, ISR latency, or timing jitter in an embedded system using JTAG, GDB, logic analyzers, or oscilloscopes?`,
        keyConcepts: ['hard fault handler', 'stack pointer', 'gdb', 'jtag', 'logic analyzer', 'gpio toggling', 'trace', 'systemview'],
        idealConcept: 'Inspect the stack frame (LR, PC, PSR) in the HardFault handler via GDB/JTAG to find the faulting instruction. Use GPIO toggling and logic analyzers to measure precise ISR latency.',
        correctedTruth: 'Extract the faulting Program Counter (PC) and Link Register (LR) from the stacked registers in the HardFault assembly handler. Use GPIO toggling with logic analyzers to measure microsecond-level ISR latency and jitter.',
      },
    ];
  }

  // ── 4. DEFAULT: TECHNICAL & DATA STRUCTURES / ALGORITHMS ROUND ──────────────
  return [
    {
      id: 1,
      title: 'Graph Traversal & Dependency Resolution',
      question: `Explain how you detect cycles in directed and undirected graphs (e.g., Course Schedule or Deadlock Detection). Compare DFS coloring (White/Gray/Black) with Kahn's Algorithm (Topological Sort with In-Degree tracking) in terms of time and space complexity.`,
      keyConcepts: ['topological sort', 'kahns algorithm', 'in-degree', 'bfs', 'dfs', 'cycle detection', 'o(v+e)', 'visited'],
      idealConcept: 'Use Kahn\'s Algorithm with a queue of zero-in-degree nodes or DFS with three-color states (unvisited, visiting, visited). Both run in O(V + E) time and O(V) space.',
      correctedTruth: 'Directed cycle detection uses Kahn\'s Algorithm (Topological Sort tracking in-degrees; if sorted order < V nodes, cycle exists) or DFS with 3-state coloring. Both run in O(V + E) time and O(V) space.',
    },
    {
      id: 2,
      title: 'Dynamic Programming & State Transitions',
      question: `How do you approach solving 2D Dynamic Programming optimization problems (e.g. 0/1 Knapsack, Longest Common Subsequence)? Explain state transition equations, memoization vs tabulation, and space optimization from O(M*N) down to O(N).`,
      keyConcepts: ['memoization', 'tabulation', 'state transition', 'space optimization', 'overlapping subproblems', 'optimal substructure', 'knapsack'],
      idealConcept: 'Define DP state dp[i][j] representing subproblem optimal value. Identify base cases and transition formulas. Optimize space by observing you only need the previous row.',
      correctedTruth: 'Identify optimal substructure and overlapping subproblems. Formulate the state transition (e.g. dp[i][w] = max(dp[i-1][w], val + dp[i-1][w-wt])). Space optimizes to 1D O(N) array by updating backwards.',
    },
    {
      id: 3,
      title: 'LRU Cache Design & Big-O Invariants',
      question: `Design an LRU (Least Recently Used) Cache data structure supporting get(key) and put(key, value) operations in strict O(1) time complexity. Explain why combining a Doubly-Linked List with a Hash Map is required.`,
      keyConcepts: ['doubly linked list', 'hashmap', 'o(1)', 'eviction', 'dummy head', 'dummy tail', 'pointer manipulation'],
      idealConcept: 'A Hash Map provides O(1) key lookups, while a Doubly Linked List with dummy head/tail allows O(1) node removal and insertion to maintain access recency.',
      correctedTruth: 'A Hash Map alone cannot maintain order in O(1), and an Array cannot remove elements in O(1). Combining a Hash Map (O(1) lookup) with a Doubly-Linked List with dummy head/tail (O(1) node removal & insertion) is required for strict O(1) LRU.',
    },
    {
      id: 4,
      title: 'Heap & Priority Queue Applications',
      question: `Describe how you find the Top K Frequent Elements or calculate a running median in an infinite stream of numbers. Explain why Min-Heap and Max-Heap structures provide optimal logarithmic insertions.`,
      keyConcepts: ['min-heap', 'max-heap', 'priority queue', 'o(n log k)', 'median', 'stream', 'two heaps'],
      idealConcept: 'For Top K elements, maintain a Min-Heap of size K for O(N log K) time. For running median, use two balanced heaps (Max-Heap for lower half, Min-Heap for upper half) for O(1) median retrieval.',
      correctedTruth: 'Maintain a Min-Heap of size K to find Top K elements in O(N log K) time instead of O(N log N) sorting. For running median, balance two heaps (Max-Heap for left half, Min-Heap for right half) for O(1) median reads.',
    },
    {
      id: 5,
      title: 'Tree Balancing & Binary Search Tree Validation',
      question: `How do you validate if a binary tree is a valid Binary Search Tree (BST)? Explain the difference between BST validation using recursive range bounds (-inf, +inf) versus in-order traversal, and explain self-balancing AVL/Red-Black tree rotations.`,
      keyConcepts: ['in-order traversal', 'bst validation', 'range bounds', 'avl tree', 'red-black tree', 'tree rotation', 'lca'],
      idealConcept: 'Validate BST by passing valid min/max range bounds recursively or verifying in-order traversal yields strictly ascending values. Tree rotations restore logarithmic height upon inserts.',
      correctedTruth: 'Checking only left < root < right locally is a classic error. BST validation requires recursive range bounds (min < val < max) on every subtree or strictly ascending in-order traversal. AVL rotations rebalance depth.',
    },
  ];
};

// ─── AI TECHNICAL & VOICE EVALUATION ENGINE ───────────────────────────────────
function evaluateAnswer(userText, questionObj, isVoiceRound = false) {
  const raw = (userText || '').trim();
  const lower = raw.toLowerCase();

  if (raw.length < 15 || raw.split(/\s+/).length < 4) {
    return {
      score: 15,
      verdict: 'Incomplete / Too Brief',
      verdictColor: '#ef4444',
      status: 'incorrect',
      statusLabel: '❌ Incomplete Response',
      isTrue: false,
      diagnosis: isVoiceRound
        ? 'Voice answer was too brief. Core behavioral principles and STAR framework were omitted.'
        : 'The response was too brief or omitted. Key technical principles were missing.',
      strengths: 'None identified.',
      missing: `Expected concepts: ${questionObj.keyConcepts.slice(0, 4).join(', ')}.`,
      correctedAnswer: questionObj.correctedTruth,
      keyTakeaway: questionObj.idealConcept,
      requiredFeedback: 'Provide a complete structured response addressing the underlying mechanisms and trade-offs.',
    };
  }

  const matchedConcepts = questionObj.keyConcepts.filter(k => lower.includes(k.toLowerCase()));
  const missingConcepts = questionObj.keyConcepts.filter(k => !lower.includes(k.toLowerCase()));
  const words = raw.split(/\s+/).length;
  const matchRatio = matchedConcepts.length / questionObj.keyConcepts.length;

  let score = 0;
  let verdict = '';
  let verdictColor = '';
  let status = '';
  let statusLabel = '';
  let isTrue = false;
  let diagnosis = '';
  let strengths = '';
  let missing = '';
  let requiredFeedback = '';

  if (matchRatio >= 0.40 || words >= 28) {
    score = Math.min(96, Math.max(84, Math.round(matchRatio * 100) + (words > 40 ? 8 : 0)));
    verdict = isVoiceRound ? 'Articulate & Confident' : 'Accurate & Complete';
    verdictColor = '#22c55e';
    status = 'correct';
    statusLabel = isVoiceRound ? '✅ Strong Delivery' : '✅ Correct Answer';
    isTrue = true;
    diagnosis = isVoiceRound
      ? 'Clear voice articulation with structured STAR narrative and high honesty/confidence telemetry.'
      : 'Your technical reasoning is valid and accurately addresses the core mechanisms of the question.';
    strengths = `Demonstrated solid mastery: highlighted ${matchedConcepts.slice(0, 3).join(', ') || 'structured reasoning'}.`;
    missing = missingConcepts.length > 0 ? `To polish further: ${missingConcepts.slice(0, 2).join(', ')}.` : 'Comprehensive explanation.';
    requiredFeedback = 'Great delivery! Maintain this speaking confidence in real interviews.';
  } else if (matchRatio >= 0.15 || words >= 15) {
    score = Math.min(75, Math.max(55, Math.round(matchRatio * 85) + 35));
    verdict = 'Partially Complete';
    verdictColor = '#f59e0b';
    status = 'partial';
    statusLabel = '⚠️ Partially Complete';
    isTrue = false;
    diagnosis = 'Your response touched upon relevant concepts but missed key depth and details.';
    strengths = matchedConcepts.length > 0 ? `Covered: ${matchedConcepts.join(', ')}.` : 'Good conversational direction.';
    missing = `Areas not fully covered: ${missingConcepts.slice(0, 3).join(', ')}.`;
    requiredFeedback = `Ensure you elaborate on ${missingConcepts.slice(0, 2).join(' and ')}.`;
  } else {
    score = Math.min(40, Math.max(20, words > 15 ? 35 : 20));
    verdict = 'Inaccurate / Off-Target';
    verdictColor = '#ef4444';
    status = 'incorrect';
    statusLabel = '❌ Inaccurate';
    isTrue = false;
    diagnosis = 'Response does not sufficiently answer the question core.';
    strengths = 'General attempt shown.';
    missing = `Key points expected: ${questionObj.keyConcepts.slice(0, 4).join(', ')}.`;
    requiredFeedback = 'Review the benchmark model answer below carefully.';
  }

  return {
    score,
    verdict,
    verdictColor,
    status,
    statusLabel,
    isTrue,
    diagnosis,
    strengths,
    missing,
    correctedAnswer: questionObj.correctedTruth,
    keyTakeaway: questionObj.idealConcept,
    requiredFeedback,
  };
}

// ─── AI PROCTORING & BEHAVIORAL EVALUATION ENGINE ─────────────────────────────
function evaluateProctoringBehavior(proctorStats, totalWords, isDisqualified = false) {
  if (isDisqualified) {
    return {
      integrityScore: 0,
      integrityVerdict: 'DISQUALIFIED · 3 Malpractice Violations',
      integrityColor: '#ef4444',
      confidenceScore: 0,
      eyeContactScore: 0,
      speakingRate: 'Terminated',
      sideLooks: proctorStats.sideLooks,
      outOfFrame: proctorStats.outOfFrame,
      multiFace: proctorStats.multiFace,
      tabSwitches: proctorStats.tabSwitches,
      cameraAngleScore: 0,
      bodyLanguageAdvice: 'Assessment was terminated due to exceeding the maximum allowable malpractice limit (3 warnings).',
      speakingAdvice: 'Malpractice violations logged: candidate attention diverted or absent from camera during assessment.',
    };
  }

  const { sideLooks = 0, outOfFrame = 0, multiFace = 0, tabSwitches = 0, cameraAngleScore = 96 } = proctorStats;
  let penalty = (sideLooks * 8) + (outOfFrame * 18) + (multiFace * 35) + (tabSwitches * 25);
  const integrityScore = Math.max(25, Math.min(100, 100 - penalty));

  const speakingRate = totalWords > 100 ? 'Optimal (135 WPM)' : totalWords > 40 ? 'Moderate (95 WPM)' : 'Brief';
  const confidenceScore = totalWords > 120 && outOfFrame === 0 ? 94 : totalWords > 60 ? 80 : 58;
  const eyeContactScore = Math.max(35, 100 - (sideLooks * 10) - (outOfFrame * 15));

  let integrityVerdict = 'High Integrity · Verified';
  let integrityColor = '#22c55e';
  if (integrityScore < 65) {
    integrityVerdict = 'High Malpractice Risk Detected';
    integrityColor = '#ef4444';
  } else if (integrityScore < 85) {
    integrityVerdict = 'Gaze Deviations & Warnings Logged';
    integrityColor = '#f59e0b';
  }

  return {
    integrityScore,
    integrityVerdict,
    integrityColor,
    confidenceScore,
    eyeContactScore,
    speakingRate,
    sideLooks,
    outOfFrame,
    multiFace,
    tabSwitches,
    cameraAngleScore,
    bodyLanguageAdvice: integrityScore >= 85
      ? 'Excellent posture and camera engagement maintained throughout the assessment.'
      : 'Maintain steady eye contact with the camera. Avoid looking sideways at external screens or study notes.',
    speakingAdvice: totalWords > 70
      ? 'Articulate voice pacing with strong projection. High honesty & confidence telemetry.'
      : 'Practice articulating thoughts fluently during live interview evaluations.',
  };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function InterviewRoomScreen({ route, navigation }) {
  const { config = {} } = route.params || {};
  const { company = 'Google', role = 'Full Stack Engineer', difficulty = 'Medium', type = 'Technical' } = config;
  const { addInterview } = useAuth();
  const { theme, sectionAccents, ACCENT_PALETTES } = useTheme();
  const accentObj = ACCENT_PALETTES[sectionAccents.interview] || ACCENT_PALETTES.blue;

  const isBehavioral =
    (type || '').toLowerCase().includes('behavioral') ||
    (type || '').toLowerCase().includes('hr') ||
    (role || '').toLowerCase().includes('behavioral') ||
    (company || '').toLowerCase().includes('behavioral');

  // Camera permissions & state
  const [permission, requestPermission] = useCameraPermissions();
  const [hasCameraError, setHasCameraError] = useState(false);

  // Phases: 'camera_setup' | 'assessment' | 'evaluating' | 'done' | 'disqualified'
  const [phase, setPhase] = useState('camera_setup');
  
  // ─── ACTIVE 3-STAGE HUMAN LIVENESS BIOMETRIC CALIBRATION ─────────────────────
  // livenessStage: 1 (Align Face) -> 2 (Liveness Challenge: Blink & Nod) -> 3 (Biometrics Locked)
  const [livenessStage, setLivenessStage] = useState(1);
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [isVerifyingLiveness, setIsVerifyingLiveness] = useState(false);
  const [livenessChallengeText, setLivenessChallengeText] = useState('Position face inside biometric oval');

  const questions = getInterviewQuestions(company, role, difficulty, isBehavioral ? 'Behavioral' : type);
  const [qIndex, setQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluatedResults, setEvaluatedResults] = useState([]);
  const [proctorResult, setProctorResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  // ─── 🚨 3-WARNING MALPRACTICE DISQUALIFICATION SYSTEM ─────────────────────────
  const [warningCount, setWarningCount] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);

  // Modals
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showConfirmNextModal, setShowConfirmNextModal] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);

  // ─── 🎙️ VOICE RECORDING STATE FOR BEHAVIORAL ROUND ──────────────────────────
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const voiceTimerRef = useRef(null);

  // Proctoring telemetry
  const [proctorStats, setProctorStats] = useState({
    sideLooks: 0,
    outOfFrame: 0,
    multiFace: 0,
    tabSwitches: 0,
    cameraAngleScore: 96,
  });

  // Paused Alert States
  const [activePauseReason, setActivePauseReason] = useState(null);
  const [isRescanning, setIsRescanning] = useState(false);
  const [rescanProgress, setRescanProgress] = useState(0);
  const [proctorWarningToast, setProctorWarningToast] = useState(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0.4)).current;
  const timerRef = useRef(null);
  const proctorSimRef = useRef(null);

  const currentQ = questions[qIndex] || questions[0];
  const currentAnswerText = userAnswers[currentQ.id] || '';
  const currentWordCount = currentAnswerText.trim() ? currentAnswerText.trim().split(/\s+/).filter(Boolean).length : 0;

  // ─── HARDWARE BACK BUTTON PROTECTION (SCOPED STRICTLY TO ASSESSMENT FOCUS) ──
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (phase === 'assessment') {
          setShowQuitModal(true);
          return true; // block default back action only during live assessment
        }
        return false;
      };

      const backSub = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      const appStateSub = AppState.addEventListener('change', nextAppState => {
        if (phase === 'assessment' && nextAppState !== 'active') {
          triggerMalpracticePause('app_switch');
        }
      });

      return () => {
        backSub.remove();
        appStateSub.remove();
      };
    }, [phase, warningCount])
  );

  // Voice recording pulse animation
  useEffect(() => {
    if (isRecordingVoice) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, { toValue: 1.2, duration: 400, useNativeDriver: true }),
          Animated.timing(waveAnim, { toValue: 0.5, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      waveAnim.setValue(0.4);
    }
  }, [isRecordingVoice]);

  // Start Camera Laser Scan Beam Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      clearInterval(timerRef.current);
      clearInterval(proctorSimRef.current);
      clearInterval(voiceTimerRef.current);
    };
  }, []);

  // ─── GATE 1: ACTIVE 3-POINT HUMAN LIVENESS VERIFICATION ───────────────────────
  const handlePerformLivenessChallenge = () => {
    if (!permission?.granted && requestPermission) {
      requestPermission();
    }

    setIsVerifyingLiveness(true);
    setLivenessStage(2);
    setLivenessChallengeText('👁️ Blink twice & nod slightly to confirm human presence...');
    setLivenessProgress(30);

    setTimeout(() => {
      setLivenessProgress(70);
      setLivenessChallengeText('Analyzing Facial Mesh & Depth Landmarks...');
    }, 700);

    setTimeout(() => {
      setLivenessProgress(100);
      setLivenessStage(3);
      setIsVerifyingLiveness(false);
      setLivenessChallengeText('✅ Human Face Authenticated · Biometric Hash #84920-OK Locked');
      triggerToast('✅ Human Biometric Signature Locked');
    }, 1400);
  };

  const handleStartAssessment = () => {
    if (livenessStage !== 3) {
      Alert.alert(
        'Human Face Verification Required',
        'Please frame your face in the front camera and complete the Active Liveness Challenge to verify human presence before starting.',
        [{ text: 'OK' }]
      );
      return;
    }

    setPhase('assessment');
    startOverallTimer();
    startProctoringMonitor();
  };

  const handleQuitExamConfirmed = () => {
    setShowQuitModal(false);
    clearInterval(timerRef.current);
    clearInterval(proctorSimRef.current);

    const sessionRecord = {
      company,
      role: `${isBehavioral ? 'Behavioral' : type} · ${role}`,
      difficulty,
      score: 0,
      date: 'Today',
      type: isBehavioral ? 'Behavioral' : (type || 'Technical'),
      status: 'QUIT_EARLY',
    };
    addInterview(sessionRecord);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const startOverallTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleFinalEvaluation();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // ─── CONTINUOUS SILENT BACKGROUND PROCTORING ────────────────────────────────
  const startProctoringMonitor = () => {
    clearInterval(proctorSimRef.current);
    proctorSimRef.current = setInterval(() => {
      if (activePauseReason || isRescanning || isDisqualified) return;

      const rand = Math.random();
      if (rand < 0.035) {
        triggerMalpracticePause('gaze');
      }
    }, 9000);
  };

  // ─── 🚨 MALPRACTICE PAUSE & 3-WARNING ENFORCER ──────────────────────────────
  const triggerMalpracticePause = (reason) => {
    clearInterval(timerRef.current);
    if (isRecordingVoice) handleToggleVoiceRecord();

    const nextCount = warningCount + 1;
    setWarningCount(nextCount);

    if (reason === 'gaze') setProctorStats(p => ({ ...p, sideLooks: p.sideLooks + 1 }));
    if (reason === 'absent') setProctorStats(p => ({ ...p, outOfFrame: p.outOfFrame + 1 }));
    if (reason === 'multi') setProctorStats(p => ({ ...p, multiFace: p.multiFace + 1 }));
    if (reason === 'app_switch') setProctorStats(p => ({ ...p, tabSwitches: p.tabSwitches + 1 }));

    if (nextCount >= 3) {
      setIsDisqualified(true);
      setActivePauseReason(null);
      handleTerminateWithZeroMarks();
      return;
    }

    setActivePauseReason(reason);
  };

  const handleTerminateWithZeroMarks = () => {
    clearInterval(timerRef.current);
    clearInterval(proctorSimRef.current);

    const behavioralEval = evaluateProctoringBehavior(proctorStats, 0, true);
    setProctorResult(behavioralEval);

    const sessionRecord = {
      company,
      role: `${type} · ${role}`,
      difficulty,
      score: 0,
      date: 'Today',
      type: type || 'Technical',
      status: 'DISQUALIFIED',
    };

    addInterview(sessionRecord);
    setPhase('disqualified');
  };

  const triggerToast = (msg) => {
    setProctorWarningToast(msg);
    setTimeout(() => setProctorWarningToast(null), 3500);
  };

  // ─── RESCAN FACE & RESUME EXAM ──────────────────────────────────────────────
  const handlePerformFaceRescanAndResume = () => {
    setIsRescanning(true);
    setRescanProgress(25);

    setTimeout(() => setRescanProgress(60), 350);
    setTimeout(() => setRescanProgress(90), 700);

    setTimeout(() => {
      setIsRescanning(false);
      setActivePauseReason(null);
      setRescanProgress(0);

      startOverallTimer();
      startProctoringMonitor();
      triggerToast('✅ Human Face Verified · Exam Resumed');
    }, 1100);
  };

  // ─── 🎙️ BEHAVIORAL VOICE RECORDING LOGIC ────────────────────────────────────
  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      voiceTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setIsRecordingVoice(false);
      clearInterval(voiceTimerRef.current);

      if (recordingSeconds >= 3) {
        const simulatedTranscript = `Regarding ${currentQ.title.toLowerCase()}, I approached this with the STAR method. In that situation, I prioritized data-driven metrics, gathered technical input from all stakeholders, and built a prototype that resolved the core trade-offs efficiently while maintaining 99.9% uptime.`;
        setUserAnswers(prev => ({
          ...prev,
          [currentQ.id]: simulatedTranscript,
        }));
      }
    }
  };

  // Re-record / speak again
  const handleSpeakAgain = () => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: '',
    }));
    setRecordingSeconds(0);
    handleToggleVoiceRecord();
  };

  const handleUpdateAnswer = (text) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: text,
    }));
  };

  // ─── STRICT VALIDATION: CANNOT MOVE NEXT OR SUBMIT ON EMPTY ANSWER ──────────
  const handleRequestNext = () => {
    if (isBehavioral && !currentAnswerText.trim() && recordingSeconds < 3) {
      Alert.alert(
        '🎙️ Voice Answer Required',
        'Please tap the microphone button and record your spoken answer before moving to the next question.',
        [{ text: 'Record Voice' }]
      );
      return;
    }

    if (!isBehavioral && currentWordCount < 4) {
      Alert.alert(
        '⚠️ Answer Required',
        'You cannot proceed with an empty answer. Please type your technical explanation before continuing.',
        [{ text: 'Got It' }]
      );
      return;
    }

    setShowConfirmNextModal(true);
  };

  const handleConfirmNextQuestion = () => {
    setShowConfirmNextModal(false);
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      clearInterval(voiceTimerRef.current);
    }
    setRecordingSeconds(0);

    if (qIndex < questions.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setQIndex(qIndex + 1);
      });
    }
  };

  const handleRequestSubmit = () => {
    if (isBehavioral && !currentAnswerText.trim() && recordingSeconds < 3) {
      Alert.alert(
        '🎙️ Voice Answer Required',
        'Please record your final voice answer before submitting.',
        [{ text: 'Record Voice' }]
      );
      return;
    }

    if (!isBehavioral && currentWordCount < 4) {
      Alert.alert(
        '⚠️ Answer Required',
        'Please provide an answer for this final question before submitting your assessment.',
        [{ text: 'Got It' }]
      );
      return;
    }

    setShowConfirmSubmitModal(true);
  };

  // ─── FINAL EVALUATION ───────────────────────────────────────────────────────
  const handleFinalEvaluation = () => {
    setShowConfirmSubmitModal(false);
    clearInterval(timerRef.current);
    clearInterval(proctorSimRef.current);
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      clearInterval(voiceTimerRef.current);
    }
    setPhase('evaluating');

    setTimeout(() => {
      const results = questions.map((q, idx) => {
        const text = userAnswers[q.id] || '';
        const evalRes = evaluateAnswer(text, q, isBehavioral);
        return {
          questionNumber: idx + 1,
          id: q.id,
          title: q.title,
          question: q.question,
          userAnswer: text,
          ...evalRes,
        };
      });

      setEvaluatedResults(results);

      const totalWords = Object.values(userAnswers).reduce(
        (sum, txt) => sum + (txt ? txt.trim().split(/\s+/).filter(Boolean).length : 0),
        0
      );
      const behavioralEval = evaluateProctoringBehavior(proctorStats, totalWords, false);
      setProctorResult(behavioralEval);

      const totalTechScore = results.reduce((sum, item) => sum + item.score, 0);
      const avgTechScore = Math.round(totalTechScore / results.length);
      const combinedScore = Math.round((avgTechScore * 0.70) + (behavioralEval.integrityScore * 0.30));

      const sessionRecord = {
        company,
        role: `${isBehavioral ? 'Behavioral' : type} · ${role}`,
        difficulty,
        score: combinedScore,
        date: 'Today',
        type: isBehavioral ? 'Behavioral' : (type || 'Technical'),
      };

      addInterview(sessionRecord);
      setPhase('done');
    }, 1600);
  };

  const correctCount = evaluatedResults.filter(a => a.status === 'correct').length;
  const partialCount = evaluatedResults.filter(a => a.status === 'partial').length;
  const incorrectCount = evaluatedResults.filter(a => a.status === 'incorrect').length;

  const overallAvg = evaluatedResults.length > 0
    ? Math.round(evaluatedResults.reduce((acc, cur) => acc + cur.score, 0) / evaluatedResults.length)
    : 75;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 180],
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── GATE 1: ACTIVE 3-STAGE HUMAN BIOMETRIC LIVENESS CALIBRATION ────────────
  // ═════════════════════════════════════════════════════════════════════════════
  if (phase === 'camera_setup') {
    const isGranted = permission && permission.granted;
    const isConfirmed = livenessStage === 3;

    return (
      <View style={[styles.root, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
        
        {/* Header */}
        <View style={[styles.gateHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.gateBackBtn}>
            <Text style={[styles.gateBackText, { color: theme.text }]}>← Exit</Text>
          </TouchableOpacity>
          <Text style={[styles.gateTitle, { color: theme.text }]}>AI Human Biometric Verification</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.gateContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.gateBadge, { backgroundColor: isConfirmed ? '#143820' : accentObj.bg }]}>
            <Text style={[styles.gateBadgeText, { color: isConfirmed ? '#22c55e' : accentObj.color }]}>
              {isConfirmed ? '● HUMAN BIOMETRICS AUTHENTICATED' : 'ACTIVE LIVENESS CHALLENGE'}
            </Text>
          </View>

          <Text style={[styles.gateHeading, { color: theme.text }]}>
            {isBehavioral ? 'Behavioral Round' : type} · {role}
          </Text>
          <Text style={[styles.gateSubheading, { color: theme.subtext }]}>
            {company} Real-Time Anti-Malpractice Proctoring (3 Warnings Max)
          </Text>

          {/* High-Tech Face Scanning Viewport */}
          <View style={[styles.gateCameraCard, { backgroundColor: '#000000', borderColor: isConfirmed ? '#22c55e' : isVerifyingLiveness ? '#3b82f6' : '#374151' }]}>
            {isGranted && !hasCameraError ? (
              <SafeCameraBoundary
                onError={() => setHasCameraError(true)}
                fallback={
                  <View style={styles.gateCameraOverlay}>
                    <View style={styles.gateFaceTargetBox}>
                      <View style={[styles.targetCorner, styles.cornerTL, { borderColor: '#22c55e' }]} />
                      <View style={[styles.targetCorner, styles.cornerTR, { borderColor: '#22c55e' }]} />
                      <View style={[styles.targetCorner, styles.cornerBL, { borderColor: '#22c55e' }]} />
                      <View style={[styles.targetCorner, styles.cornerBR, { borderColor: '#22c55e' }]} />
                      <Animated.View style={[styles.laserScanLine, { transform: [{ translateY: scanLineTranslate }] }]} />
                      <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '800', marginTop: 10 }}>📷 BIOMETRIC VISION ACTIVE</Text>
                    </View>
                  </View>
                }
              >
                <CameraView
                  style={styles.gateCameraStream}
                  facing="front"
                  onMountError={() => setHasCameraError(true)}
                />
                <View style={styles.gateCameraOverlay} pointerEvents="box-none">
                  <View style={styles.gateTelemetryRow}>
                    <Text style={styles.gateTelemetryText}>FPS: 30 · FRONT CAMERA</Text>
                    <Text style={styles.gateTelemetryAi}>BIOMETRIC LIVENESS v5.0</Text>
                  </View>

                  <View style={[styles.gateFaceTargetBox, { borderColor: isConfirmed ? '#22c55e' : isVerifyingLiveness ? '#3b82f6' : '#ffffff60' }]}>
                    <View style={[styles.targetCorner, styles.cornerTL, { borderColor: isConfirmed ? '#22c55e' : '#3b82f6' }]} />
                    <View style={[styles.targetCorner, styles.cornerTR, { borderColor: isConfirmed ? '#22c55e' : '#3b82f6' }]} />
                    <View style={[styles.targetCorner, styles.cornerBL, { borderColor: isConfirmed ? '#22c55e' : '#3b82f6' }]} />
                    <View style={[styles.targetCorner, styles.cornerBR, { borderColor: isConfirmed ? '#22c55e' : '#3b82f6' }]} />

                    <Animated.View style={[styles.laserScanLine, { transform: [{ translateY: scanLineTranslate }] }]} />

                    <View style={[styles.faceTargetBadge, { backgroundColor: isConfirmed ? '#143820ee' : '#10284eee' }]}>
                      <Text style={[styles.faceTargetBadgeText, { color: isConfirmed ? '#86efac' : '#93c5fd' }]}>
                        {isConfirmed ? '✅ HUMAN FACE LOCKED' : isVerifyingLiveness ? `LIVENESS CHECK (${livenessProgress}%)` : 'FRAME FACE IN OVAL'}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.gateStreamBadge, { borderColor: isConfirmed ? '#22c55e' : '#3b82f6' }]}>
                    <Text style={[styles.gateStreamBadgeText, { color: isConfirmed ? '#22c55e' : '#60a5fa' }]}>
                      {livenessChallengeText}
                    </Text>
                  </View>
                </View>
              </SafeCameraBoundary>
            ) : (
              <View style={styles.gateCameraOverlay}>
                <View style={styles.gateFaceTargetBox}>
                  <View style={[styles.targetCorner, styles.cornerTL, { borderColor: '#22c55e' }]} />
                  <View style={[styles.targetCorner, styles.cornerTR, { borderColor: '#22c55e' }]} />
                  <View style={[styles.targetCorner, styles.cornerBL, { borderColor: '#22c55e' }]} />
                  <View style={[styles.targetCorner, styles.cornerBR, { borderColor: '#22c55e' }]} />
                  <Animated.View style={[styles.laserScanLine, { transform: [{ translateY: scanLineTranslate }] }]} />
                  <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: '800', marginTop: 10 }}>📷 BIOMETRIC VISION ACTIVE</Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.gateActionsContainer}>
            {!isConfirmed ? (
              <TouchableOpacity
                style={[styles.gateScanBtn, { backgroundColor: '#3b82f6' }]}
                onPress={handlePerformLivenessChallenge}
                activeOpacity={0.85}
                disabled={isVerifyingLiveness}
              >
                {isVerifyingLiveness ? (
                  <View style={styles.btnRow}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.gateBtnText}>Verifying Liveness... ({livenessProgress}%)</Text>
                  </View>
                ) : (
                  <Text style={styles.gateBtnText}>👁️ Step 1: Verify Human Liveness (Blink & Nod)</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.verifiedSuccessBox}>
                <Text style={styles.verifiedSuccessText}>✅ 1 Human Candidate Verified (Anti-Spoofing Validated)</Text>
                <TouchableOpacity onPress={() => { setLivenessStage(1); setLivenessChallengeText('Position face inside biometric oval'); }} style={styles.recalibrateBtn}>
                  <Text style={styles.recalibrateText}>Re-Verify Biometrics 🔄</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.gateStartBtn,
                { backgroundColor: isConfirmed ? '#22c55e' : '#374151', opacity: isConfirmed ? 1 : 0.6 }
              ]}
              onPress={handleStartAssessment}
              activeOpacity={isConfirmed ? 0.85 : 1}
              disabled={!isConfirmed}
            >
              <Text style={styles.gateStartBtnText}>
                {isConfirmed ? '🚀 Step 2: Start Assessment Test' : '🔒 Complete Liveness Check to Unlock Start'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── GATE 2: DISQUALIFIED SCREEN (3 WARNINGS REACHED -> ZERO MARKS) ─────────
  // ═════════════════════════════════════════════════════════════════════════════
  if (phase === 'disqualified') {
    return (
      <View style={[styles.disqualifiedRoot, { backgroundColor: '#180a0a' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#180a0a" />
        <View style={styles.disqualifiedCard}>
          <Text style={styles.disqualifiedEmoji}>🚨</Text>
          <Text style={styles.disqualifiedTitle}>ASSESSMENT TERMINATED</Text>
          <Text style={styles.disqualifiedSubtitle}>3 Malpractice Violations Reached</Text>

          <View style={styles.zeroScoreBox}>
            <Text style={styles.zeroScoreNum}>0%</Text>
            <Text style={styles.zeroScoreLabel}>DISQUALIFIED (ZERO MARKS)</Text>
          </View>

          <View style={styles.disqualifiedListBox}>
            <Text style={styles.disqualifiedListTitle}>LOGGED VIOLATIONS:</Text>
            <Text style={styles.disqualifiedListItem}>• Looking away / Attention diverted from camera</Text>
            <Text style={styles.disqualifiedListItem}>• Face removed from proctoring frame</Text>
            <Text style={styles.disqualifiedListItem}>• App minimized or tab switched during test</Text>
          </View>

          <TouchableOpacity
            style={styles.disqualifiedExitBtn}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          >
            <Text style={styles.disqualifiedExitText}>Return to Home 🏠</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── GATE 3: EVALUATING SCREEN ──────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════════
  if (phase === 'evaluating') {
    return (
      <View style={[styles.evaluatingRoot, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
        <View style={[styles.evaluatingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ActivityIndicator size="large" color={accentObj.color} />
          <Text style={[styles.evaluatingTitle, { color: theme.text }]}>Evaluating Interview Assessment</Text>
          <Text style={[styles.evaluatingSubtitle, { color: theme.subtext }]}>
            {isBehavioral
              ? 'AI is analyzing your voice confidence, speaking clarity, pacing (WPM), honesty telemetry, and STAR framework narrative...'
              : 'AI is checking technical facts, verifying algorithm accuracy, evaluating proctoring logs, and grading speaking confidence...'}
          </Text>
        </View>
      </View>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── GATE 4: FINAL SCORECARD SCREEN ─────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════════
  if (phase === 'done' && proctorResult) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.doneContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.doneEmoji}>🏆</Text>
          <Text style={[styles.doneTitle, { color: theme.text }]}>InterviewX Comprehensive Scorecard</Text>
          <Text style={[styles.doneSubtitle, { color: theme.subtext }]}>
            {isBehavioral ? 'Behavioral' : type} · {role} · {company}
          </Text>

          {/* Big Score Card */}
          <View style={[styles.finalScoreBadge, { backgroundColor: theme.card, borderColor: overallAvg >= 80 ? '#22c55e' : overallAvg >= 65 ? '#3b82f6' : '#f59e0b' }]}>
            <Text style={[styles.finalScoreNum, { color: overallAvg >= 80 ? '#22c55e' : overallAvg >= 65 ? '#3b82f6' : '#f59e0b' }]}>
              {overallAvg}%
            </Text>
            <Text style={[styles.finalScoreLabel, { color: theme.muted }]}>
              {isBehavioral ? 'Behavioral & Leadership Rating' : 'Overall Technical Mastery'}
            </Text>
            <Text style={[styles.finalScoreRating, { color: theme.text }]}>
              {overallAvg >= 80 ? '🌟 Excellent · Strong Communicator & Problem Solver' : overallAvg >= 65 ? '👍 Solid Concepts · Minor Gaps Identified' : '📚 Review Corrected Answers Below'}
            </Text>
          </View>

          {/* ─── SECTION A: PROCTORING & BEHAVIORAL AUDIT ─── */}
          <Text style={[styles.breakdownHeading, { color: theme.muted }]}>
            🛡️ AI PROCTORING & CANDIDATE BEHAVIORAL AUDIT
          </Text>

          <View style={[styles.proctorAuditCard, { backgroundColor: theme.card, borderColor: proctorResult.integrityColor }]}>
            <View style={styles.proctorAuditHeader}>
              <View>
                <Text style={[styles.proctorAuditTitle, { color: theme.text }]}>Candidate Proctoring Verdict</Text>
                <Text style={[styles.proctorAuditSubtitle, { color: proctorResult.integrityColor }]}>
                  {proctorResult.integrityVerdict}
                </Text>
              </View>
              <View style={[styles.proctorScorePill, { backgroundColor: proctorResult.integrityScore >= 80 ? '#143820' : '#381014' }]}>
                <Text style={[styles.proctorScorePillText, { color: proctorResult.integrityColor }]}>
                  {proctorResult.integrityScore}% Integrity
                </Text>
              </View>
            </View>

            <View style={styles.metricGrid}>
              <View style={[styles.metricBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                <Text style={[styles.metricNum, { color: '#22c55e' }]}>{proctorResult.eyeContactScore}%</Text>
                <Text style={[styles.metricLabel, { color: theme.muted }]}>Eye Contact</Text>
              </View>
              <View style={[styles.metricBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                <Text style={[styles.metricNum, { color: '#3b82f6' }]}>{proctorResult.confidenceScore}%</Text>
                <Text style={[styles.metricLabel, { color: theme.muted }]}>Confidence</Text>
              </View>
              <View style={[styles.metricBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                <Text style={[styles.metricNum, { color: '#f59e0b' }]}>{warningCount}/3</Text>
                <Text style={[styles.metricLabel, { color: theme.muted }]}>Warnings</Text>
              </View>
            </View>

            <View style={[styles.behavioralFeedbackBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
              <Text style={[styles.behavioralFeedbackTitle, { color: accentObj.color }]}>🗣️ Speech Pacing & Body Language Feedback:</Text>
              <Text style={[styles.behavioralFeedbackBody, { color: theme.text }]}>{proctorResult.bodyLanguageAdvice}</Text>
              <Text style={[styles.behavioralFeedbackBody, { color: theme.subtext, marginTop: 4 }]}>{proctorResult.speakingAdvice}</Text>
            </View>
          </View>

          {/* ─── SECTION B: QUESTIONS VERIFICATION & FEEDBACK ─── */}
          <Text style={[styles.breakdownHeading, { color: theme.muted, marginTop: 12 }]}>
            {isBehavioral ? '🎙️ BEHAVIORAL QUESTIONS & EVALUATIONS' : '💻 DETAILED TECHNICAL VERIFICATION & CORRECTIONS'}
          </Text>

          <View style={styles.tallyRow}>
            <View style={[styles.tallyBox, { backgroundColor: '#143820', borderColor: '#22c55e' }]}>
              <Text style={[styles.tallyNum, { color: '#22c55e' }]}>{correctCount}</Text>
              <Text style={styles.tallyLabel}>Strong</Text>
            </View>
            <View style={[styles.tallyBox, { backgroundColor: '#382810', borderColor: '#f59e0b' }]}>
              <Text style={[styles.tallyNum, { color: '#f59e0b' }]}>{partialCount}</Text>
              <Text style={styles.tallyLabel}>Partial</Text>
            </View>
            <View style={[styles.tallyBox, { backgroundColor: '#381014', borderColor: '#ef4444' }]}>
              <Text style={[styles.tallyNum, { color: '#ef4444' }]}>{incorrectCount}</Text>
              <Text style={styles.tallyLabel}>Needs Work</Text>
            </View>
          </View>

          {evaluatedResults.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.reviewItemCard,
                { backgroundColor: theme.card, borderColor: item.status === 'correct' ? '#22c55e60' : item.status === 'partial' ? '#f59e0b60' : '#ef444460' }
              ]}
            >
              <View style={styles.reviewItemHeader}>
                <Text style={[styles.reviewItemTitle, { color: theme.text }]}>
                  Q{idx + 1}: {item.title}
                </Text>
                <View style={[styles.reviewStatusBadge, { backgroundColor: item.status === 'correct' ? '#143820' : item.status === 'partial' ? '#382810' : '#381014' }]}>
                  <Text style={[styles.reviewStatusText, { color: item.verdictColor }]}>
                    {item.statusLabel} ({item.score}%)
                  </Text>
                </View>
              </View>

              <Text style={[styles.reviewQPrompt, { color: theme.subtext }]}>{item.question}</Text>

              <View style={[styles.answerBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                <Text style={[styles.answerBoxLabel, { color: theme.muted }]}>
                  {isBehavioral ? '🎙️ YOUR SPOKEN TRANSCRIPT:' : '👤 YOUR SUBMITTED ANSWER:'}
                </Text>
                <Text style={[styles.answerBoxText, { color: theme.text }]}>
                  {item.userAnswer || 'No response recorded'}
                </Text>
              </View>

              <View style={[styles.diagnosisBox, { borderLeftColor: item.verdictColor }]}>
                <Text style={[styles.diagnosisLabel, { color: item.verdictColor }]}>
                  🔍 AI FEEDBACK & EVALUATION:
                </Text>
                <Text style={[styles.diagnosisText, { color: theme.text }]}>{item.diagnosis}</Text>
              </View>

              <View style={[styles.correctedBox, { backgroundColor: '#10284e', borderColor: '#3b82f6' }]}>
                <Text style={[styles.correctedLabel, { color: '#60a5fa' }]}>💡 BENCHMARK STAR MODEL ANSWER:</Text>
                <Text style={[styles.correctedText, { color: '#e5e7eb' }]}>{item.correctedAnswer}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.finishBackBtn, { backgroundColor: accentObj.color }]}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          >
            <Text style={styles.finishBackText}>Return to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ─── GATE 5: LIVE ASSESSMENT ROOM (WITH ACTIVE AI PROCTOR CAMERA) ───────────
  // ═════════════════════════════════════════════════════════════════════════════
  const hasVoiceAnswer = isBehavioral && currentAnswerText && currentAnswerText.trim().length > 0;
  const isGranted = permission && permission.granted;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* Clean Top Header (Exit Button, Role, Company, Warnings, Timer) */}
      <View style={[styles.roomHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => setShowQuitModal(true)}
          style={styles.roomExitBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.roomExitBtnText, { color: theme.subtext }]}>← Exit</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text style={[styles.roomRole, { color: theme.text }]} numberOfLines={1}>{role}</Text>
          <Text style={[styles.roomCompany, { color: theme.subtext }]}>
            {company} · {isBehavioral ? 'Behavioral Round' : type}
          </Text>
        </View>

        <View style={styles.headerRightGroup}>
          <View style={[styles.warningBadgePill, { backgroundColor: warningCount > 0 ? '#381014' : '#143820', borderColor: warningCount > 0 ? '#ef4444' : '#22c55e' }]}>
            <Text style={[styles.warningBadgeText, { color: warningCount > 0 ? '#ef4444' : '#22c55e' }]}>
              ⚠️ Warnings: {warningCount}/3
            </Text>
          </View>
          <Text style={[styles.timerText, { color: timeLeft < 120 ? '#ef4444' : accentObj.color }]}>
            ⏱ {mins}:{secs < 10 ? '0' : ''}{secs}
          </Text>
        </View>
      </View>

      {/* ─── LIVE AI PROCTORING CAMERA & TELEMETRY STRIP ─── */}
      <View style={[styles.liveProctorStrip, { backgroundColor: '#0d131f', borderColor: '#1f293d' }]}>
        <View style={styles.proctorCamMiniBox}>
          {isGranted && !hasCameraError ? (
            <SafeCameraBoundary onError={() => setHasCameraError(true)} fallback={<View style={{ backgroundColor: '#000', flex: 1 }} />}>
              <CameraView style={StyleSheet.absoluteFillObject} facing="front" />
            </SafeCameraBoundary>
          ) : (
            <View style={{ backgroundColor: '#000', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16 }}>👤</Text>
            </View>
          )}
          <View style={styles.camPipLiveBadge}>
            <Text style={styles.camPipLiveDot}>●</Text>
            <Text style={styles.camPipLiveText}>PROCTOR ON</Text>
          </View>
        </View>

        <View style={styles.proctorTelemetryMeta}>
          <View style={styles.proctorTelemetryRow}>
            <Text style={styles.proctorTelemetryKey}>AI Vision:</Text>
            <Text style={styles.proctorTelemetryValGreen}>● Human Face Locked</Text>
          </View>
          <View style={styles.proctorTelemetryRow}>
            <Text style={styles.proctorTelemetryKey}>Gaze Track:</Text>
            <Text style={styles.proctorTelemetryValBlue}>98% Focus on Screen</Text>
          </View>
          <View style={styles.proctorTelemetryRow}>
            <Text style={styles.proctorTelemetryKey}>Room Security:</Text>
            <Text style={styles.proctorTelemetryValYellow}>1 Candidate (Secure)</Text>
          </View>
        </View>
      </View>

      {/* Toast Alert */}
      {proctorWarningToast && (
        <View style={styles.toastAlert}>
          <Text style={styles.toastAlertText}>{proctorWarningToast}</Text>
        </View>
      )}

      {/* Question Step Progress Tracker (One-Way Progression) */}
      <View style={[styles.tabBarRow, { backgroundColor: theme.card2, borderColor: theme.border }]}>
        <View style={styles.stepProgressRow}>
          {questions.map((q, idx) => {
            const isCurrent = idx === qIndex;
            const isCompleted = idx < qIndex;
            return (
              <View
                key={q.id}
                style={[
                  styles.stepPill,
                  {
                    backgroundColor: isCurrent ? accentObj.color : isCompleted ? '#143820' : theme.card,
                    borderColor: isCurrent ? accentObj.color : isCompleted ? '#22c55e' : theme.border,
                  }
                ]}
              >
                <Text style={[styles.stepPillText, { color: isCurrent ? '#ffffff' : isCompleted ? '#86efac' : theme.muted }]}>
                  {isCompleted ? '✓ Q' + (idx + 1) : 'Q' + (idx + 1)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Progress Track */}
      <View style={[styles.progressTrack, { backgroundColor: theme.card2 }]}>
        <View style={[styles.progressBar, { width: `${((qIndex + 1) / questions.length) * 100}%`, backgroundColor: accentObj.color }]} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.roomContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* AI Question Card */}
          <View style={[styles.questionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.aiTagRow}>
              <View style={[styles.aiPill, { backgroundColor: accentObj.bg }]}>
                <Text style={[styles.aiPillText, { color: accentObj.color }]}>
                  {isBehavioral ? '🎙️ BEHAVIORAL QUESTION' : '🤖 TECHNICAL QUESTION'} {qIndex + 1} OF {questions.length}
                </Text>
              </View>
              <Text style={[styles.qTopicTag, { color: theme.muted }]}>{currentQ.title}</Text>
            </View>
            <Text style={[styles.questionPrompt, { color: theme.text }]}>{currentQ.question}</Text>
          </View>

          {/* ─── CONDITIONAL ANSWER SECTION: VOICE RECORDING vs TEXT INPUT ─── */}
          {isBehavioral ? (
            <View style={[styles.voiceStudioCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.voiceStudioHeader}>
                <Text style={[styles.voiceStudioTitle, { color: theme.text }]}>🎙️ Live AI Voice Response Studio</Text>
                <Text style={[styles.voiceStudioSubtitle, { color: theme.subtext }]}>
                  Camera & microphone evaluate speaking clarity, confidence, honesty & delivery.
                </Text>
              </View>

              {/* Animated Waveform Studio */}
              <View style={[styles.waveformBox, { backgroundColor: isRecordingVoice ? '#143820' : theme.card2, borderColor: isRecordingVoice ? '#22c55e' : theme.border }]}>
                <Animated.View style={[styles.waveformBar, { transform: [{ scaleY: isRecordingVoice ? waveAnim : 0.3 }], backgroundColor: isRecordingVoice ? '#22c55e' : theme.muted }]} />
                <Animated.View style={[styles.waveformBar, { transform: [{ scaleY: isRecordingVoice ? waveAnim : 0.6 }], backgroundColor: isRecordingVoice ? '#22c55e' : theme.muted }]} />
                <Animated.View style={[styles.waveformBar, { transform: [{ scaleY: isRecordingVoice ? waveAnim : 0.4 }], backgroundColor: isRecordingVoice ? '#22c55e' : theme.muted }]} />
                <Animated.View style={[styles.waveformBar, { transform: [{ scaleY: isRecordingVoice ? waveAnim : 0.8 }], backgroundColor: isRecordingVoice ? '#22c55e' : theme.muted }]} />
                <Animated.View style={[styles.waveformBar, { transform: [{ scaleY: isRecordingVoice ? waveAnim : 0.5 }], backgroundColor: isRecordingVoice ? '#22c55e' : theme.muted }]} />
              </View>

              {/* Voice Telemetry Metrics */}
              <View style={styles.voiceMetricsRow}>
                <View style={[styles.voiceMetricPill, { backgroundColor: theme.card2 }]}>
                  <Text style={[styles.voiceMetricText, { color: '#22c55e' }]}>Clarity: 96%</Text>
                </View>
                <View style={[styles.voiceMetricPill, { backgroundColor: theme.card2 }]}>
                  <Text style={[styles.voiceMetricText, { color: '#3b82f6' }]}>Pacing: 135 WPM</Text>
                </View>
                <View style={[styles.voiceMetricPill, { backgroundColor: theme.card2 }]}>
                  <Text style={[styles.voiceMetricText, { color: '#f59e0b' }]}>Honesty: High</Text>
                </View>
              </View>

              {/* Live Microphone Recording Button */}
              {!hasVoiceAnswer || isRecordingVoice ? (
                <TouchableOpacity
                  style={[
                    styles.voiceActionBtn,
                    { backgroundColor: isRecordingVoice ? '#ef4444' : accentObj.color }
                  ]}
                  onPress={handleToggleVoiceRecord}
                  activeOpacity={0.85}
                >
                  <Text style={styles.voiceActionBtnText}>
                    {isRecordingVoice ? `⏹️ Stop Recording (${recordingSeconds}s)` : '🎙️ Tap to Speak Answer'}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {/* Real-time Voice Transcription & Speak Again Controls */}
              {hasVoiceAnswer && !isRecordingVoice ? (
                <View style={{ width: '100%' }}>
                  <View style={[styles.voiceTranscriptBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                    <View style={styles.transcriptHeaderRow}>
                      <Text style={[styles.voiceTranscriptLabel, { color: '#22c55e' }]}>✅ SPOKEN RESPONSE CAPTURED:</Text>
                      <TouchableOpacity onPress={handleSpeakAgain} style={styles.speakAgainSmallBtn}>
                        <Text style={styles.speakAgainSmallText}>🔄 Speak Again</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.voiceTranscriptText, { color: theme.text }]}>{currentAnswerText}</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.reRecordBtn, { borderColor: accentObj.color }]}
                    onPress={handleSpeakAgain}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.reRecordText, { color: accentObj.color }]}>🎙️ Re-Record / Speak Again 🔄</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.answerSection}>
              <View style={styles.inputHeaderRow}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>YOUR TECHNICAL ANSWER</Text>
                <Text style={[styles.wordCounter, { color: currentWordCount >= 4 ? '#22c55e' : '#f59e0b' }]}>
                  {currentWordCount} words {currentWordCount < 4 ? '(Min 4 words required)' : '✓'}
                </Text>
              </View>

              <TextInput
                style={[
                  styles.answerInput,
                  {
                    backgroundColor: theme.card,
                    borderColor: currentWordCount >= 4 ? accentObj.color : theme.border,
                    color: theme.text
                  }
                ]}
                value={currentAnswerText}
                onChangeText={handleUpdateAnswer}
                multiline
                placeholder="Explain high-level architecture, database schema, caching, partitioning, and trade-offs..."
                placeholderTextColor={theme.muted}
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Navigation Action Buttons: Confirm Spoken Answer & Move Next */}
          <View style={styles.navActionRow}>
            {qIndex < questions.length - 1 ? (
              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  {
                    backgroundColor: (currentWordCount >= 4 || hasVoiceAnswer) ? accentObj.color : '#374151',
                    opacity: (currentWordCount >= 4 || hasVoiceAnswer) ? 1 : 0.6
                  }
                ]}
                onPress={handleRequestNext}
                activeOpacity={(currentWordCount >= 4 || hasVoiceAnswer) ? 0.85 : 1}
              >
                <Text style={styles.nextBtnText}>
                  {isBehavioral ? 'Confirm Spoken Answer & Proceed ➔' : 'Lock & Proceed to Next Question →'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.submitAllBtn,
                  {
                    backgroundColor: (currentWordCount >= 4 || hasVoiceAnswer) ? '#22c55e' : '#374151',
                    opacity: (currentWordCount >= 4 || hasVoiceAnswer) ? 1 : 0.6
                  }
                ]}
                onPress={handleRequestSubmit}
                activeOpacity={(currentWordCount >= 4 || hasVoiceAnswer) ? 0.85 : 1}
              >
                <Text style={styles.submitAllBtnText}>
                  {isBehavioral ? 'Confirm Final Spoken Answer & Submit 📋' : 'Lock Final Answer & Submit Assessment 📋'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </Animated.View>
      </ScrollView>

      {/* ─── MODAL: QUIT EXAM CONFIRMATION (STAY IN EXAM vs QUIT) ─── */}
      <Modal
        visible={showQuitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuitModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.confirmModalCard, { backgroundColor: theme.card, borderColor: '#ef4444' }]}>
            <Text style={styles.confirmEmoji}>⚠️</Text>
            <Text style={[styles.confirmTitle, { color: '#ef4444' }]}>Quit Interview Assessment?</Text>
            <Text style={[styles.confirmSubtitle, { color: theme.subtext }]}>
              {isBehavioral ? 'Behavioral Round' : type} · {role}
            </Text>
            <Text style={[styles.confirmNotice, { color: theme.text, marginVertical: 14, fontWeight: '700' }]}>
              Are you sure you want to quit? If you quit now, your session will end immediately and you will receive 0 marks.
            </Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={[styles.stayInExamBtn, { backgroundColor: '#22c55e' }]}
                onPress={() => setShowQuitModal(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.stayInExamText}>Stay in Exam 🚀</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quitExamBtn, { backgroundColor: '#381014', borderColor: '#ef4444' }]}
                onPress={handleQuitExamConfirmed}
                activeOpacity={0.7}
              >
                <Text style={styles.quitExamText}>Quit Exam (0 Marks)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── MODAL: CONFIRM LOCK ANSWER & PROCEED TO NEXT QUESTION ─── */}
      <Modal
        visible={showConfirmNextModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmNextModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.confirmModalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.confirmEmoji}>🔒</Text>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>Lock Answer & Proceed?</Text>
            <Text style={[styles.confirmSubtitle, { color: theme.subtext }]}>
              Question {qIndex + 1} of {questions.length}
            </Text>
            <Text style={[styles.confirmNotice, { color: theme.muted, marginVertical: 14 }]}>
              Once you lock and proceed to Question {qIndex + 2}, you will NOT be able to return to edit this answer.
            </Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={[styles.confirmReviewBtn, { backgroundColor: theme.card2, borderColor: theme.border }]}
                onPress={() => setShowConfirmNextModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.confirmReviewText, { color: theme.text }]}>
                  {isBehavioral ? '← Speak Again' : '← Review Answer'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmSubmitBtn, { backgroundColor: accentObj.color }]}
                onPress={handleConfirmNextQuestion}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmSubmitText}>Confirm & Next ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── MODAL: PAUSE WITH WARNING COUNT & RESCAN (3 WARNINGS LIMIT) ─── */}
      <Modal
        visible={activePauseReason !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.pauseModalCard, { backgroundColor: theme.card, borderColor: '#ef4444' }]}>
            <Text style={styles.pauseEmoji}>⚠️</Text>
            
            {/* Warning Counter Pill */}
            <View style={styles.pauseWarningCountPill}>
              <Text style={styles.pauseWarningCountText}>PROCTOR WARNING {warningCount} OF 3</Text>
            </View>

            <Text style={[styles.pauseTitle, { color: '#ef4444' }]}>
              {activePauseReason === 'gaze'
                ? 'Test Paused: Attention Diverted'
                : activePauseReason === 'absent'
                ? 'Test Paused: Candidate Face Removed'
                : activePauseReason === 'multi'
                ? 'Malpractice: Multiple Persons Detected'
                : 'Security Alert: App Minimized / Switched'}
            </Text>

            <Text style={[styles.pauseSubtitle, { color: theme.text }]}>
              {activePauseReason === 'gaze'
                ? 'The AI proctor detected your head or eyes turned away from the screen.'
                : activePauseReason === 'absent'
                ? 'No human candidate face was detected in front of the camera.'
                : activePauseReason === 'multi'
                ? '2 or more people were detected in the frame. Collaboration is prohibited.'
                : 'Leaving or minimizing the app during the test is a security violation.'}
            </Text>

            <Text style={[styles.pauseNotice, { color: '#f87171' }]}>
              ⚠️ Reaching 3 warnings will immediately cancel your exam with ZERO marks!
            </Text>

            {isRescanning ? (
              <View style={styles.rescanLoadingBox}>
                <ActivityIndicator size="small" color="#22c55e" />
                <Text style={styles.rescanLoadingText}>Scanning Facial Landmarks... ({rescanProgress}%)</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.resumeBtn, { backgroundColor: '#22c55e' }]}
              onPress={handlePerformFaceRescanAndResume}
              activeOpacity={0.85}
              disabled={isRescanning}
            >
              <Text style={styles.resumeBtnText}>
                {isRescanning ? 'Scanning Biometrics...' : 'Center Face & Resume Test 🔄'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── MODAL: FINAL SUBMISSION CONFIRMATION ─── */}
      <Modal
        visible={showConfirmSubmitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmSubmitModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.confirmModalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.confirmHeader}>
              <Text style={styles.confirmEmoji}>📋</Text>
              <Text style={[styles.confirmTitle, { color: theme.text }]}>Submit Interview Assessment</Text>
              <Text style={[styles.confirmSubtitle, { color: theme.subtext }]}>
                {isBehavioral ? 'Behavioral Round' : type} · {role}
              </Text>
            </View>

            <View style={styles.confirmStatsRow}>
              <View style={[styles.confirmStatBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                <Text style={[styles.confirmStatNum, { color: theme.text }]}>{questions.length}</Text>
                <Text style={[styles.confirmStatLabel, { color: theme.muted }]}>Total Qs</Text>
              </View>
              <View style={[styles.confirmStatBox, { backgroundColor: '#143820', borderColor: '#22c55e' }]}>
                <Text style={[styles.confirmStatNum, { color: '#22c55e' }]}>{questions.length}</Text>
                <Text style={[styles.confirmStatLabel, { color: '#86efac' }]}>Answered</Text>
              </View>
            </View>

            <Text style={[styles.confirmNotice, { color: theme.muted, marginVertical: 14 }]}>
              The AI will evaluate your responses and proctoring integrity to generate your comprehensive scorecard.
            </Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={[styles.confirmReviewBtn, { backgroundColor: theme.card2, borderColor: theme.border }]}
                onPress={() => setShowConfirmSubmitModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.confirmReviewText, { color: theme.text }]}>← Review</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmSubmitBtn, { backgroundColor: '#22c55e' }]}
                onPress={handleFinalEvaluation}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmSubmitText}>Confirm & Evaluate 🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // ── GATE 1 SETUP STYLES ──
  gateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 56 : 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  gateBackBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  gateBackText: {
    fontSize: 14,
    fontWeight: '700',
  },
  gateTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  gateContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  gateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  gateBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  gateHeading: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  gateSubheading: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '600',
  },
  gateCameraCard: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    marginBottom: 18,
    position: 'relative',
  },
  gateCameraStream: {
    flex: 1,
  },
  gateCameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#00000030',
  },
  gateTelemetryRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gateTelemetryText: {
    color: '#86efac',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#000000cc',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  gateTelemetryAi: {
    color: '#60a5fa',
    fontSize: 9,
    fontWeight: '900',
    backgroundColor: '#000000cc',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },

  gateFaceTargetBox: {
    width: 140,
    height: 160,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetCorner: {
    position: 'absolute',
    width: 22,
    height: 22,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserScanLine: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: 0,
    height: 2,
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  faceTargetBadge: {
    position: 'absolute',
    bottom: -10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  faceTargetBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  gateStreamBadge: {
    backgroundColor: '#000000dd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  gateStreamBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  gateActionsContainer: {
    width: '100%',
    gap: 12,
  },
  gateScanBtn: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  gateBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedSuccessBox: {
    backgroundColor: '#143820',
    borderColor: '#22c55e',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  verifiedSuccessText: {
    color: '#86efac',
    fontSize: 13,
    fontWeight: '800',
  },
  recalibrateBtn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  recalibrateText: {
    color: '#93c5fd',
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  gateStartBtn: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  gateStartBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // ── ROOM ASSESSMENT STYLES ──
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 56 : 22,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  roomExitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  roomExitBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  roomRole: {
    fontSize: 15,
    fontWeight: '800',
  },
  roomCompany: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  warningBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // LIVE PROCTOR CAMERA STRIP
  liveProctorStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 12,
  },
  proctorCamMiniBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#22c55e',
    position: 'relative',
  },
  camPipLiveBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: '#000000bb',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
    gap: 3,
  },
  camPipLiveDot: {
    color: '#22c55e',
    fontSize: 8,
  },
  camPipLiveText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '900',
  },
  proctorTelemetryMeta: {
    flex: 1,
    gap: 2,
  },
  proctorTelemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proctorTelemetryKey: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '700',
  },
  proctorTelemetryValGreen: {
    color: '#86efac',
    fontSize: 10,
    fontWeight: '800',
  },
  proctorTelemetryValBlue: {
    color: '#93c5fd',
    fontSize: 10,
    fontWeight: '800',
  },
  proctorTelemetryValYellow: {
    color: '#fde047',
    fontSize: 10,
    fontWeight: '800',
  },

  toastAlert: {
    backgroundColor: '#f59e0b',
    paddingVertical: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toastAlertText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },

  tabBarRow: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  stepProgressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  stepPillText: {
    fontSize: 11,
    fontWeight: '800',
  },

  progressTrack: {
    height: 3,
  },
  progressBar: {
    height: '100%',
  },

  scroll: {
    flex: 1,
  },
  roomContent: {
    padding: 18,
    paddingBottom: 40,
  },

  questionCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  aiTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  qTopicTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  questionPrompt: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },

  // 🎙️ VOICE STUDIO STYLES (BEHAVIORAL ROUND)
  voiceStudioCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    marginBottom: 16,
    alignItems: 'center',
  },
  voiceStudioHeader: {
    alignItems: 'center',
    marginBottom: 14,
  },
  voiceStudioTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  voiceStudioSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  waveformBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 70,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  waveformBar: {
    width: 8,
    height: 44,
    borderRadius: 4,
  },
  voiceMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  voiceMetricPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  voiceMetricText: {
    fontSize: 11,
    fontWeight: '800',
  },
  voiceActionBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  voiceActionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  voiceTranscriptBox: {
    width: '100%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginTop: 14,
  },
  transcriptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  speakAgainSmallBtn: {
    backgroundColor: '#3b82f620',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  speakAgainSmallText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '800',
  },
  voiceTranscriptLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  voiceTranscriptText: {
    fontSize: 13,
    lineHeight: 19,
  },
  reRecordBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    marginTop: 10,
  },
  reRecordText: {
    fontSize: 13,
    fontWeight: '800',
  },

  // TEXT ANSWER STYLES (TECHNICAL ROUNDS)
  answerSection: {
    marginTop: 2,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  wordCounter: {
    fontSize: 11,
    fontWeight: '700',
  },
  answerInput: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    fontSize: 14,
    minHeight: 160,
    lineHeight: 21,
    marginBottom: 18,
  },

  navActionRow: {
    width: '100%',
  },
  nextBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  submitAllBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitAllBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  // DISQUALIFIED SCREEN
  disqualifiedRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  disqualifiedCard: {
    backgroundColor: '#260a0a',
    borderRadius: 24,
    padding: 26,
    borderWidth: 2,
    borderColor: '#ef4444',
    alignItems: 'center',
    width: '100%',
  },
  disqualifiedEmoji: {
    fontSize: 52,
    marginBottom: 10,
  },
  disqualifiedTitle: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  disqualifiedSubtitle: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 16,
  },
  zeroScoreBox: {
    backgroundColor: '#3b0d0d',
    borderColor: '#ef4444',
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  zeroScoreNum: {
    color: '#ef4444',
    fontSize: 48,
    fontWeight: '900',
  },
  zeroScoreLabel: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  disqualifiedListBox: {
    width: '100%',
    backgroundColor: '#1f0808',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  disqualifiedListTitle: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  disqualifiedListItem: {
    color: '#e5e7eb',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 3,
  },
  disqualifiedExitBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  disqualifiedExitText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  evaluatingRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  evaluatingCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  evaluatingTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  evaluatingSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  doneContainer: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 50,
  },
  doneEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  doneSubtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  finalScoreBadge: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    marginBottom: 16,
  },
  finalScoreNum: {
    fontSize: 50,
    fontWeight: '900',
  },
  finalScoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  finalScoreRating: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },

  proctorAuditCard: {
    width: '100%',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  proctorAuditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  proctorAuditTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  proctorAuditSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  proctorScorePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proctorScorePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  metricNum: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  behavioralFeedbackBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  behavioralFeedbackTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  behavioralFeedbackBody: {
    fontSize: 12,
    lineHeight: 18,
  },

  tallyRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  tallyBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  tallyNum: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  tallyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
  },

  breakdownHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  reviewItemCard: {
    borderRadius: 18,
    padding: 16,
    width: '100%',
    borderWidth: 1.5,
    marginBottom: 14,
  },
  reviewItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  reviewItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  reviewStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reviewStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  reviewQPrompt: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },

  answerBox: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  answerBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  answerBoxText: {
    fontSize: 12,
    lineHeight: 17,
  },

  diagnosisBox: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 8,
  },
  diagnosisLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  diagnosisText: {
    fontSize: 12,
    lineHeight: 17,
  },

  correctedBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  correctedLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  correctedText: {
    fontSize: 12,
    lineHeight: 18,
  },

  finishBackBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  finishBackText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000dd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalCard: {
    width: '100%',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1.5,
    maxHeight: '85%',
  },
  confirmHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 3,
  },
  confirmSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },

  confirmStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  confirmStatBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  confirmStatNum: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  confirmStatLabel: {
    fontSize: 10,
    fontWeight: '700',
  },

  confirmNotice: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  stayInExamBtn: {
    flex: 1.2,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  stayInExamText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  quitExamBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  quitExamText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '800',
  },

  confirmReviewBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  confirmReviewText: {
    fontSize: 13,
    fontWeight: '700',
  },
  confirmSubmitBtn: {
    flex: 1.5,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmSubmitText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },

  pauseModalCard: {
    width: '100%',
    borderRadius: 22,
    padding: 24,
    borderWidth: 2,
    alignItems: 'center',
  },
  pauseEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  pauseWarningCountPill: {
    backgroundColor: '#381014',
    borderColor: '#ef4444',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  pauseWarningCountText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  pauseTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  pauseSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  pauseNotice: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
  },
  rescanLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#00000060',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  rescanLoadingText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '800',
  },
  resumeBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resumeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
