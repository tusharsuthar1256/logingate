'use client'
import React, { useState, useEffect } from 'react';

import Dashboard from './dashboard/page';
import CursorSpotlight from '../(components)/CursorSpotlight';


function App() {
  // Default to dark mode for that premium tech feel
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState('analysis');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);



  const navigateToLanding = () => {
    window.scrollTo(0, 0);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary/30 selection:text-primary-foreground relative bg-gray-50 dark:bg-[#0A0A0B] transition-colors duration-300">
      <CursorSpotlight />


      <Dashboard
        onNavigateHome={navigateToLanding}
        initialTab={dashboardTab}
      />
    </div>
  );
}

export default App;
