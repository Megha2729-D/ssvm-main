import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleReveal from "./TitleReveal";
import "./MediaCoverage.css";

gsap.registerPlugin(ScrollTrigger);

const mediaOutlets = [
    { id: 1, image: "./assets/images/media/Andhra-Jyothi.jpg", name: "Andhra Jyothi", type: "Press" },
    { id: 2, image: "./assets/images/media/comail.png", name: "Co-mail", type: "Digital" },
    { id: 3, image: "./assets/images/media/Deepika-Emblem.png", name: "Deepika", type: "Press" },
    { id: 4, image: "./assets/images/media/dinakaran.png", name: "Dinakaran", type: "Regional" },
    { id: 5, image: "./assets/images/media/dinamalar.png", name: "Dinamalar", type: "Daily" },
    { id: 6, image: "./assets/images/media/dinamani-logo.webp", name: "Dinamani", type: "Press" },
    { id: 7, image: "./assets/images/media/makkal.jpeg", name: "Makkal", type: "Digital" },
    { id: 9, image: "./assets/images/media/Malai_Murasu.webp", name: "Malai Murasu", type: "Regional" },
    { id: 10, image: "./assets/images/media/malai-malar.webp", name: "Malai Malar", type: "Daily" },
    { id: 11, image: "./assets/images/media/Malayalamanorama.png", name: "Malayala Manorama", type: "Press" },
    { id: 12, image: "./assets/images/media/Mathrubhumi_English.webp", name: "Mathrubhumi", type: "English" },
    { id: 13, image: "./assets/images/media/Thanthi.png", name: "Thanthi", type: "Daily" },
    { id: 14, image: "./assets/images/media/The-Hindu-Logo.jpg", name: "The Hindu", type: "International" },
    { id: 15, image: "./assets/images/media/The-Hindu-Tamil.jpg", name: "The Hindu Tamil", type: "Press" },
    { id: 16, image: "./assets/images/media/thinathanti.png", name: "Thina Thanthi", type: "Regional" },
    { id: 17, image: "./assets/images/media/tm_logo.webp", name: "TM", type: "Digital" },
    { id: 18, image: "./assets/images/media/TNIE.webp", name: "TNIE", type: "English" },
    { id: 19, image: "./assets/images/media/ttof.png", name: "TTOF", type: "Daily" },
];

const MediaCoverage = () => {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(1);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scrollContainer = scrollContainerRef.current;
            
            const getScrollAmount = () => {
                if (!scrollContainer) return 0;
                return scrollContainer.scrollWidth - window.innerWidth;
            };

            // Unified Pin & Scroll - Optimized State Update
            let lastIndex = 1;

            // Sentry Refresh: Recalculate everything when we get close
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 120%", 
                onEnter: () => ScrollTrigger.refresh()
            });
            
            gsap.to(scrollContainer, {
                x: () => -getScrollAmount(),
                ease: "none",
                force3D: true, // Hardware acceleration
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${getScrollAmount()}`,
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const newInd = Math.min(
                            mediaOutlets.length,
                            Math.max(1, Math.round(progress * (mediaOutlets.length - 1)) + 1)
                        );
                        
                        if (newInd !== lastIndex) {
                            lastIndex = newInd;
                            setCurrentIndex(newInd);
                        }
                    }
                }
            });

            // Card Reveal
            gsap.from(".mc-card", {
                y: 30,
                scale: 0.9,
                stagger: 0.05,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            // Multi-Stage Sync to prevent empty spaces
            const syncST = () => {
                ScrollTrigger.refresh();
            };
            
            window.addEventListener('load', syncST);
            const t1 = setTimeout(syncST, 500);
            const t2 = setTimeout(syncST, 1500); // High-res sync
            
            return () => {
                window.removeEventListener('load', syncST);
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="mc-section" ref={sectionRef}>
            <div className="mc-sidebar">
                <div className="mc-sidebar-inner">
                    <span className="mc-badge">Media Recognition</span>
                    <TitleReveal text="Global Reach" className="mc-title text-c1" />
                    <p className="mc-subtitle">
                        SSVM's transformative impact documented by leading news platforms and 
                        educational journals across the globe.
                    </p>
                    
                    <div className="mc-counter">
                        <div className="mc-counter-display">
                            <span className="mc-count-now">{currentIndex.toString().padStart(2, '0')}</span>
                            <span className="mc-count-sep">/</span>
                            <span className="mc-count-total">{mediaOutlets.length.toString().padStart(2, '0')}</span>
                        </div>
                    </div>

                    <div className="mc-indicator">
                        <div className="mc-bar-track">
                            <div className="mc-bar-fill" style={{ width: `${(currentIndex / mediaOutlets.length) * 100}%` }}></div>
                        </div>
                        <span className="mc-indicator-text">Explore Gallery</span>
                    </div>
                </div>
            </div>

            <div className="mc-track">
                <div className="mc-content" ref={scrollContainerRef}>
                    <div className="mc-spacer-start"></div>
                    
                    {mediaOutlets.map((item) => (
                        <div key={item.id} className="mc-card">
                            <div className="mc-card-inner">
                                <div className="mc-logo-box">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="mc-logo-img"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <span className="mc-logo-fallback">{item.name}</span>
                                </div>
                                <div className="mc-info">
                                    <span className="mc-type">{item.type}</span>
                                    <h4 className="mc-name">{item.name}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="mc-spacer-end"></div>
                </div>
            </div>

            <div className="mc-bg-mesh">
                <div className="mc-mesh-glow"></div>
            </div>
        </section>
    );
};

export default MediaCoverage;
