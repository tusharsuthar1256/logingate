  'use client'
  import React, { useState, useEffect } from 'react';
  import CursorSpotlight from './(components)/CursorSpotlight';
  import Navbar from './(components)/Navbar';
  import Hero from './(components)/Hero';
  import Features from './(components)/Features';
  import LiveDemo from './(components)/LiveDemo';
  import Pricing from './(components)/Pricing';
  import FAQ from './(components)/FAQ';
  import Footer from './(components)/Footer';
  import Dashboard from './(dashboard)/dashboard/page';


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

    const navigateToDashboard = (tab = 'sign-in') => {
      setDashboardTab(tab);
      window.scrollTo(0, 0);
      setCurrentView('sign-in');
    };

    const navigateToLanding = () => {
      window.scrollTo(0, 0);
      setCurrentView('landing');
    };

    return (
      <div className="min-h-screen font-sans selection:bg-primary/30 selection:text-primary-foreground relative bg-gray-50 dark:bg-[#0A0A0B] transition-colors duration-300">
        <CursorSpotlight />
        
        {currentView === 'landing' ? (
          <>
            <Navbar
              isDarkMode={isDarkMode} 
              toggleTheme={toggleTheme} 
              mode="landing"
              onNavigate={(tab) => navigateToDashboard(typeof tab === 'string' ? tab : 'sign-in')}
            />
            <main>
              <Hero onStart={() => navigateToDashboard('analysis')} />
              <Features />
              <LiveDemo />
              <Pricing onSelectPlan={() => navigateToDashboard('analysis')} />
              <FAQ />
            </main>
            <Footer />
          </>
        ) : (
          <Dashboard 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
            onNavigateHome={navigateToLanding}
            initialTab={dashboardTab}
          />
        )}
      </div>
    );
  }

  export default App;
