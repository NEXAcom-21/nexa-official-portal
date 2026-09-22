import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NexaConfig, NexaScreenshot, HelpArticle } from './types';
import { UpdateBanner } from './components/UpdateBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NexaAiChat } from './components/NexaAiChat';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { DownloadPage } from './pages/DownloadPage';
import { ScreenshotsPage } from './pages/ScreenshotsPage';
import { UpdatesPage } from './pages/UpdatesPage';
import { HelpPage } from './pages/HelpPage';
import { AiHelpPage } from './pages/AiHelpPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ToolsPage } from './pages/ToolsPage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\/+/, '');
    return path || 'home';
  });

  const [contactParams, setContactParams] = useState<{ service?: string; category?: string } | undefined>(undefined);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [config, setConfig] = useState<NexaConfig | null>(null);
  const [screenshots, setScreenshots] = useState<NexaScreenshot[]>([]);
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch remote backend config and initial resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [configRes, screenRes, helpRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/screenshots'),
          fetch('/api/help-articles')
        ]);

        if (configRes.ok) {
          const configData = await configRes.json();
          setConfig(configData);
        }
        if (screenRes.ok) {
          const screenData = await screenRes.json();
          setScreenshots(screenData);
        }
        if (helpRes.ok) {
          const helpData = await helpRes.json();
          setHelpArticles(helpData);
        }
      } catch (err) {
        console.error('Error fetching initial NEXA resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '');
      setCurrentPage(path || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handler
  const handleNavigate = (page: string, params?: { service?: string; category?: string }) => {
    if (params) {
      setContactParams(params);
    }
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfigUpdated = (newConfig: NexaConfig) => {
    setConfig(newConfig);
  };

  // Render Page Switcher
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            config={config}
            onNavigate={handleNavigate}
          />
        );
      case 'features':
        return <FeaturesPage config={config} onNavigate={handleNavigate} />;
      case 'download':
        return <DownloadPage config={config} onNavigate={handleNavigate} />;
      case 'screenshots':
        return <ScreenshotsPage screenshots={screenshots} onNavigate={handleNavigate} />;
      case 'updates':
        return <UpdatesPage config={config} onNavigate={handleNavigate} />;
      case 'tools':
        return <ToolsPage config={config} onNavigate={handleNavigate} />;
      case 'help':
        return <HelpPage articles={helpArticles} onNavigate={handleNavigate} />;
      case 'ai-help':
        return <AiHelpPage onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage config={config} initialParams={contactParams} />;
      case 'about':
        return <AboutPage config={config} onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPage config={config} />;
      case 'terms':
        return <TermsPage config={config} />;
      case 'admin':
        return <AdminDashboard config={config} onConfigUpdated={handleConfigUpdated} />;
      default:
        return (
          <HomePage
            config={config}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Top Banner (Remote Config driven) */}
        <UpdateBanner config={config} onNavigate={handleNavigate} />

        {/* Global Navigation Header */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          config={config}
          onOpenAiChat={() => setIsAiChatOpen(true)}
        />

        {/* Main Content View with Smooth Fade Transition */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer */}
        <Footer config={config} onNavigate={handleNavigate} />

        {/* Official Nexa AI Chat Agent Widget */}
        <NexaAiChat
          isOpen={isAiChatOpen}
          onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
          onNavigate={handleNavigate}
        />

        {/* Global Authentication Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
