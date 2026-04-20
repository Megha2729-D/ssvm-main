import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TitleReveal from "./TitleReveal";

import "../assets/css/volleyball.css";
import runnerAnimation from "../assets/json/699cbf57a3baf554905772e8_volleyball_desktop.json";

import mamAnimation from "../assets/images/mam-animation.gif";
const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"

gsap.registerPlugin(ScrollTrigger);

const VolleyBallAnimation = () => {
    const lottieContainer = useRef(null);
    const sectionRef = useRef(null);
    const bottomTextRef = useRef(null);
    const middleTextRef = useRef(null);
    const centerTextRef = useRef(null);

    // AOS is initialized globally in Homepage.jsx
    // useEffect(() => {
    //     // Refresh ScrollTrigger when this component mounts to account for its height
    //     ScrollTrigger.refresh();
    // }, []);
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            gsap.set(bottomTextRef.current, { opacity: 1, y: 0 });
            gsap.set(middleTextRef.current, { opacity: 1, y: 0 });
            gsap.set(centerTextRef.current, { opacity: 1, y: 0 });
            return;
        }

        let animation;
        let bottomTween = null;
        let middleTween = null;
        let centerTween = null;
        let bottomHidden = false;
        let middleShown = false;
        let centerShown = false;

        // ✅ Robust Refresh Function
        // const safeRefresh = () => {
        //     document.body.getBoundingClientRect(); // Force layout
        //     ScrollTrigger.refresh();
        // };

        animation = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: runnerAnimation,
        });

        // ✅ Watch for container size changes (fixes collapse on slow loads)
        // const ro = new ResizeObserver(() => {
        //     window.requestAnimationFrame(() => {
        //         safeRefresh();
        //     });
        // });
        // if (sectionRef.current) ro.observe(sectionRef.current);

        animation.addEventListener("DOMLoaded", () => {
            // ✅ Double refresh to catch final layout
            // safeRefresh();
            // setTimeout(safeRefresh, 100);

            const totalFrames = animation.totalFrames;

            gsap.set(bottomTextRef.current, { opacity: 1, y: 0 });
            gsap.set(middleTextRef.current, { opacity: 0, y: 0 });
            gsap.set(centerTextRef.current, { opacity: 0, y: 60, scale: 0.1 });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: () => "+=" + window.innerHeight * 1.8,
                scrub: true,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,

                onUpdate: (self) => {
                    const progress = self.progress;
                    const slowFactor = 0.8;
                    const slowedProgress = Math.min(progress * slowFactor, 1);
                    const frame = Math.round(slowedProgress * (totalFrames - 1));

                    animation.goToAndStop(frame, true);

                    if (progress > 0.53 && !bottomHidden) {
                        bottomHidden = true;
                        if (bottomTween) bottomTween.kill();
                        bottomTween = gsap.to(bottomTextRef.current, {
                            opacity: 0,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                        });
                    }

                    if (progress <= 0.53 && bottomHidden) {
                        bottomHidden = false;
                        if (bottomTween) bottomTween.kill();
                        bottomTween = gsap.to(bottomTextRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                        });
                    }

                    if (progress > 0.75 && progress < 0.96 && !centerShown && !middleShown) {
                        middleShown = true;
                        if (middleTween) middleTween.kill();
                        middleTween = gsap.to(middleTextRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out",
                        });
                    }

                    if ((progress <= 0.75 || progress >= 0.96) && middleShown) {
                        middleShown = false;
                        if (middleTween) middleTween.kill();
                        middleTween = gsap.to(middleTextRef.current, {
                            opacity: 0,
                            y: 60,
                            duration: 0.6,
                            ease: "power2.out",
                        });
                    }

                    if (progress > 0.95 && !centerShown) {
                        centerShown = true;
                        if (centerTween) centerTween.kill();
                        centerTween = gsap.to(centerTextRef.current, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: "back.out(1.7)",
                        });
                    }

                    if (progress <= 0.95 && centerShown) {
                        centerShown = false;
                        if (centerTween) centerTween.kill();
                        centerTween = gsap.to(centerTextRef.current, {
                            opacity: 0,
                            y: 60,
                            scale: 0.1,
                            duration: 0.6,
                            ease: "power2.out",
                        });
                    }

                    if (progress >= 0.9) {
                        gsap.to(sectionRef.current, { backgroundColor: "#F2FF33", duration: 0.5 });
                    } else {
                        gsap.to(sectionRef.current, { backgroundColor: "", duration: 0.5 });
                    }
                },
                onLeave: () => {
                    animation.goToAndStop(totalFrames - 1, true);
                },
            });
        });

        return () => {
            animation?.destroy();
            // ro.disconnect();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="basket-section h-100" id="about">
            {window.innerWidth >= 1025 && (
                <div className="basket-wrapper">
                    <div ref={lottieContainer} className="basket-lottie"></div>
                </div>
            )}

            <div className="volleyball_anim_content">
                {/* Bottom Left Text */}
                <div ref={bottomTextRef} className="bottom-text me-lg-0 me-3">
                    <TitleReveal text="Shape Tomorrow Through Action" className="heading_about text-c1 small_sm_abt_heading" />
                </div>
                {/* <div ref={bottomTextRef} className="bottom-text me-lg-0 me-3">
                    <ScrollRevealText text="Transforming India Conclave 2026" className="reveal_heading main_heading_about" />
                    <ScrollRevealText text="FlEX YOUR FUTURE 2026" className="reveal_heading" />
                </div> */}
                {/* Middle Text */}
                <div ref={middleTextRef} className="middle-text" style={{ opacity: 0 }}>
                    <TitleReveal
                        text="Ssvm Transforming"
                        className="heading_about main_heading_about"
                    /><TitleReveal
                        text="India Conclave"
                        className="heading_about main_heading_about"
                    /><TitleReveal
                        text="2026"
                        className="heading_about main_heading_about"
                    />

                    {/* <ScrollRevealText text="Ssvm Transforming" className="reveal_heading" />
                    <ScrollRevealText text="India Conclave" className="reveal_heading" />
                    <ScrollRevealText text="2026" className="reveal_heading" /> */}
                </div>

                {/* Center Text */}
                <div ref={centerTextRef} className="center-text">
                    <div className="row justify-content-center">

                        <div className="col-lg-6">
                            <img src={mamAnimation} data-aos="zoom-in" data-aos-delay="100" className="w-100" alt="Dr. Manimekalai Mohan" />
                        </div>
                        <div className="left_fonder_content col-lg-12 d-flex flex-column align-items-center justify-content-center">
                            <div data-aos="fade-up">
                                <h2 className="main_heading_about">Dr. Manimekalai Mohan</h2>
                                <h2 className="main_heading_about">Founder, SSVM Institutions</h2>
                                {/* <LetterReveal
                                    text="Dr. Manimekalai Mohan"
                                    className="main_heading_about"
                                />
                                <LetterReveal
                                    text="Founder, SSVM Institutions"
                                    className="main_heading_about"
                                /> */}
                            </div>
                            {/* <ScrollRevealText text="Dr. Manimekalai Mohan" className="reveal_heading" />
                            <ScrollRevealText text="Founder, SSVM Institutions" className="reveal_heading" /> */}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default VolleyBallAnimation;