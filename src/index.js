import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './router';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { SecurityErrorBoundary, SecurityUtils } from './utils/Security';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ✅ 0. GLOBAL SCROLL REFRESH ON LOAD & RESIZE */
const handleInitialLoadRefresh = () => {
  const refreshAll = () => {
    // Force layout recalculation
    document.body.getBoundingClientRect();
    
    // Refresh ScrollTrigger directly
    ScrollTrigger.refresh();
    
    // Refresh AOS if present
    if (window.AOS) {
      window.AOS.refresh();
    }
  };

  // 1. Initial load refresh (Wait for styles and images)
  window.addEventListener('load', () => {
    setTimeout(refreshAll, 500);
    setTimeout(refreshAll, 1500); // 2nd pass for slow Lotties
  });

  // 2. Aggressive ResizeObserver to catch any Lottie layout shifts
  const resizeObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(() => {
      refreshAll();
    });
  });

  resizeObserver.observe(document.body);

  // 3. Periodic fallback refreshes for the first few seconds
  [1000, 3000, 5000, 10000].forEach(delay => {
    setTimeout(refreshAll, delay);
  });
};

handleInitialLoadRefresh();




/* ✅ 1. VERSION-BASED AUTOMATIC CACHE CLEARING */
const APP_VERSION = '1.0.5'; // Change this to force update

const handleVersionUpgrade = async () => {
  const savedVersion = localStorage.getItem('ssvm_version');

  // First-time visitor → just store version
  if (!savedVersion) {
    localStorage.setItem('ssvm_version', APP_VERSION);
    return;
  }

  // Version changed → clear cache + reload
  if (savedVersion !== APP_VERSION) {
    console.log(`Update detected: ${savedVersion} → ${APP_VERSION}. Clearing cache...`);

    await SecurityUtils.clearAppCache();

    localStorage.setItem('ssvm_version', APP_VERSION);

    window.location.reload();
  }
};

handleVersionUpgrade();

/* ✅ 2. PREVENT BACK/FORWARD CACHE ISSUES */
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('Page loaded from bfcache → reloading...');
    window.location.reload();
  }
});

/* ✅ 3. RENDER APP */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <SecurityErrorBoundary>
    <Router />
  </SecurityErrorBoundary>
);

/* ✅ 4. PERFORMANCE LOGGING */
reportWebVitals();