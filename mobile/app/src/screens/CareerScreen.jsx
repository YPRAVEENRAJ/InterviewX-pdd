// src/screens/CareerScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROLES = ['Full Stack Engineer', 'Backend Engineer', 'Frontend Developer'];
const EXP_LEVELS = ['Entry-Level (0-2 Years)', '3-5 Years (Mid-Level)', 'Senior SDE (5+ Years)'];

const roadmapsByRole = {
  'Full Stack Engineer': [
    { id: 1, title: 'Step 1: Advanced Data Structures & Dynamic Programming', summary: 'Master 2D DP, Graph Traversal, and LRU Cache memory design.', notes: 'Focus on time complexity trade-offs (O(N) space vs O(1) in-place pointers). Practice Two-Pointers and Sliding Window techniques.' },
    { id: 2, title: 'Step 2: Microservices & Scalable System Design', summary: 'Distributed Caching (Redis), Rate Limiters, Message Queues (Kafka).', notes: 'Learn distributed lock acquisition (Redlock algorithm) and Write-Through vs Write-Back cache policies.' },
    { id: 3, title: 'Step 3: High-Throughput Database Query Optimization', summary: 'Indexing strategies, EXPLAIN ANALYZE query plans, PostgreSQL Sharding.', notes: 'Study composite B-Tree indexes, partial indexes, and partitioning large tables to eliminate full table scans.' },
    { id: 4, title: 'Step 4: AI Mock Interview Mastery (Google / Meta)', summary: 'Complete 10 Mock Technical & Behavioral Sessions with AI Recruiter.', notes: 'Practice articulating trade-offs out loud using STAR method for behavioral prompts.' },
  ],
  'Backend Engineer': [
    { id: 1, title: 'Step 1: High-Performance Database Systems & SQL Optimization', summary: 'PostgreSQL sharding, Composite Indexing, ACID transaction levels.', notes: 'Study isolation levels (Read Committed vs Serializable) and avoid deadlock scenarios under high concurrency.' },
    { id: 2, title: 'Step 2: Event-Driven Systems & Kafka Message Streams', summary: 'Asynchronous event streaming, Pub/Sub architecture, Kafka Partitioning.', notes: 'Understand consumer group rebalancing, offset commits, and dead-letter queues (DLQ).' },
    { id: 3, title: 'Step 3: Distributed Rate Limiters & Caching Strategies', summary: 'Token Bucket vs Leaky Bucket algorithms, Redis cluster setup.', notes: 'Implement sliding window log rate limiters and cache invalidation patterns.' },
    { id: 4, title: 'Step 4: Backend AI Mock Technical & Architectural Interviews', summary: 'Conduct backend system architecture mock interviews.', notes: 'Prepare for deep dives into API latency bottlenecks and server memory management.' },
  ],
  'Frontend Developer': [
    { id: 1, title: 'Step 1: Advanced React Internals & Virtual DOM Optimization', summary: 'Reconciliation, Concurrent React (useTransition, useDeferredValue).', notes: 'Optimize component re-renders using React.memo, useMemo, and custom state selectors.' },
    { id: 2, title: 'Step 2: Micro-Frontends & Design System Tokens', summary: 'Module Federation, Web Accessibility (ARIA), Design System tokens.', notes: 'Master accessible keyboard navigation, screen reader support, and atomic CSS architecture.' },
    { id: 3, title: 'Step 3: Web Performance Metrics (Core Web Vitals)', summary: 'Optimizing LCP, CLS, INP, and bundle code-splitting.', notes: 'Analyze Chrome DevTools Performance tab, image compression, and lazy-loading routes.' },
    { id: 4, title: 'Step 4: Frontend System Design AI Interviews', summary: 'Design infinite scroll feeds, real-time rich text editors, and video players.', notes: 'Structure frontend state normalization and client-side offline caching strategies.' },
  ],
};

