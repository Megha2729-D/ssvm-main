import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LetterReveal from "./LetterReveal";

import "../assets/css/volleyball.css";
import volleyballData from "../assets/json/699cbf57a3baf554905772e8_volleyball_mobile_view.json";

gsap.registerPlugin(ScrollTrigger);

const MobileBallAnimation = () => {
    const lottieContainer = useRef(null);
    const containerRef = useRef(null);
    const pinRef = useRef(null);
    const ballRef = useRef(null);
    const contentRef = useRef(null);
    const bgRevealRef = useRef(null);
    const hintRef = useRef(null);

    useEffect(() => {
        // Initialize Lottie
        const anim = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: volleyballData,
        });

        anim.addEventListener("DOMLoaded", () => {
            const totalFrames = anim.totalFrames;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=650%",
                    pin: pinRef.current,
                    scrub: 2,
                    anticipatePin: 1,
                }
            });

            // 1. Initial State: Hint
            tl.to(hintRef.current, { opacity: 0, y: -20, duration: 0.1 });

            // 2. Ball Throw
            tl.to(ballRef.current, {
                y: -window.innerHeight,
                scale: 0.05,
                opacity: 0,
                duration: 1.5,
                ease: "power2.in"
            }, "start");

            // 3. Circle Reveal
            tl.fromTo(bgRevealRef.current, 
                { clipPath: "circle(0% at 50% 50%)", backgroundColor: "#F2FF33" },
                { 
                    clipPath: "circle(150% at 50% 50%)", 
                    backgroundColor: "#F2FF33", 
                    duration: 1.8, 
                    ease: "power1.inOut" 
                }, 
                "start+=0.2"
            );

            // 4. Volleyball Scrub
            tl.to({}, {
                duration: totalFrames,
                onUpdate: function() {
                    const frame = Math.round(this.progress() * (totalFrames - 1));
                    anim.goToAndStop(frame, true);
                }
            }, "start+=0.5");

            // 5. Details Reveal: Text Headings first
            tl.to(contentRef.current, { opacity: 1, visibility: 'visible', duration: 0.1 }, "start+=1.5");

            // Staggered reveals for the text headings (Faster for clarity)
            tl.fromTo(".text-reveal-item", 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: "power2.out" },
                "start+=1.7"
            );

            // Sync letters for all LetterReveal components in the headings
            const letters = document.querySelectorAll(".text-reveal-item .letter");
            tl.fromTo(letters,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.02 },
                "start+=2.0"
            );

            // 6. Next Scroll: Founder Card Reveal (Image and Set) - Sooner and smoother
            // Shift headings up slightly to make room for the card
            tl.to(".main-brand-stack", { y: -20, scale: 0.95, duration: 1, ease: "power2.inOut" }, "start+=3.2");
            
            tl.fromTo(".founder-reveal-item", 
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" },
                "start+=3.2"
            );

        });

        return () => {
            anim.destroy();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="mobile-discover-v12 d-block d-md-none overflow-hidden" style={{ background: "#FFFFFF", height: "100vh", position: 'relative', zIndex: 100 }}>
            <div ref={pinRef} className="w-100 h-100 position-relative" style={{ background: '#fff' }}>
                
                {/* Transition Layer */}
                <div ref={bgRevealRef} className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1, clipPath: "circle(0% at 50% 50%)" }}></div>

                {/* Discover Stage */}
                <div className="discovery-stage position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 5 }}>
                    <div ref={ballRef} className="minimal-ball-v12"></div>
                </div>

                {/* Clean Content Stack */}
                <div className="content-stack-v12 position-absolute top-0 start-0 w-100 h-100 d-flex flex-column" style={{ zIndex: 2 }}>
                    
                {/* Content Stage: Clean & Modern */}
                <div className="scroll-content-container position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 10 }}>
                    
                    {/* Top: Scrub Animation - Overlapping allowed */}
                    <div className="scrub-visual-area w-100 d-flex align-items-center justify-content-center" style={{ height: "10vh", marginTop: '0px' }}>
                        <div ref={lottieContainer} style={{ width: "100%", transform: "translateY(20px)" }}></div>
                    </div>

                    {/* Middle: Details Stack - Centered for better mobile visibility */}
                    <div ref={contentRef} className="info-box-v12 w-100 px-3 d-flex flex-column align-items-center justify-content-center flex-grow-1" style={{ opacity: 0, visibility: 'hidden', marginTop: '2vh', paddingBottom: '10vh' }}>
                        <div className="text-reveal-item mb-3 text-center px-1">
                            <div className="main-brand-stack" style={{ letterSpacing: '0.5px' }}>
                                <LetterReveal text="Ssvm Transforming" className="h5 fw-black text-dark d-block lh-tight" style={{ fontSize: '1.25rem' }} controlled={true} />
                                <LetterReveal text="India Conclave" className="h5 fw-black text-dark d-block lh-tight" style={{ fontSize: '1.25rem' }} controlled={true} />
                                <LetterReveal text="2026" className="h5 fw-black text-dark d-block lh-tight" style={{ fontSize: '1.25rem' }} controlled={true} />
                            </div>
                        </div>

                        {/* Founder Card - Reveals on next scroll part */}
                        <div className="founder-reveal-item w-100 px-1 text-center">
                            <div className="founder-card-v12 p-3 bg-white rounded-4 shadow-2xl border border-light-subtle position-relative overflow-hidden">
                                <img src="/assets/images/ssvm-founder-anim.gif" className="mb-3 rounded-3" style={{ width: "180px", height: "auto", maxWidth: '100%', objectFit: "contain" }} alt="Founder" />
                                <h3 className="h4 fw-black text-dark mb-1">Dr. Manimekalai Mohan</h3>
                                <p className="small text-muted mb-0" style={{ fontSize: '11px' }}>Founder, SSVM Institutions</p>
                            </div>
                        </div>

                    </div>
                </div>

                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .fw-bold { font-weight: 700; }
                .tracking-tighter { letter-spacing: 2px; }
                
                .mobile-discover-v12 {
                    position: relative;
                    z-index: 9999 !important;
                    background: #fff;
                }

                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
                .founder-card-v12 { max-width: 280px; margin: 0 auto; }

                .minimal-ball-v12 {
                    width: 75px;
                    height: 75px;
                    background: #F2FF33;
                    border-radius: 50%;
                    box-shadow: 0 15px 35px rgba(242,255,51,0.3);
                    animation: floatBalV12 3s infinite ease-in-out;
                }

                @keyframes floatBalV12 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }

                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .lh-tight { line-height: 1.1; }
            `}</style>
        </div>
    );
};

export default MobileBallAnimation;