import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TitleReveal from "./TitleReveal";

import "../assets/css/mobileball.css";
import volleyballData from "../assets/json/699cbf57a3baf554905772e8_volleyball_desktop.json";

gsap.registerPlugin(ScrollTrigger);

const MobileBallAnimation = () => {
    const lottieContainer = useRef(null);
    const containerRef = useRef(null);
    const pinRef = useRef(null);
    const ballRef = useRef(null);
    const contentRef = useRef(null);
    const bgRevealRef = useRef(null);
    const arrowRef = useRef(null);

    useEffect(() => {
        const anim = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: volleyballData,
        });

        anim.addEventListener("DOMLoaded", () => {
            const totalFrames = anim.totalFrames;

            // =========================
            // 🔥 PRE-REVEAL (BEFORE PIN)
            // =========================
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top 60%",
                end: "top 0%",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;

                    // BG reveal - expands to fill corners and then removes mask
                    gsap.set(bgRevealRef.current, {
                        clipPath: progress >= 0.99 ? "none" : `circle(${progress * 150}% at 50% 50%)`
                    });

                    // Ball shrink
                    gsap.set(ballRef.current, {
                        scale: 1 - progress * 0.2
                    });

                    // 🔥 Arrow fade OUT EARLY
                    gsap.to(arrowRef.current, {
                        opacity: 1 - progress * 3,  // fades faster
                        scale: 1 - progress * 0.5,
                        duration: 0.1,
                        overwrite: true
                    });
                }
            });

            // =========================
            // 🎬 MAIN PINNED TIMELINE
            // =========================
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",     // starts ONLY at top
                    end: "+=80%",         // smoother scroll
                    pin: pinRef.current,
                    scrub: 1.2,
                    anticipatePin: 1,
                }
            });

            // =========================
            // 🟡 PHASE 1: BALL EXIT
            // =========================
            tl.to(ballRef.current, {
                y: -window.innerHeight,
                scale: 0.1,
                opacity: 0,
                ease: "power2.inOut",
                duration: 10,
            }, 0);

            // =========================
            // 🎬 PHASE 2: LOTTIE SCRUB
            // =========================
            tl.to({}, {
                duration: 100,
                onUpdate: function () {
                    const progress = this.progress();
                    const frame = progress * (totalFrames - 1);
                    anim.goToAndStop(frame, true);
                }
            }, 1);

            // =========================
            // ✨ PHASE 3: TEXT REVEAL
            // =========================
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top 40%",   // 👈 earlier than before
                end: "top 20%",
                onUpdate: (self) => {
                    if (self.progress > 0) {
                        gsap.to(contentRef.current, {
                            opacity: 1,
                            scale: 1,
                            visibility: "visible",
                            duration: 0.2
                        });
                    } else {
                        gsap.to(contentRef.current, {
                            opacity: 0,
                            scale: 0,
                            visibility: "hidden",
                            duration: 0.2
                        });
                    }
                }
            });
            // tl.to(contentRef.current, {
            //     opacity: 1,
            //     visibility: "visible",
            //     duration: 0.3
            // }, 5);

            // tl.fromTo(".text-reveal-item",
            //     { y: 40, opacity: 0 },
            //     { y: 0, opacity: 1, stagger: 0.3, duration: 0.6 },
            //    -0.5
            // );

            // const letters = document.querySelectorAll(".text-reveal-item .letter");
            // tl.fromTo(letters,
            //     { opacity: 0, y: 10 },
            //     { opacity: 1, y: 0, stagger: 0.03, duration: 0.4 },
            //     -0.5
            // );

            // =========================
            // 🧑‍💼 PHASE 4: SCALE EFFECT
            // =========================
            tl.to(".main-brand-stack", {
                scale: 0.95,
                duration: 0.6,
                ease: "power2.out"
            }, 1.4);

            // =========================
            // ⬇️ ARROW HIDE
            // =========================
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                onUpdate: (self) => {
                    if (self.progress > 0.01) {
                        gsap.to(arrowRef.current, {
                            opacity: 0,
                            scale: 0,
                            visibility: "hidden",
                            duration: 0.2
                        });
                    } else {
                        gsap.to(arrowRef.current, {
                            opacity: 1,
                            scale: 1,
                            visibility: "visible",
                            duration: 0.2
                        });
                    }
                }
            });
        });

        return () => {
            anim.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="mobile-discover-v12 overflow-hidden" id="about"
            style={{ height: "50vh", position: "relative", zIndex: 100 }}
        >
            <div ref={pinRef} className="w-100 h-100 position-relative">

                {/* BG REVEAL */}
                <div
                    ref={bgRevealRef}
                    className="position-absolute w-100 h-100"
                    style={{ clipPath: "circle(0% at 50% 50%)", background: "#F2FF33", zIndex: 1 }}
                />

                {/* BALL */}
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 5 }}>
                    <div ref={ballRef} className="minimal-ball-v12 d-flex justify-content-center align-items-center">
                        <i ref={arrowRef} className="bi bi-arrow-down text-dark fs-2 fw-bold jump-animation"></i>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 10 }}>

                    {/* LOTTIE */}
                    <div style={{ height: "12vh", width: "100%" }}>
                        <div ref={lottieContainer} />
                    </div>

                    {/* TEXT */}
                    <div
                        ref={contentRef}
                        style={{ opacity: 0, visibility: "hidden" }}
                        className="text-center px-3 mb-5"
                    >
                        <div className="text-reveal-item mb-3">
                            <div className="main-brand-stack d-flex flex-column align-items-center text-center">
                                <h2 text="Ssvm Transforming" className="fw-bold text-dark text-center" controlled >Ssvm Transforming </h2>
                                <h2 text="India Conclave" className="fw-bold text-dark text-center" controlled >India Conclave </h2>
                                <h2 text="2026" className="fw-bold text-dark text-center" controlled >2026 </h2>
                            </div>
                        </div>

                        {/* <div className="founder-reveal-item left_fonder_content ">
                            <img src="/assets/images/ssvm-founder-anim.gif" className="w-75" />
                            <h2 className="main_heading_about fw-bold mt-2 text-black">Dr. Manimekalai Mohan</h2>
                            <h2 className="main_heading_about text-black">Founder, SSVM Institutions</h2>
                        </div> */}
                    </div>

                </div>
            </div>

            <style>{`
                .minimal-ball-v12 {
                    width: 75px;
                    height: 75px;
                    background: #F2FF33;
                    border-radius: 50%;
                }
                .jump-animation {
                    display: inline-block;
                    animation: jump 1.5s infinite ease-in-out;
                }
                @keyframes jump {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(10px); }
                }
            `}</style>
        </div>
    );
};

export default MobileBallAnimation;