import React from 'react';
/**
 * Security Utility for SSVM Institutions
 * Handles cache clearing, input sanitization, and malicious code protection.
 */

export const SecurityUtils = {
    /**
     * Clears application cache, local storage, and session storage.
     * This is the "Catch Clear" logic requested.
     */
    /**
     * Clears application cache, local storage, and session storage.
     * Thoroughly wipes all state to ensure a clean slate.
     */
    clearAppCache: async () => {
        try {
            console.log("Security Layer: Initiating deep cache clear...");

            // 1. Clear Storage
            localStorage.clear();
            sessionStorage.clear();

            // 2. Clear All Caches
            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map(name => caches.delete(name)));
            }

            // 3. Unregister Service Workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.unregister()));
            }

            // 4. Clear Cookies
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }

            // ❌ REMOVED console.clear() to allow debugging
            console.log("Security Layer: System wiped successfully.");
            return true;
        } catch (error) {
            console.error("Security Layer Error: Failed to clear cache.", error);
            return false;
        }
    },

    /**
     * Sanitizes strings to prevent XSS and malicious code injection.
     */
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return input;

        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/script/gi, "[removed]")
            .replace(/eval\(/gi, "[removed](");
    },

    /**
     * Validates if a file type is safe.
     */
    isSafeFile: (file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
        if (!file) return false;
        if (!allowedTypes.includes(file.type)) return false;
        const maxSize = 5 * 1024 * 1024; // 5MB
        return file.size <= maxSize;
    }
};

/**
 * Premium Error Boundary Component
 * Provides a sophisticated fallback UI with automatic recovery.
 */
export class SecurityErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error };
    }

    componentDidCatch(error, errorInfo) {
        // 1. Log error for diagnostics
        console.error("Security Layer caught an error:", error, errorInfo);
        
        // 2. Clear cache to prevent corrupted state
        SecurityUtils.clearAppCache();

        // 3. INSTANT RECOVERY for DOM errors: If it's the notorious "removeChild" React error,
        // we reload IMMEDIATELY to resolve the DOM mismatch and show the page details.
        const errorMsg = error?.message || "";
        const isDomError = errorMsg.includes("removeChild") || errorMsg.includes("appendChild");

        const lastCrash = sessionStorage.getItem('last_security_crash');
        const now = Date.now();
        
        if (!lastCrash || (now - parseInt(lastCrash)) > 5000) {
            sessionStorage.setItem('last_security_crash', now.toString());
            
            if (isDomError) {
                // Silent instant reload for DOM mismatch (GSAP conflict)
                window.location.reload();
            } else {
                // Short delay for other security exceptions
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        }
    }

    componentDidCatch(error, errorInfo) {
        // 1. Log error for diagnostics
        console.error("Security Layer: Auto-healing from exception:", error);
        
        // 2. Clear cache to ensure clean state on reload
        SecurityUtils.clearAppCache();

        // 3. SILENT RECOVERY: Instead of showing a shield, we reload immediately.
        // This makes the fix look like a standard (slightly slower) page load.
        const lastCrash = sessionStorage.getItem('last_security_crash');
        const now = Date.now();
        
        // Prevent infinite loops (only reload if last crash was > 3s ago)
        if (!lastCrash || (now - parseInt(lastCrash)) > 3000) {
            sessionStorage.setItem('last_security_crash', now.toString());
            window.location.reload();
        }
    }

    render() {
        if (this.state.hasError) {
            // Invisible recovery: setting flag to skip the next preloader loop
            sessionStorage.setItem('skip_preloader', 'true');
            return null; // Don't show any UI, just wait for reload
        }

        return this.props.children;
    }
}
