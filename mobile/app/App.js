// App.js – entry point for the InterviewX mobile app
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.log('App Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errBox}>
          <Text style={styles.errEmoji}>⚠️</Text>
          <Text style={styles.errTitle}>Something went wrong</Text>
          <Text style={styles.errMsg}>{String(this.state.error?.message || 'Unknown error')}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121214', padding: 24 },
  errEmoji: { fontSize: 48, marginBottom: 16 },
  errTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  errMsg: { fontSize: 13, color: '#aaa', textAlign: 'center' },
});

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
