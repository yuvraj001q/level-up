'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

const LS_KEY = 'level-up-app-version';

export function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const checkVersion = useCallback(async () => {
    try {
      const res = await fetch('/api/app/version');
      const data = await res.json();
      const current = data.version;

      if (!current || current === 'dev') return;

      const stored = localStorage.getItem(LS_KEY);
      if (stored && stored !== current) {
        setUpdateAvailable(true);
      }
      localStorage.setItem(LS_KEY, current);
    } catch {
      // offline — skip
    }
  }, []);

  useEffect(() => {
    checkVersion();

    // Check every 5 minutes while app is open
    const interval = setInterval(checkVersion, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkVersion]);

  // Service worker update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // A new SW has taken over — page will reload on next navigation
        setUpdateAvailable(true);
      });
    }
  }, []);

  const handleRefresh = () => {
    localStorage.removeItem(LS_KEY);
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {updateAvailable && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-bg-card/80 backdrop-blur-xl p-4 flex items-center gap-3 border border-border-subtle rounded-xl shadow-xl">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-4 h-4 text-accent-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Update Available</p>
              <p className="text-xs text-text-muted">A new version is ready. Refresh to get the latest features.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Refresh
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
