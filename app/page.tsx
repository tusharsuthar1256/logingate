'use client'
import React, { useState } from 'react';
import Navbar from './(components)/Navbar';
import Hero from './(components)/Hero';
import Features from './(components)/Features';
import LiveDemo from './(components)/LiveDemo';
import Pricing from './(components)/Pricing';
import FAQ from './(components)/FAQ';
import Footer from './(components)/Footer';
import Dashboard from './(dashboard)/dashboard/page';


function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState('analysis');

  const navigateToDashboard = (tab = 'analysis') => {
    setDashboardTab(tab);
    window.scrollTo(0, 0);
    setCurrentView('dashboard');
  };

  const navigateToLanding = () => {
    window.scrollTo(0, 0);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary/30 selection:text-primary-foreground relative bg-[#0A0A0B] transition-colors duration-300">

      {currentView === 'landing' ? (
        <>
          <Navbar />
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
          onNavigateHome={navigateToLanding}
          initialTab={dashboardTab}
        />
      )}
    </div>
  );
}

export default App;
