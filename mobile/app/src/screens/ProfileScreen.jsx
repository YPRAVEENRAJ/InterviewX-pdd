// src/screens/ProfileScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Switch, Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { signOut, user, userStats } = useAuth();
  const {
    theme,
    themeId,
    setThemeId,
    sectionAccents,
    setSectionAccent,
    THEMES,
    ACCENT_PALETTES,
  } = useTheme();

  const [notifs, setNotifs] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const {
    totalInterviews = 12,
    avgScore = 78,
    solvedCount = 5,
    streak = 4,
  } = userStats || {};

  const displayName = user?.name || 'Sunny';
  const displayEmail = user?.email || 'sunny@interviewx.ai';
  const initial = (displayName[0] || 'S').toUpperCase();

  const sectionsConfig = [
    { key: 'interview', label: 'AI Mock Interview', icon: '🎯' },
    { key: 'resume', label: 'Resume ATS Scanner', icon: '📄' },
    { key: 'coding', label: 'Coding Arena', icon: '💻' },
    { key: 'career', label: 'Career Roadmap', icon: '🗺️' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Top Bar with Back Button */}
      <View style={[styles.headerBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile & Settings</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.userEmail, { color: theme.subtext }]}>{displayEmail}</Text>
          <View style={styles.proPill}>
            <Text style={styles.proPillText}>⭐ PRO CANDIDATE</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNum, { color: theme.text }]}>{totalInterviews}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Sessions</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNum, { color: '#22c55e' }]}>{avgScore}%</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Avg score</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNum, { color: '#f59e0b' }]}>{streak}🔥</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Streak</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNum, { color: '#38bdf8' }]}>{solvedCount}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Solved</Text>
          </View>
        </View>

        {/* ─── THEME & APPEARANCE SETTINGS ─────────────────────────── */}
        <Text style={[styles.sectionHeading, { color: theme.muted }]}>GLOBAL THEME PALETTE</Text>
        <View style={styles.themeGrid}>
          {Object.values(THEMES).map((t) => {
            const isSelected = themeId === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.themeOptionCard,
                  { backgroundColor: t.bg, borderColor: isSelected ? t.primary : theme.border },
                  isSelected && styles.themeOptionSelected,
                ]}
                onPress={() => setThemeId(t.id)}
                activeOpacity={0.8}
              >
                <View style={styles.themePreviewRow}>
                  <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
                  {isSelected && (
                    <View style={[styles.selectedCheck, { backgroundColor: t.primary }]}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.themeOptionName, { color: t.text }]}>{t.name}</Text>
                <View style={styles.colorDotsRow}>
                  <View style={[styles.colorDot, { backgroundColor: t.primary }]} />
                  <View style={[styles.colorDot, { backgroundColor: t.card }]} />
                  <View style={[styles.colorDot, { backgroundColor: t.border }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── SECTION-SPECIFIC ACCENT COLORS ───────────────────────── */}
        <Text style={[styles.sectionHeading, { color: theme.muted, marginTop: 22 }]}>
          SECTION ACCENT CUSTOMIZATION
        </Text>
        <View style={[styles.sectionAccentsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {sectionsConfig.map((sec, idx) => {
            const currentAccentKey = sectionAccents[sec.key] || 'blue';
            return (
              <View
                key={sec.key}
                style={[
                  styles.sectionAccentRow,
                  idx < sectionsConfig.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 },
                ]}
              >
                <View style={styles.sectionAccentLeft}>
                  <Text style={{ fontSize: 18, marginRight: 8 }}>{sec.icon}</Text>
                  <Text style={[styles.sectionAccentTitle, { color: theme.text }]}>{sec.label}</Text>
                </View>

                {/* Accent Color Circles */}
                <View style={styles.accentCirclesWrap}>
                  {Object.values(ACCENT_PALETTES).map((acc) => {
                    const isAccSelected = currentAccentKey === acc.id;
                    return (
                      <TouchableOpacity
                        key={acc.id}
                        style={[
                          styles.accentCircle,
                          { backgroundColor: acc.color },
                          isAccSelected && styles.accentCircleActive,
                        ]}
                        onPress={() => setSectionAccent(sec.key, acc.id)}
                        activeOpacity={0.7}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        {/* App Preferences */}
        <Text style={[styles.sectionHeading, { color: theme.muted, marginTop: 22 }]}>PREFERENCES</Text>
        <View style={[styles.prefsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.prefRow}>
            <Text style={{ fontSize: 18, marginRight: 10 }}>🔔</Text>
            <Text style={[styles.prefLabel, { color: theme.text }]}>Push Notifications</Text>
            <Switch
              value={notifs}
              onValueChange={setNotifs}
              trackColor={{ false: '#374151', true: theme.primary }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.prefRow, { borderTopWidth: 1, borderTopColor: theme.border }]}>
            <Text style={{ fontSize: 18, marginRight: 10 }}>🔊</Text>
            <Text style={[styles.prefLabel, { color: theme.text }]}>Sound & Voice Prompts</Text>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#374151', true: theme.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },

  // User Card
  userCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 10,
  },
  proPill: {
    backgroundColor: '#854d0e30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b50',
  },
  proPillText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Section Heading
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  // Theme Grid
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeOptionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
  },
  themeOptionSelected: {
    borderWidth: 2,
  },
  themePreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  themeOptionName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  colorDotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Section Accents
  sectionAccentsCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionAccentRow: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionAccentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionAccentTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  accentCirclesWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  accentCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  accentCircleActive: {
    borderWidth: 2.5,
    borderColor: '#ffffff',
    transform: [{ scale: 1.25 }],
  },

  // Preferences
  prefsCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  prefLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },

  logoutBtn: {
    backgroundColor: '#381014',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef444450',
    marginTop: 4,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '800',
  },
});
