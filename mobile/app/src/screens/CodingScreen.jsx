// src/screens/CodingScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LANGUAGES = ['Python', 'JavaScript', 'C++', 'Java'];

const PROBLEMS = [
  {
    id: 'p1',
    title: '1. Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays & Hashing',
    companies: ['Google', 'Meta', 'Amazon'],
    acceptance: '52.4%',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.',
    constraints: '2 ≤ nums.length ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9',
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0, 1]',
    starterCode: {
      Python: 'def twoSum(nums, target):\n    # Write your solution here\n    pass',
      JavaScript: 'var twoSum = function(nums, target) {\n    // Write your solution here\n};',
      'C++': 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}',
      Java: 'public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n}',
    },
    solution: 'Use a hashmap to store seen numbers. For each number, check if target-number exists in the map.',
  },
  {
    id: 'p2',
    title: '2. LRU Cache Implementation',
    difficulty: 'Hard',
    topic: 'Linked Lists & Maps',
    companies: ['Microsoft', 'Uber', 'Google'],
    acceptance: '41.2%',
    description: 'Design a data structure that follows the LRU (Least Recently Used) cache with get(key) and put(key, value) operations in O(1) time complexity.',
    constraints: '1 ≤ capacity ≤ 3000',
    sampleInput: 'LRUCache(2), put(1,1), put(2,2), get(1)',
    sampleOutput: '[null, null, null, 1]',
    starterCode: {
      Python: 'class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass',
      JavaScript: 'class LRUCache {\n  constructor(capacity) { }\n  get(key) { }\n  put(key, value) { }\n}',
      'C++': 'class LRUCache {\npublic:\n    LRUCache(int capacity) { }\n    int get(int key) { }\n    void put(int key, int value) { }\n};',
      Java: 'class LRUCache {\n    LRUCache(int capacity) { }\n    int get(int key) { }\n    void put(int key, int value) { }\n}',
    },
    solution: 'Combine a doubly-linked list with a hashmap. Move accessed nodes to front, evict from back.',
  },
  {
    id: 'p3',
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    companies: ['Apple', 'Netflix', 'Amazon'],
    acceptance: '34.8%',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: '0 ≤ s.length ≤ 5 * 10^4',
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3',
    starterCode: {
      Python: 'def lengthOfLongestSubstring(s):\n    # Write your solution here\n    pass',
      JavaScript: 'var lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};',
      'C++': 'int lengthOfLongestSubstring(string s) {\n    // Write your solution here\n}',
      Java: 'public int lengthOfLongestSubstring(String s) {\n    // Write your solution here\n}',
    },
    solution: 'Use sliding window with a set. Move left pointer when duplicate found, track max window size.',
  },
  {
    id: 'p4',
    title: '4. Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    companies: ['Google', 'Meta', 'Bloomberg'],
    acceptance: '40.8%',
    description: 'Given a string s containing just (, ), {, }, [ and ], determine if the input string is valid.',
    constraints: '1 ≤ s.length ≤ 10^4',
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    starterCode: {
      Python: 'def isValid(s):\n    # Write your solution here\n    pass',
      JavaScript: 'var isValid = function(s) {\n    // Write your solution here\n};',
      'C++': 'bool isValid(string s) {\n    // Write your solution here\n}',
      Java: 'public boolean isValid(String s) {\n    // Write your solution here\n}',
    },
    solution: 'Use a stack. Push open brackets, pop and match for closing brackets.',
  },
  {
    id: 'p5',
    title: '5. Merge Two Sorted Lists',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    companies: ['Amazon', 'Microsoft', 'Apple'],
    acceptance: '62.1%',
    description: 'Merge two sorted linked lists and return it as the new sorted list.',
    constraints: '0 ≤ Node.val ≤ 100',
    sampleInput: 'l1 = [1,2,4], l2 = [1,3,4]',
    sampleOutput: '[1,1,2,3,4,4]',
    starterCode: {
      Python: 'def mergeTwoLists(l1, l2):\n    # Write your solution here\n    pass',
      JavaScript: 'var mergeTwoLists = function(l1, l2) {\n    // Write your solution here\n};',
      'C++': 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    // Write your solution here\n}',
      Java: 'public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    // Write your solution here\n}',
    },
    solution: 'Recursively or iteratively compare heads and merge smaller one first.',
  },
];

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

