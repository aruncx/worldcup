'use client'

import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import styles from './PWAInstallPrompt.module.css';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Basic mobile detection
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (checkMobile && !localStorage.getItem('pwaPromptDismissed')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If it's already installed or they dismissed it, do nothing
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!isVisible || !isMobile) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Close install prompt">
          <X size={18} />
        </button>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <Download size={24} color="var(--accent-primary)" />
          </div>
          <div className={styles.textWrapper}>
            <h4 className={styles.title}>Install World Cup Hub</h4>
            <p className={styles.desc}>Add to your Home Screen for a faster, app-like experience and live score updates.</p>
          </div>
        </div>
        <button className={styles.installBtn} onClick={handleInstallClick}>
          Install App
        </button>
      </div>
    </div>
  );
}
