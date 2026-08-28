import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobileFrameSimulator from './components/MobileFrameSimulator';
import MobileAppModal from './components/MobileAppModal';
import NotificationsModal from './components/NotificationsModal';

// Core Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import InterviewReportPage from './pages/InterviewReportPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import CodingPracticePage from './pages/CodingPracticePage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // Default view
  
  // Dynamic HTML Dark/Light Mode Class Controller
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Verified Logged in User (Praveen)
  const [user, setUser] = useState({
    name: 'Praveen',
    email: 'praveen@interviewx.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });

  // REAL-TIME REGISTERED USERS REGISTRY
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 'u-1',
      name: 'Praveen',
      email: 'praveen@interviewx.com',
      role: 'admin',
      registeredAt: 'System Setup (SuperAdmin)'
    }
  ]);

  // REAL-TIME USER ACTIVITY STATS
  const [userStats, setUserStats] = useState({
    solvedCount: 0,
    atsScore: null,
    atsFileName: null,
    recentInterviews: []
  });

  // Active Interview Configuration & Results
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [completedAnswers, setCompletedAnswers] = useState([]);
  const [proctorReport, setProctorReport] = useState(null);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Platform Admin Session', message: 'Logged in as Praveen (praveen@interviewx.com)', type: 'System', time: '1m ago', is_read: false }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleUserAuthSuccess = (newLoggedUser) => {
    setUser(newLoggedUser);
    
    // Register user dynamically if not present
    setRegisteredUsers(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === newLoggedUser.email.toLowerCase());
      if (!exists) {
        return [
          ...prev, 
          {
            id: `u-${prev.length + 1}`,
            name: newLoggedUser.name || 'New Candidate',
            email: newLoggedUser.email,
            role: newLoggedUser.role,
            registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });

    setUserStats({ solvedCount: 0, atsScore: null, atsFileName: null, recentInterviews: [] });
    setActiveTab('dashboard');
  };

  const handleStartInterview = (config) => {
    setInterviewConfig(config);
    setCompletedAnswers([]);
    setProctorReport(null);
    setActiveTab('interview-room');
  };

  const handleFinishInterview = (answersList, proctorStats, isTerminatedEarly = false) => {
    const isEarly = isTerminatedEarly || (answersList && answersList.every(a => !a.isProvided));
    const calculatedScore = isEarly ? 0 : (answersList && answersList.length > 0 ? 88 : 0);

    setCompletedAnswers(answersList || []);
    setProctorReport({
      ...(proctorStats || {}),
      isTerminatedEarly: isEarly
    });
    
    // Add real interview record to userStats
    const newRecord = {
      role: interviewConfig?.jobRole || 'Full Stack SDE',
      company: interviewConfig?.company || 'Google',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: calculatedScore,
      type: interviewConfig?.interviewType || 'Technical',
      status: isEarly ? 'Ended Early (0 Marks)' : 'Completed'
    };

    setUserStats(prev => ({
      ...prev,
      recentInterviews: [newRecord, ...prev.recentInterviews]
    }));

    setActiveTab('interview-report');
  };

  const handleSolveCodingProblem = () => {
    setUserStats(prev => ({
      ...prev,
      solvedCount: prev.solvedCount + 1
    }));
  };

  const handleATSScanComplete = (score, fileName) => {
    setUserStats(prev => ({
      ...prev,
      atsScore: score,
      atsFileName: fileName
    }));
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <MobileFrameSimulator isEnabled={isMobileSimulator} onToggle={() => setIsMobileSimulator(false)}>
        <div className="min-h-screen bg-slate-100 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-300">
          
          {/* Main Top Navigation Header */}
          <Navbar 
            theme={theme}
            setTheme={setTheme}
            isMobileSimulator={isMobileSimulator}
            setIsMobileSimulator={setIsMobileSimulator}
            setShowMobileModal={setShowMobileModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            setUser={setUser}
            setShowNotifications={setShowNotifications}
            unreadCount={unreadCount}
          />

          {/* Main Dynamic Viewport Screen */}
          <main className="flex-1">
            {activeTab === 'landing' && (
              <LandingPage onGetStarted={() => setActiveTab(user ? 'dashboard' : 'auth')} />
            )}

            {activeTab === 'auth' && (
              <AuthPage onLoginSuccess={handleUserAuthSuccess} />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage user={user} userStats={userStats} onNavigate={setActiveTab} />
            )}

            {activeTab === 'interview-setup' && (
              <InterviewSetupPage onStartInterview={handleStartInterview} />
            )}

            {activeTab === 'interview-room' && (
              <InterviewRoomPage config={interviewConfig} onFinishInterview={handleFinishInterview} />
            )}

            {activeTab === 'interview-report' && (
              <InterviewReportPage config={interviewConfig} userAnswers={completedAnswers} proctorReport={proctorReport} onBackToDashboard={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'resume-analyzer' && (
              <ResumeAnalyzerPage onScanComplete={handleATSScanComplete} />
            )}

            {activeTab === 'coding-practice' && (
              <CodingPracticePage onSolveSuccess={handleSolveCodingProblem} />
            )}

            {activeTab === 'user-profile' && (
              <UserProfilePage user={user} userStats={userStats} />
            )}

            {activeTab === 'admin-panel' && (
              <AdminPanelPage user={user} registeredUsers={registeredUsers} />
            )}
          </main>

          {/* Global Footer */}
          <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© 2026 InterviewX. AI Mock Interview & Evaluation Platform.</p>
              <div className="flex items-center space-x-4">
                <button onClick={() => setActiveTab('landing')} className="hover:text-slate-800 dark:hover:text-slate-300">Home</button>
                <button onClick={() => setActiveTab('admin-panel')} className="hover:text-slate-800 dark:hover:text-slate-300">Admin Portal</button>
                <button onClick={() => setActiveTab('user-profile')} className="hover:text-slate-800 dark:hover:text-slate-300">Profile</button>
              </div>
            </div>
          </footer>

          {/* Notifications Modal Drawer */}
          <NotificationsModal
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            markAsRead={markAsRead}
          />

          {/* Mobile Phone App Setup Modal */}
          <MobileAppModal
            isOpen={showMobileModal}
            onClose={() => setShowMobileModal(false)}
            isMobileSimulator={isMobileSimulator}
            setIsMobileSimulator={setIsMobileSimulator}
          />

        </div>
      </MobileFrameSimulator>
    </div>
  );
}
