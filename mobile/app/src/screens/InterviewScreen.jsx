// src/screens/InterviewScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ROLES = [
  'Full Stack Engineer', 'Backend Developer', 'Frontend Engineer',
  'ML Engineer', 'DevOps Engineer', 'RTOS Embedded Engineer', 'iOS Developer',
];
const COMPANIES = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Uber', 'Netflix', 'Qualcomm'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TYPES = ['Technical', 'Behavioral', 'System Design'];

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

export default function InterviewScreen({ route, navigation }) {
  const { theme, sectionAccents, ACCENT_PALETTES } = useTheme();
  const initialType = route.params?.initialType || 'Technical';
  const initialRole = route.params?.initialRole || (initialType === 'System Design' ? 'System Design Specialist' : initialType === 'Behavioral' ? 'Behavioral & Leadership' : 'Full Stack Engineer');
  const initialCompany = route.params?.initialCompany || 'Google';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const [selectedDiff, setSelectedDiff] = useState('Medium');
  const [selectedType, setSelectedType] = useState(initialType);

  const accentObj = ACCENT_PALETTES[sectionAccents.interview] || ACCENT_PALETTES.blue;

  const handleStart = () => {
    navigation.navigate('InterviewRoom', {
      config: {
        company: selectedCompany,
        role: selectedRole,
        difficulty: selectedDiff,
        type: selectedType,
      },
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header Bar */}
      <View style={[styles.topHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={[styles.backText, { color: accentObj.color }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Interview Setup</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>🎯 AI Technical Interview</Text>
        <Text style={[styles.pageSub, { color: theme.muted }]}>Configure your customized evaluation session</Text>

        {/* Role */}
        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>JOB ROLE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.chip,
                { backgroundColor: theme.card, borderColor: selectedRole === r ? accentObj.color : theme.border },
                selectedRole === r && { backgroundColor: accentObj.bg },
              ]}
              onPress={() => setSelectedRole(r)}
            >
              <Text style={[styles.chipText, { color: selectedRole === r ? accentObj.color : theme.subtext }, selectedRole === r && { fontWeight: '800' }]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Company */}
        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>TARGET COMPANY</Text>
        <View style={styles.grid}>
          {COMPANIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.companyChip,
                { backgroundColor: theme.card, borderColor: selectedCompany === c ? accentObj.color : theme.border },
                selectedCompany === c && { backgroundColor: accentObj.bg },
              ]}
              onPress={() => setSelectedCompany(c)}
            >
              <Text style={[styles.chipText, { color: selectedCompany === c ? accentObj.color : theme.subtext }, selectedCompany === c && { fontWeight: '800' }]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Interview Type */}
        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>INTERVIEW TYPE</Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeChip,
                { backgroundColor: theme.card, borderColor: selectedType === t ? accentObj.color : theme.border },
                selectedType === t && { backgroundColor: accentObj.bg },
              ]}
              onPress={() => setSelectedType(t)}
            >
              <Text style={[styles.typeText, { color: selectedType === t ? accentObj.color : theme.subtext }, selectedType === t && { fontWeight: '800' }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty */}
        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>DIFFICULTY LEVEL</Text>
        <View style={styles.diffRow}>
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.diffChip,
                { borderColor: DIFF_COLORS[d], backgroundColor: theme.card },
                selectedDiff === d && { backgroundColor: DIFF_COLORS[d] },
              ]}
              onPress={() => setSelectedDiff(d)}
            >
              <Text style={[styles.diffText, { color: selectedDiff === d ? '#ffffff' : DIFF_COLORS[d] }]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Session Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>📋 Session Configuration</Text>
          <View style={[styles.summaryRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.summaryKey, { color: theme.muted }]}>🏢 Target Company</Text>
            <Text style={[styles.summaryVal, { color: theme.text }]}>{selectedCompany}</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.summaryKey, { color: theme.muted }]}>💼 Role</Text>
            <Text style={[styles.summaryVal, { color: theme.text }]}>{selectedRole}</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.summaryKey, { color: theme.muted }]}>🗣️ Format</Text>
            <Text style={[styles.summaryVal, { color: theme.text }]}>{selectedType}</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.summaryKey, { color: theme.muted }]}>📊 Difficulty</Text>
            <Text style={[styles.summaryVal, { color: DIFF_COLORS[selectedDiff], fontWeight: '800' }]}>{selectedDiff}</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.summaryKey, { color: theme.muted }]}>❓ Evaluation</Text>
            <Text style={[styles.summaryVal, { color: theme.text }]}>5 AI Technical Questions</Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: accentObj.color }]}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.startText}>🚀 Launch Technical Interview</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
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
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  companyChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  diffChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  diffText: {
    fontWeight: '800',
    fontSize: 13,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  summaryKey: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  startBtn: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
});