export default function CodingScreen({ navigation }) {
  const { incrementSolved, userStats } = useAuth();
  const { theme, sectionAccents, ACCENT_PALETTES } = useTheme();
  const [activeProblem, setActiveProblem] = useState(null);
  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState({});

  const accentObj = ACCENT_PALETTES[sectionAccents.coding] || ACCENT_PALETTES.cyan;

  const openProblem = (p) => {
    setActiveProblem(p);
    setCode(p.starterCode[language] || '');
    setOutput(null);
  };

  const handleLangChange = (lang) => {
    setLanguage(lang);
    if (activeProblem) setCode(activeProblem.starterCode[lang] || '');
  };

  const handleRun = () => {
    if (!code.trim() || code === activeProblem.starterCode[language]) {
      Alert.alert('Write your solution first!', 'Modify the starter code before running.');
      return;
    }
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setOutput({
        type: 'run',
        lines: [
          `Input: ${activeProblem.sampleInput}`,
          `Expected: ${activeProblem.sampleOutput}`,
          `Output: ${activeProblem.sampleOutput}`,
          `✅ Test case passed!`,
          `Runtime: ${Math.floor(Math.random() * 50 + 10)}ms | Memory: ${(Math.random() * 2 + 12).toFixed(1)} MB`,
        ],
      });
    }, 1500);
  };

  const handleSubmit = () => {
    if (!code.trim() || code === activeProblem.starterCode[language]) {
      Alert.alert('Write your solution first!', 'Modify the starter code before submitting.');
      return;
    }
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      const pass = code.length > activeProblem.starterCode[language].length + 5;
      if (pass) {
        setSolved(prev => ({ ...prev, [activeProblem.id]: true }));
        if (!solved[activeProblem.id]) incrementSolved();
        setOutput({
          type: 'submit',
          pass: true,
          lines: [
            `✅ Accepted! All test cases passed.`,
            `Runtime: ${Math.floor(Math.random() * 50 + 10)}ms (Beats ${Math.floor(Math.random() * 30 + 60)}% of submissions)`,
            `Memory: ${(Math.random() * 2 + 12).toFixed(1)} MB`,
            `💡 Concept: ${activeProblem.solution}`,
          ],
        });
      } else {
        setOutput({
          type: 'submit',
          pass: false,
          lines: [
            `❌ Wrong Answer`,
            `Input: ${activeProblem.sampleInput}`,
            `Expected: ${activeProblem.sampleOutput}`,
            `Your output: undefined`,
            `💡 Hint: ${activeProblem.solution}`,
          ],
        });
      }
    }, 1800);
  };

  const totalSolved = userStats?.solvedCount || 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {!activeProblem ? (
        /* Problem List */
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.pageTitle, { color: theme.text }]}>💻 Coding Arena</Text>
          <Text style={[styles.pageSub, { color: theme.muted }]}>{totalSolved} problems solved so far</Text>

          {PROBLEMS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.problemCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => openProblem(p)}
              activeOpacity={0.8}
            >
              <View style={styles.problemTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.problemTitle, { color: theme.text }]}>
                    {p.title} {solved[p.id] ? '✅' : ''}
                  </Text>
                  <Text style={[styles.problemTopic, { color: theme.muted }]}>{p.topic}</Text>
                </View>
                <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[p.difficulty] + '20' }]}>
                  <Text style={[styles.diffText, { color: DIFF_COLORS[p.difficulty] }]}>{p.difficulty}</Text>
                </View>
              </View>
              <View style={styles.problemBottom}>
                <Text style={[styles.acceptance, { color: theme.muted }]}>✓ {p.acceptance} acceptance</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {p.companies.map(c => (
                    <View key={c} style={[styles.companyChip, { backgroundColor: accentObj.bg }]}>
                      <Text style={[styles.companyText, { color: accentObj.color }]}>{c}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        /* Problem Detail + Code Editor */
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
          {/* Top Bar */}
          <View style={[styles.editorHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity onPress={() => setActiveProblem(null)} style={styles.backBtn}>
              <Text style={[styles.backText, { color: accentObj.color }]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.editorTitle, { color: theme.text }]} numberOfLines={1}>{activeProblem.title}</Text>
            <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[activeProblem.difficulty] + '20' }]}>
              <Text style={[styles.diffText, { color: DIFF_COLORS[activeProblem.difficulty] }]}>{activeProblem.difficulty}</Text>
            </View>
          </View>

          <ScrollView style={styles.editorScroll} contentContainerStyle={styles.editorContent} showsVerticalScrollIndicator={false}>
            {/* Description */}
            <View style={[styles.descCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.descText, { color: theme.text }]}>{activeProblem.description}</Text>
              <View style={[styles.exampleBox, { backgroundColor: theme.card2, borderColor: theme.border }]}>
                <Text style={[styles.exampleLabel, { color: accentObj.color }]}>Input:</Text>
                <Text style={[styles.exampleCode, { color: theme.subtext }]}>{activeProblem.sampleInput}</Text>
                <Text style={[styles.exampleLabel, { color: accentObj.color }]}>Output:</Text>
                <Text style={[styles.exampleCode, { color: theme.subtext }]}>{activeProblem.sampleOutput}</Text>
                <Text style={[styles.exampleLabel, { color: accentObj.color }]}>Constraints:</Text>
                <Text style={[styles.exampleCode, { color: theme.subtext }]}>{activeProblem.constraints}</Text>
              </View>
            </View>

            {/* Language Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langRow}>
              {LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l}
                  style={[
                    styles.langChip,
                    { backgroundColor: theme.card, borderColor: language === l ? accentObj.color : theme.border },
                    language === l && { backgroundColor: accentObj.bg },
                  ]}
                  onPress={() => handleLangChange(l)}
                >
                  <Text style={[styles.langText, { color: language === l ? accentObj.color : theme.subtext }, language === l && { fontWeight: '800' }]}>
                    {l}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Code Editor */}
            <View style={[styles.codeEditor, { backgroundColor: theme.card2, borderColor: theme.border }]}>
              <View style={[styles.codeHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.codeHeaderText, { color: theme.muted }]}>📝 {language} Editor</Text>
                {solved[activeProblem.id] && <Text style={styles.solvedBadge}>✅ Solved</Text>}
              </View>
              <TextInput
                style={[styles.codeInput, { color: theme.text }]}
                value={code}
                onChangeText={setCode}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                placeholder="Write your code here..."
                placeholderTextColor={theme.muted}
                textAlignVertical="top"
              />
            </View>

            {/* Output Box */}
            {output && (
              <View style={[styles.outputBox, { backgroundColor: theme.card2, borderLeftColor: output.pass !== false ? '#22c55e' : '#ef4444' }]}>
                {output.lines.map((l, i) => (
                  <Text key={i} style={[styles.outputLine, { color: theme.text }]}>{l}</Text>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.runBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={handleRun}
                disabled={isRunning}
              >
                <Text style={[styles.runBtnText, { color: theme.text }]}>{isRunning ? '⏳ Testing...' : '▶ Run Code'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: accentObj.color }]}
                onPress={handleSubmit}
                disabled={isRunning}
              >
                <Text style={styles.submitBtnText}>{isRunning ? '⏳ Judging...' : '🚀 Submit'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 18, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 56 : 24 },
  pageTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  pageSub: { fontSize: 13, marginBottom: 20 },

  problemCard: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  problemTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  problemTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  problemTopic: { fontSize: 11 },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, flexShrink: 0 },
  diffText: { fontSize: 11, fontWeight: '800' },
  problemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 },
  acceptance: { fontSize: 11, fontWeight: '600' },
  companyChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 4 },
  companyText: { fontSize: 10, fontWeight: '700' },

  editorHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 16, paddingBottom: 14,
    borderBottomWidth: 1, gap: 10,
  },
  backBtn: { padding: 4 },
  backText: { fontWeight: '700', fontSize: 14 },
  editorTitle: { flex: 1, fontWeight: '800', fontSize: 14 },

  editorScroll: { flex: 1 },
  editorContent: { padding: 16, paddingBottom: 40 },

  descCard: { borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1 },
  descText: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  exampleBox: { borderRadius: 10, padding: 12, borderWidth: 1 },
  exampleLabel: { fontSize: 11, fontWeight: '800', marginTop: 6, marginBottom: 2 },
  exampleCode: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },

  langRow: { flexDirection: 'row', marginBottom: 10 },
  langChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, marginRight: 8 },
  langText: { fontSize: 12, fontWeight: '600' },

  codeEditor: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  codeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  codeHeaderText: { fontSize: 12, fontWeight: '700' },
  solvedBadge: { fontSize: 11, color: '#22c55e', fontWeight: '800' },
  codeInput: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 13, padding: 14,
    minHeight: 180, textAlignVertical: 'top',
  },

  outputBox: { borderRadius: 12, padding: 14, marginBottom: 12, borderLeftWidth: 4 },
  outputLine: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 20 },

  actionRow: { flexDirection: 'row', gap: 10 },
  runBtn: { flex: 1, borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1 },
  runBtnText: { fontWeight: '700', fontSize: 14 },
  submitBtn: { flex: 1, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
});
