import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, Modal, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { user, userStats } = useAuth();
  const { theme, sectionAccents, ACCENT_PALETTES } = useTheme();
  const [showExitModal, setShowExitModal] = useState(false);

  // Show exit app confirmation pop-up ONLY when pressing Back on the Home screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowExitModal(true);
        return true; // prevent immediate close, show pop-up
      };

      const backSub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backSub.remove();
    }, [])
  );

  const {
    recentInterviews = [],
    totalInterviews = 12,
    avgScore = 78,
  } = userStats || {};

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.name || 'Sunny';
  const initial = (displayName[0] || 'S').toUpperCase();

  const interviewAccentObj = ACCENT_PALETTES[sectionAccents.interview] || ACCENT_PALETTES.blue;
  const resumeAccentObj = ACCENT_PALETTES[sectionAccents.resume] || ACCENT_PALETTES.green;
  const codingAccentObj = ACCENT_PALETTES[sectionAccents.coding] || ACCENT_PALETTES.cyan;

  // Curated sessions list if none recorded yet
  const defaultSessions = [
    {
      id: '1',
      title: 'System design round',
      subtitle: 'Yesterday · 22 min',
      score: '82%',
      scoreColor: '#22c55e',
      iconBg: '#143820',
      iconColor: '#22c55e',
      icon: '⚙️',
      type: 'System Design',
      role: 'System Design Specialist',
      company: 'Meta',
    },
    {
      id: '2',
      title: 'DSA practice',
      subtitle: '2 days ago · 35 min',
      score: '74%',
      scoreColor: '#3b82f6',
      iconBg: '#10284e',
      iconColor: '#3b82f6',
      icon: '</>',
      type: 'Technical',
      role: 'Full Stack Engineer',
      company: 'Google',
    },
    {
      id: '3',
      title: 'HR round',
      subtitle: '4 days ago · 18 min',
      score: '65%',
      scoreColor: '#f59e0b',
      iconBg: '#382810',
      iconColor: '#f59e0b',
      icon: '💬',
      type: 'Behavioral',
      role: 'Full Stack Engineer',
      company: 'Amazon',
    },
  ];

  const sessions = recentInterviews.length > 0
    ? recentInterviews.slice(0, 5).map((item, idx) => ({
        id: String(idx),
        title: `${item.role || 'Technical round'}`,
        subtitle: `${item.date || 'Recent'} · ${item.company || 'AI Session'}`,
        score: `${item.score}%`,
        scoreColor: item.score >= 80 ? '#22c55e' : item.score >= 70 ? '#3b82f6' : '#f59e0b',
        iconBg: item.score >= 80 ? '#143820' : item.score >= 70 ? '#10284e' : '#382810',
        iconColor: item.score >= 80 ? '#22c55e' : item.score >= 70 ? '#3b82f6' : '#f59e0b',
        icon: item.type === 'System Design' || item.role?.toLowerCase().includes('design') ? '⚙️' : item.type === 'Behavioral' || item.role?.toLowerCase().includes('hr') ? '💬' : '</>',
        type: item.type || (item.role?.toLowerCase().includes('design') ? 'System Design' : item.role?.toLowerCase().includes('hr') ? 'Behavioral' : 'Technical'),
        role: item.role || 'Full Stack Engineer',
        company: item.company || 'Google',
      }))
    : defaultSessions;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* Top App Header */}
      <View style={[styles.topHeader, { backgroundColor: theme.bg }]}>
        <View>
          <Text style={[styles.greetingText, { color: theme.subtext }]}>{greeting}</Text>
          <Text style={[styles.userNameText, { color: theme.text }]}>{displayName}</Text>
        </View>
        <TouchableOpacity
          style={[styles.avatarCircle, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarLetter}>{initial}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 3 Metric Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{totalInterviews || 12}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Sessions</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>
              {avgScore ? `${avgScore}%` : '78%'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Avg score</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.text }]}>4.2h</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Practiced</Text>
          </View>
        </View>

        {/* Primary Action Card: Start Mock Interview */}
        <TouchableOpacity
          style={[styles.heroActionCard, { backgroundColor: theme.primarySubtle, borderColor: theme.primaryBorder }]}
          onPress={() => navigation.navigate('Interview')}
          activeOpacity={0.85}
        >
          <View style={styles.heroActionLeft}>
            <Text style={[styles.heroActionTitle, { color: interviewAccentObj.color }]}>Start mock interview</Text>
            <Text style={styles.heroActionSub}>AI-generated questions</Text>
          </View>
          <View style={[styles.heroCircleButton, { backgroundColor: theme.card }]}>
            <Text style={[styles.heroCircleArrow, { color: interviewAccentObj.color }]}>▶</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Access Tiles: Resume ATS & Coding */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Resume')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: resumeAccentObj.bg }]}>
              <Text style={styles.quickIconText}>📄</Text>
            </View>
            <Text style={[styles.quickTitle, { color: theme.text }]}>Resume ATS Match</Text>
            <Text style={[styles.quickSub, { color: theme.muted }]}>Compare with JD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Coding')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: codingAccentObj.bg }]}>
              <Text style={styles.quickIconText}>💻</Text>
            </View>
            <Text style={[styles.quickTitle, { color: theme.text }]}>Coding Arena</Text>
            <Text style={[styles.quickSub, { color: theme.muted }]}>Solve DSA tests</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Recent Sessions */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent sessions</Text>
        </View>

        <View style={styles.sessionsList}>
          {sessions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.sessionItem, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => navigation.navigate('Interview', {
                initialType: item.type,
                initialRole: item.role,
                initialCompany: item.company,
              })}
              activeOpacity={0.8}
            >
              <View style={[styles.sessionIconBox, { backgroundColor: item.iconBg }]}>
                {item.icon === '</>' ? (
                  <Text style={[styles.dsaCodeIcon, { color: item.iconColor }]}>{'</>'}</Text>
                ) : (
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                )}
              </View>

              <View style={styles.sessionInfo}>
                <Text style={[styles.sessionTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.sessionSubtitle, { color: theme.muted }]}>{item.subtitle}</Text>
              </View>

              <Text style={[styles.sessionScore, { color: item.scoreColor }]}>
                {item.score}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* ─── MODAL: EXIT APPLICATION CONFIRMATION POPUP ─── */}
      <Modal
        visible={showExitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.exitModalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.exitModalEmoji}>🚪</Text>
            <Text style={[styles.exitModalTitle, { color: theme.text }]}>Exit InterviewX?</Text>
            <Text style={[styles.exitModalSubtitle, { color: theme.subtext }]}>
              Are you sure you want to close the application?
            </Text>

            <View style={styles.exitButtonsRow}>
              <TouchableOpacity
                style={[styles.exitCancelBtn, { backgroundColor: theme.card2, borderColor: theme.border }]}
                onPress={() => setShowExitModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.exitCancelText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exitConfirmBtn, { backgroundColor: '#ef4444' }]}
                onPress={() => {
                  setShowExitModal(false);
                  BackHandler.exitApp();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.exitConfirmText}>Exit App</Text>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: 16,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  // Metrics 3 Cards
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Primary Action Hero Card
  heroActionCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
  },
  heroActionLeft: {
    flex: 1,
  },
  heroActionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroActionSub: {
    fontSize: 13,
    color: '#93c5fd',
    opacity: 0.85,
  },
  heroCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
  },
  heroCircleArrow: {
    fontSize: 14,
    marginLeft: 2,
  },

  // Quick Access Row
  quickAccessRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAccessCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickIconText: {
    fontSize: 16,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickSub: {
    fontSize: 11,
  },

  // Recent Sessions
  sectionHeaderRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sessionsList: {
    gap: 10,
  },
  sessionItem: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  sessionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dsaCodeIcon: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  sessionSubtitle: {
    fontSize: 12,
  },
  sessionScore: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
  },

  // Exit Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  exitModalCard: {
    width: '100%',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  exitModalEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  exitModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  exitModalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  exitButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  exitCancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  exitCancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  exitConfirmBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  exitConfirmText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
