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

export default App;
