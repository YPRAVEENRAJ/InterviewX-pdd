// src/screens/DashboardScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user, userStats } = useAuth();

  const [goals, setGoals] = useState([
    { id: 1, title: 'Complete 1 AI Technical Interview', done: false, emoji: '🎯' },
    { id: 2, title: 'Solve 2 Coding Problems', done: false, emoji: '💻' },
    { id: 3, title: 'Analyze Resume ATS Score', done: false, emoji: '📄' },
    { id: 4, title: 'Review Career Roadmap Step', done: false, emoji: '🗺️' },
  ]);

  const toggleGoal = (id) => setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  const doneCount = goals.filter(g => g.done).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const { recentInterviews = [], totalInterviews = 0, avgScore = 0, streak = 0, solvedCount = 0, atsScore } = userStats;

  const quickActions = [
    { label: 'AI Interview', sub: 'Start a mock session', emoji: '🎯', color: '#6C63FF', screen: 'Interview' },
    { label: 'Coding Arena', sub: 'Solve DSA problems', emoji: '💻', color: '#2ed573', screen: 'Coding' },
    { label: 'Resume ATS', sub: 'Check your score', emoji: '📄', color: '#ffa502', screen: 'Resume' },
    { label: 'Career Path', sub: 'Learning roadmap', emoji: '🗺️', color: '#ff6b81', screen: 'Career' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f8" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.name}>Welcome, {user?.name || 'Praveen'}</Text>
          <Text style={styles.sub}>Ready to ace your interviews?</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.name || 'P')[0]}</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#6C63FF' }]}>
          <Text style={styles.statNum}>{totalInterviews}</Text>
          <Text style={styles.statLbl}>Interviews</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#2ed573' }]}>
          <Text style={styles.statNum}>{avgScore > 0 ? `${avgScore}%` : '--'}</Text>
          <Text style={styles.statLbl}>Avg Score</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ffa502' }]}>
          <Text style={styles.statNum}>{streak}🔥</Text>
          <Text style={styles.statLbl}>Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ff6b81' }]}>
          <Text style={styles.statNum}>{solvedCount}</Text>
          <Text style={styles.statLbl}>Solved</Text>
        </View>
      </View>

      {/* ATS Score Banner */}
      {atsScore !== null && atsScore !== undefined && (
        <TouchableOpacity style={styles.atsBanner} onPress={() => navigation.navigate('Resume')}>
          <Text style={styles.atsBannerText}>📄 Resume ATS Score: <Text style={styles.atsNum}>{atsScore}%</Text>  — Tap to improve</Text>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((a) => (
          <TouchableOpacity
            key={a.label}
            style={[styles.actionCard, { borderLeftColor: a.color }]}
            onPress={() => navigation.navigate(a.screen)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionEmoji}>{a.emoji}</Text>
            <Text style={styles.actionLabel}>{a.label}</Text>
            <Text style={styles.actionSub}>{a.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Interviews */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Interview')}>
          <Text style={styles.seeAll}>+ New</Text>
        </TouchableOpacity>
      </View>

      {recentInterviews.length === 0 ? (
        <TouchableOpacity style={styles.emptyCard} onPress={() => navigation.navigate('Interview')}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyTitle}>No interviews yet</Text>
          <Text style={styles.emptySub}>Tap to start your first AI mock interview</Text>
        </TouchableOpacity>
      ) : (
        recentInterviews.slice(0, 5).map((item, i) => (
          <View key={i} style={styles.interviewCard}>
            <View style={styles.interviewLeft}>
              <View style={[styles.companyBadge, { backgroundColor: '#6C63FF20' }]}>
                <Text style={[styles.companyInitial, { color: '#6C63FF' }]}>{item.company?.slice(0, 2) || 'AI'}</Text>
              </View>
              <View>
                <Text style={styles.interviewCompany}>{item.company || 'AI Interview'}</Text>
                <Text style={styles.interviewRole}>{item.role}</Text>
                <Text style={styles.interviewDate}>📅 {item.date}</Text>
              </View>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: item.score >= 80 ? '#2ed57320' : '#ffa50220' }]}>
              <Text style={[styles.scoreText, { color: item.score >= 80 ? '#2ed573' : '#ffa502' }]}>{item.score}%</Text>
            </View>
          </View>
        ))
      )}

      {/* Daily Goals */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        <Text style={styles.goalCount}>{doneCount}/{goals.length} Done</Text>
      </View>
      <View style={styles.goalsCard}>
        {goals.map(g => (
          <TouchableOpacity key={g.id} style={styles.goalRow} onPress={() => toggleGoal(g.id)}>
            <Text style={[styles.goalCheck, g.done && styles.goalCheckDone]}>{g.done ? '✅' : '⬜'}</Text>
            <Text style={styles.goalEmoji}>{g.emoji}</Text>
            <Text style={[styles.goalText, g.done && styles.goalDone]}>{g.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f8' },
  content: { padding: 18, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 13, color: '#888', marginBottom: 2 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  sub: { fontSize: 12, color: '#999', marginTop: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, padding: 12, borderRadius: 14, alignItems: 'center', elevation: 3 },
  statNum: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  statLbl: { fontSize: 9, color: '#ffffffcc', marginTop: 2, textAlign: 'center' },

  atsBanner: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#2ed573', elevation: 2 },
  atsBannerText: { fontSize: 13, color: '#333', fontWeight: '600' },
  atsNum: { color: '#2ed573', fontWeight: 'bold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 10, marginTop: 16 },
  seeAll: { fontSize: 13, color: '#6C63FF', fontWeight: 'bold' },
  goalCount: { fontSize: 12, color: '#888', fontWeight: '600' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  actionCard: {
    width: '47.5%', backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderLeftWidth: 4, elevation: 3,
  },
  actionEmoji: { fontSize: 26, marginBottom: 6 },
  actionLabel: { fontSize: 14, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 2 },
  actionSub: { fontSize: 11, color: '#888' },

  emptyCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 28,
    alignItems: 'center', elevation: 2, marginBottom: 8, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#ddd',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4 },
  emptySub: { fontSize: 12, color: '#888', textAlign: 'center' },

  interviewCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2,
  },
  interviewLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  companyBadge: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  companyInitial: { fontSize: 14, fontWeight: 'bold' },
  interviewCompany: { fontSize: 14, fontWeight: 'bold', color: '#1a1a2e' },
  interviewRole: { fontSize: 11, color: '#666', marginTop: 1 },
  interviewDate: { fontSize: 11, color: '#aaa', marginTop: 1 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreText: { fontSize: 14, fontWeight: 'bold' },

  goalsCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 2 },
  goalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  goalCheck: { fontSize: 18, marginRight: 8 },
  goalCheckDone: {},
  goalEmoji: { fontSize: 16, marginRight: 8 },
  goalText: { fontSize: 13, color: '#333', flex: 1, fontWeight: '500' },
  goalDone: { textDecorationLine: 'line-through', color: '#aaa' },
});
