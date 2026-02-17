import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Revision from './components/Revision';
import MockTest from './components/MockTest';
import Summary from './components/Summary';
import MCQPractice from './components/MCQPractice';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Init dark mode
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newVal;
    });
  };

  // Track current path for resume funtionality
  useEffect(() => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/onboarding') {
      localStorage.setItem('lastPath', window.location.pathname);
    }
  }, []); // We need to listen to location changes. 
  // Wait, I need useLocation hook inside Router, but Router is inside App.
  // I should move Router to enable useLocation usage or just create a wrapper component inside.
  // Actually, I can just use window.location.pathname in a simple useEffect on mount, 
  // BUT to track changes I need useLocation. 
  // Let's wrap the inner content in a component that uses useLocation.

  // Refactoring App to use a Layout component or similar.
  // Actually, standard Vite React structure often puts Router in main.
  // App.jsx has Router.
  // I will create a distinct component 'SessionTracker' and put it inside Router.

  const [showResumeParams, setShowResumeParams] = useState(null);

  return (
    <div className="relative">
      {/* Global Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 z-[9999] p-3 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-800 shadow-xl border-2 border-slate-700 dark:border-slate-200"
        title="Toggle Dark Mode"
      >
        <span className="material-icons-outlined text-lg">
          {darkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <Router>
        <SessionHandler setShowResumeParams={setShowResumeParams} />
        {showResumeParams && (
          <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume Session?</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We found an active session for <strong>{showResumeParams.name}</strong>. Would you like to continue where you left off?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    localStorage.clear();
                    setShowResumeParams(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Start Fresh
                </button>
                <button
                  onClick={() => {
                    setShowResumeParams(null);
                    window.location.href = showResumeParams.path; // Force reload to target path or just navigate if we could pass navigate
                    // Since this is outside Routes, we can't easily access navigate unless we move this inside. 
                    // Actually SessionHandler is inside Router, but this Modal is inside App but outside Routes.
                    // We can pass a callback to SessionHandler to do the navigation.
                    // Let's simplify: pass 'onConfirm' logic to SessionHandler or handle it there.
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/revision/:subject" element={<Revision />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/mcq-practice/:subject" element={<MCQPractice />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

// Helper component to handle session logic inside Router context
import { useLocation, useNavigate } from 'react-router-dom';

const SessionHandler = ({ setShowResumeParams }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Save current path (if not root/onboarding)
    if (location.pathname !== '/' && location.pathname !== '/onboarding') {
      localStorage.setItem('lastPath', location.pathname);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
    }
  }, [location]);

  useEffect(() => {
    // 2. Check for resume on mount
    const lastPath = localStorage.getItem('lastPath');
    const userName = localStorage.getItem('userName');
    const sessionTime = localStorage.getItem('sessionTimestamp');

    // If we are at root, and have a saved path
    if (location.pathname === '/' && lastPath && userName) {
      // Check if session is recent (e.g., < 24 hours) - optional, but user asked for simple persistence
      // Let's just show the prompt

      // We need to bypass the prompt if we *just* were redirected or reset. 
      // BUT, if the user manually reloaded the page at '/', they expect onboarding.
      // If they reloaded at '/dashboard', the browser would request '/dashboard' and Router would render Dashboard directly if history matches.
      // Wait, Vite SPA: if I reload '/dashboard', the server serves index.html, JS loads, Router sees '/dashboard', renders Dashboard.
      // So logical persistence is handled by URL.
      // The issue user mentioned is "data is lost".
      // So if I reload '/dashboard', I need to check if `userName` is in localStorage.
      // `Dashboard.jsx` ALREADY checks localStorage for userName.

      // The user said: "upon reloading the page, it gives a 404 not found error"
      // This happens in Vercel if rewriting rules aren't set for SPA.
      // I need to fix `vercel.json` for SPA rewrites first! That's the root cause of 404s.

      // However, user ALSO asked for "Resume Session" prompt.
      // If I fix Vercel rewrite, reload on /dashboard works.
      // If I don't fix Vercel rewrite, reload on /dashboard 404s.
      // User said "since we not saving user login or any session ... 404 not found error". This is a misunderstanding by the user, but persistence helps.

      // Let's implement the Resume Prompt logic for when they land on '/'.
      setShowResumeParams({ name: userName, path: lastPath });
    }
  }, []); // Run once on mount

  return null;
};

export default App;
