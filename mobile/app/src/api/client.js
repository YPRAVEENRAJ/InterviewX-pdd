import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Expo SDK 54: manifest2 replaces manifest, with fallback to hardcoded IP
const getBaseUrl = () => {
  // Try Expo Go debugger host (SDK 54 uses expoConfig or manifest2)
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:5000/api`;
  }

  // Fallback: your laptop's IP on local network
  return 'http://192.168.1.36:5000/api';
};

const API_BASE_URL = getBaseUrl();
console.log('📡 API connecting to:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach JWT token to each request if present
api.interceptors.request.use(
  async (config) => {
    let token = null;
    try {
      token = await SecureStore.getItemAsync('jwt');
    } catch {
      try {
        token = await AsyncStorage.getItem('jwt');
      } catch {}
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