const skillGaps = {
  'Full Stack Engineer': [
    { skill: 'Data Structures & Algorithms', level: 85 },
    { skill: 'System Design & Scalability', level: 72 },
    { skill: 'Database Query Optimization', level: 84 },
    { skill: 'Communication & Behavioral', level: 90 },
  ],
  'Backend Engineer': [
    { skill: 'Distributed Microservices', level: 74 },
    { skill: 'Database Query Tuning', level: 88 },
    { skill: 'Data Structures & Algorithms', level: 82 },
    { skill: 'CI/CD & Docker', level: 70 },
  ],
  'Frontend Developer': [
    { skill: 'React & Next.js Performance', level: 92 },
    { skill: 'State Management & WebSockets', level: 84 },
    { skill: 'Data Structures & Algorithms', level: 78 },
    { skill: 'Web Accessibility & Micro-Frontend', level: 65 },
  ],
};

const salaryMap = {
  'Entry-Level (0-2 Years)': '$95,000 - $125,000 / year',
  '3-5 Years (Mid-Level)': '$155,000 - $185,000 / year',
  'Senior SDE (5+ Years)': '$210,000 - $260,000 / year',
};

export default function CareerScreen() {
  const { userStats, updateCareerProgress } = useAuth();
  const { theme, sectionAccents, ACCENT_PALETTES } = useTheme();

  const [selectedRole, setSelectedRole] = useState('Full Stack Engineer');
  const [expLevel, setExpLevel] = useState('3-5 Years (Mid-Level)');
  const [activeStep, setActiveStep] = useState(null);
  const [lockMsg, setLockMsg] = useState(null);
  const [progress, setProgress] = useState({});

  const accentObj = ACCENT_PALETTES[sectionAccents.career] || ACCENT_PALETTES.purple;

  const getProgress = (role, stepId) => {
    const ctxProg = userStats?.careerProgress?.[role]?.[stepId] || 0;
    return progress[`${role}_${stepId}`] ?? ctxProg;
  };

  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    return getProgress(selectedRole, roadmapsByRole[selectedRole][idx - 1].id) >= 100;
  };

  const handleStep = (step, idx) => {
    setLockMsg(null);
    if (!isUnlocked(idx)) {
      setLockMsg(`🔒 Complete Step ${idx} (100%) to unlock Step ${step.id}`);
      return;
    }
    setActiveStep({ ...step, currentProgress: getProgress(selectedRole, step.id) });
  };

  const handleStudy = () => {
    if (!activeStep) return;
    const key = `${selectedRole}_${activeStep.id}`;
    const cur = getProgress(selectedRole, activeStep.id);
    const next = Math.min(cur + 25, 100);
    setProgress(prev => ({ ...prev, [key]: next }));
    updateCareerProgress(selectedRole, activeStep.id, next);
    setActiveStep(prev => ({ ...prev, currentProgress: next }));
  };

  const gaps = skillGaps[selectedRole] || skillGaps['Full Stack Engineer'];
  const steps = roadmapsByRole[selectedRole] || [];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>🗺️ AI Career Roadmap</Text>
        <Text style={[styles.pageSub, { color: theme.muted }]}>Sequential learning path — complete each step to unlock the next</Text>

        {/* Role Selector */}
        <Text style={[styles.label, { color: theme.subtext }]}>TARGET CAREER ROLE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {ROLES.map(r => (
            <TouchableOpacity
              key={r}
              style={[
                styles.chip,
                { backgroundColor: theme.card, borderColor: selectedRole === r ? accentObj.color : theme.border },
                selectedRole === r && { backgroundColor: accentObj.bg },
              ]}
              onPress={() => { setSelectedRole(r); setLockMsg(null); }}
            >
              <Text style={[styles.chipText, { color: selectedRole === r ? accentObj.color : theme.subtext }, selectedRole === r && { fontWeight: '800' }]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exp Level Selector */}
        <Text style={[styles.label, { color: theme.subtext }]}>EXPERIENCE LEVEL</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {EXP_LEVELS.map(e => (
            <TouchableOpacity
              key={e}
              style={[
                styles.chip,
                { backgroundColor: theme.card, borderColor: expLevel === e ? '#22c55e' : theme.border },
                expLevel === e && { backgroundColor: '#143820' },
              ]}
              onPress={() => setExpLevel(e)}
            >
              <Text style={[styles.chipText, { color: expLevel === e ? '#22c55e' : theme.subtext }, expLevel === e && { fontWeight: '800' }]}>
                {e}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Salary Projection */}
        <View style={[styles.salaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.salaryLabel, { color: theme.muted }]}>💰 MARKET COMPENSATION PROJECTION</Text>
          <Text style={[styles.salaryValue, { color: '#22c55e' }]}>{salaryMap[expLevel]}</Text>
          <Text style={[styles.salarySub, { color: theme.subtext }]}>{selectedRole} · {expLevel}</Text>
        </View>

        {/* Lock Warning */}
        {lockMsg && (
          <View style={styles.lockBanner}>
            <Text style={styles.lockText}>{lockMsg}</Text>
            <TouchableOpacity onPress={() => setLockMsg(null)}><Text style={styles.lockClose}>✕</Text></TouchableOpacity>
          </View>
        )}

        {/* Skill Gap Analysis */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>📊 Skill Gap Analytics</Text>
        <View style={[styles.skillsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {gaps.map((g, i) => (
            <View key={i} style={styles.skillRow}>
              <View style={styles.skillLabelRow}>
                <Text style={[styles.skillName, { color: theme.text }]}>{g.skill}</Text>
                <Text style={[styles.skillPct, { color: accentObj.color }]}>{g.level}%</Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: theme.card2 }]}>
                <View style={[styles.barFill, { width: `${g.level}%`, backgroundColor: g.level >= 85 ? '#22c55e' : g.level >= 70 ? accentObj.color : '#f59e0b' }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Sequential Roadmap */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>🔢 Sequential Learning Steps</Text>
        {steps.map((step, idx) => {
          const unlocked = isUnlocked(idx);
          const prog = getProgress(selectedRole, step.id);
          const done = prog >= 100;
          return (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                !unlocked && styles.stepLocked,
                done && { borderColor: '#22c55e50', backgroundColor: '#112217' },
              ]}
              onPress={() => handleStep(step, idx)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.stepNum,
                done ? { backgroundColor: '#143820', borderColor: '#22c55e', borderWidth: 1 } : unlocked ? { backgroundColor: accentObj.bg } : { backgroundColor: theme.card2 }
              ]}>
                <Text style={[styles.stepNumText, { color: done ? '#22c55e' : unlocked ? accentObj.color : theme.muted }]}>
                  {unlocked ? (done ? '✓' : step.id) : '🔒'}
                </Text>
              </View>

              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={[styles.stepTitle, { color: unlocked ? theme.text : theme.muted }]} numberOfLines={2}>
                    {step.title}
                  </Text>
                  <View style={[
                    styles.stepBadge,
                    done ? { backgroundColor: '#143820' } : unlocked ? { backgroundColor: accentObj.bg } : { backgroundColor: theme.card2 }
                  ]}>
                    <Text style={[styles.badgeText, { color: done ? '#22c55e' : unlocked ? accentObj.color : theme.muted }]}>
                      {done ? '✓ Done' : unlocked ? `${prog}%` : '🔒 Locked'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.stepSummary, { color: theme.muted }]} numberOfLines={2}>{step.summary}</Text>
                {unlocked && (
                  <View style={[styles.progressBg, { backgroundColor: theme.card2 }]}>
                    <View style={[styles.progressFill, { width: `${prog}%`, backgroundColor: accentObj.color }]} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Study Modal */}
        <Modal visible={!!activeStep} transparent animationType="slide" onRequestClose={() => setActiveStep(null)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.modalHeader}>
                <View style={[styles.modalStepBadge, { backgroundColor: accentObj.bg }]}>
                  <Text style={[styles.modalStepNum, { color: accentObj.color }]}>{activeStep?.id}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: theme.text }]} numberOfLines={2}>{activeStep?.title}</Text>
                  <Text style={[styles.modalRole, { color: accentObj.color }]}>{selectedRole}</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveStep(null)}>
                  <Text style={[styles.modalClose, { color: theme.muted }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressLabelRow}>
                  <Text style={[styles.progressLabel, { color: theme.subtext }]}>Module Progress</Text>
                  <Text style={[styles.progressPct, { color: '#22c55e' }]}>{activeStep?.currentProgress || 0}% Completed</Text>
                </View>
                <View style={[styles.progressBg, { backgroundColor: theme.card2 }]}>
                  <View style={[styles.progressFill, { width: `${activeStep?.currentProgress || 0}%`, backgroundColor: accentObj.color }]} />
                </View>
              </View>

              <View style={[styles.notesCard, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                <Text style={[styles.notesTitle, { color: accentObj.color }]}>📖 Core Study Guide</Text>
                <Text style={[styles.notesText, { color: theme.text }]}>{activeStep?.notes}</Text>
              </View>

              <TouchableOpacity
                style={[styles.studyBtn, { backgroundColor: accentObj.color }, (activeStep?.currentProgress || 0) >= 100 && { backgroundColor: '#22c55e' }]}
                onPress={handleStudy}
                disabled={(activeStep?.currentProgress || 0) >= 100}
              >
                <Text style={styles.studyBtnText}>
                  {(activeStep?.currentProgress || 0) >= 100 ? '✅ Module Completed!' : '⏱️ Study 30 Mins (+25% Progress)'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveStep(null)}>
                <Text style={[styles.closeBtnText, { color: theme.muted }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 18, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 56 : 24 },
  pageTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  pageSub: { fontSize: 13, marginBottom: 20 },

  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginTop: 4 },
  chipRow: { flexDirection: 'row', marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, marginRight: 8 },
  chipText: { fontSize: 12, fontWeight: '600' },

  salaryCard: { borderRadius: 18, padding: 18, marginBottom: 16, alignItems: 'center', borderWidth: 1 },
  salaryLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  salaryValue: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  salarySub: { fontSize: 12 },

  lockBanner: { backgroundColor: '#854d0e20', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  lockText: { fontSize: 12, color: '#f59e0b', fontWeight: '700', flex: 1 },
  lockClose: { fontSize: 16, color: '#9ca3af', marginLeft: 8 },

  sectionTitle: { fontSize: 15, fontWeight: '800', marginTop: 18, marginBottom: 12 },

  skillsCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 6 },
  skillRow: { marginBottom: 14 },
  skillLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  skillName: { fontSize: 12, fontWeight: '600', flex: 1 },
  skillPct: { fontSize: 12, fontWeight: '800' },
  barBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },

  stepCard: { borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', gap: 12, borderWidth: 1 },
  stepLocked: { opacity: 0.45 },
  stepNum: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 14, fontWeight: '800' },
  stepContent: { flex: 1 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 8 },
  stepTitle: { fontSize: 13, fontWeight: '800', flex: 1 },
  stepBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, flexShrink: 0 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  stepSummary: { fontSize: 11, lineHeight: 16, marginBottom: 6 },
  progressBg: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 4 },
  progressFill: { height: '100%', borderRadius: 2 },

  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 38, borderWidth: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  modalStepBadge: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  modalStepNum: { fontSize: 18, fontWeight: '800' },
  modalTitle: { fontSize: 14, fontWeight: '800', flex: 1 },
  modalRole: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  modalClose: { fontSize: 20, paddingLeft: 8 },

  progressSection: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: '600' },
  progressPct: { fontSize: 12, fontWeight: '800' },

  notesCard: { borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1 },
  notesTitle: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  notesText: { fontSize: 13, lineHeight: 20 },

  studyBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  studyBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  closeBtn: { alignItems: 'center', padding: 8 },
  closeBtnText: { fontSize: 13, fontWeight: '600' },
});
