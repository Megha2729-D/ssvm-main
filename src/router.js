import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SecurityUtils } from "./utils/Security";

import Homepage from "./Pages/Homepage";
import StudentpreneurAward from "./Pages/StudentpreneurAward";
import RegistrationPage from "./Pages/RegistrationPage";
import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/DashboardPage";
import Preloader from "./Component/Preloader";

import AOS from "aos";
import "aos/dist/aos.css";

// ✅ Common layout
import Navbar from "./Pages/Navbar";
import Footer from "./Pages/Footer";
import CustomCursor from "./Component/Cursor";
import anime from "animejs";

gsap.registerPlugin(ScrollTrigger);

// 🔥 Layout wrapper
// 🔥 Layout wrapper with Outlet for nested routes
const Layout = () => {
    React.useLayoutEffect(() => {
        // High-priority scroll-to-top on layout mount
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }, []);

    return (
        <>
            <CustomCursor />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

// 🔥 Navigation stability handler
const NavigationHandler = ({ setLoading }) => {
    const { pathname, hash, key } = useLocation();
    const isFirstMount = React.useRef(true);

    const prevPathRef = React.useRef(pathname);

    useEffect(() => {
        // 1. Initial mount logic...
        if (isFirstMount.current) {
            isFirstMount.current = false;
            if (!hash) window.scrollTo(0, 0);
            const timer = setTimeout(() => {
                setLoading(false);
                document.body.style.overflow = "auto";
                if (hash) {
                    const id = hash.replace("#", "");
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: "auto" });
                }
            }, 800); 
            return () => clearTimeout(timer);
        }

        // 2. PAGE CHANGE CLEANUP (Only on pathname change, NOT hash change)
        if (prevPathRef.current !== pathname) {
            if (window.ScrollTrigger) {
                window.ScrollTrigger.getAll().forEach(t => { t.revert(); t.kill(); });
                window.ScrollTrigger.refresh();
            }
            if (window.gsap) window.gsap.killTweensOf("*");
            prevPathRef.current = pathname;
        }

        // 3. SCROLL LOGIC
        if (!hash) {
            const forceTop = () => {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            };
            forceTop();
            const refreshTimer = setTimeout(() => {
                forceTop();
                if (window.ScrollTrigger) window.ScrollTrigger.refresh();
            }, 150); 
            return () => clearTimeout(refreshTimer);
        } else {
            const scrollTimer = setTimeout(() => {
                const id = hash.replace("#", "");
                const performScroll = () => {
                    if (!window.ScrollTrigger) return;
                    window.ScrollTrigger.refresh();
                    if (window.AOS) window.AOS.refresh();

                    setTimeout(() => {
                        const el = document.getElementById(id);
                        if (el) {
                            const st = window.ScrollTrigger.create({ trigger: el, start: "top 120px" });
                            let targetScroll = st.start;
                            st.kill(); 

                            // Fallback if GSAP returns 0 for a non-top element
                            if (targetScroll < 200 && id !== "home") {
                                const rect = el.getBoundingClientRect();
                                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                                targetScroll = rect.top + currentScroll - 120;
                            }

                            const scrollProxy = { y: window.pageYOffset };
                            anime({
                                targets: scrollProxy,
                                y: targetScroll,
                                duration: 1500,
                                easing: 'easeInOutExpo',
                                update: () => { window.scrollTo(0, scrollProxy.y); }
                            });
                        }
                    }, 150);
                };
                performScroll();
                setTimeout(performScroll, 1200);
            }, 400); 
            return () => clearTimeout(scrollTimer);
        }
    }, [pathname, hash, setLoading, key]);

    return null;
};

// ✅ Inner component to consume Router hooks
const AppContent = ({ loading, setLoading }) => {
    const location = useLocation();

    return (
        <>
            <NavigationHandler setLoading={setLoading} />
            
            {/* ✅ Forced remount on route change using key={location.pathname} 
                This ensures the page content actually updates when you click a link */}
            <Routes key={location.pathname}>
                {/* Wrap all routes in the single Layout instance */}
                <Route element={<Layout />}>
                    {/* ✅ Homepage */}
                    <Route path="/" element={<Homepage />} />
                    {/* ✅ Other Routes */}
                    <Route path="/studentpreneur-award" element={<StudentpreneurAward />} />
                    <Route path="/register" element={<RegistrationPage />} />
                </Route>

                {/* ✅ Routes without Header/Footer */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>

            {/* 🔥 Preloader only shows on initial mount or recovery */}
            {loading && <Preloader />}
        </>
    );
};

const Router = () => {
    // 🔥 Re-enabled for initial entry ONLY (as requested)
    const [loading, setLoading] = useState(true);

    // AOS init
    useEffect(() => {
        AOS.init({ duration: 1000, once: false, easing: "ease-in-out" });
    }, []);

    // Prevent scroll restore
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    // 🔥 Page Enter Clear Logic (Runs ONCE on app load)
    useEffect(() => {
        const initSecurity = async () => {
            try {
                await SecurityUtils.clearAppCache();
            } catch (e) {
                console.error("Router: Security initialization failed", e);
            }
        };
        initSecurity();
    }, []);

    // 🔥 Global GSAP stability settings
    useEffect(() => {
        gsap.config({
            autoSleep: 60,
            force3D: true,
        });

        ScrollTrigger.config({
            ignoreMobileResize: true,
        });

        ScrollTrigger.defaults({
            anticipatePin: 1,
        });
    }, []);

    return (
        <BrowserRouter>
            <AppContent loading={loading} setLoading={setLoading} />
        </BrowserRouter>
    );
};

export default Router;