import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import ScrollRevealText from "./ScrollRevealText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/archer.css";

import archerDesktop from "../assets/json/69ad2fc267eed7319abe0df2_archer_desktop.json";
import archerMobile from "../assets/json/69ad2fd7d569da6b4b7f5c46_archer_mobile.json";

const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"

gsap.registerPlugin(ScrollTrigger);

const ArcherScrollAnimation = () => {

    const lottieContainer = useRef(null);
    const sectionRef = useRef(null);
    const mainHeadingRef = useRef(null);
    const textRef = useRef(null);
    const animationRef = useRef(null);
    useEffect(() => {
        gsap.set(mainHeadingRef.current, {
            opacity: 1,
            y: 0
        });
    }, []);
    useEffect(() => {

        const isMobile = window.innerWidth < 768;
        const animationData = isMobile ? archerMobile : archerDesktop;

        animationRef.current = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: isMobile,
            autoplay: isMobile,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet"
            }
        });

        animationRef.current.addEventListener("DOMLoaded", () => {

            if (!isMobile) {

                const totalFrames = animationRef.current.totalFrames;

                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => "+=" + window.innerHeight * 2.5,
                    scrub: true,
                    pin: true,

                    onUpdate: (self) => {
                        const progress = self.progress;
                        const frame = totalFrames * progress;

                        // Lottie control
                        if (progress >= 1) {
                            animationRef.current.goToAndStop(totalFrames - 1, true);
                        } else {
                            animationRef.current.goToAndStop(frame, true);
                        }

                        // TEXT SHOW / HIDE (existing)
                        if (progress >= 0.4) {
                            gsap.to(textRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power3.out",
                                overwrite: true
                            });
                        } else {
                            gsap.to(textRef.current, {
                                opacity: 0,
                                y: 40,
                                duration: 0.4,
                                overwrite: true
                            });
                        }

                        // ⭐ NEW: MAIN HEADING FADE (0% → 10%)
                        if (progress >= 0.1) {
                            gsap.to(mainHeadingRef.current, {
                                opacity: 0,
                                display: "none",
                                y: -20,
                                duration: 0.4,
                                overwrite: true
                            });
                        } else {
                            gsap.to(mainHeadingRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.4,
                                overwrite: true
                            });
                        }
                    }
                });
            }

        });

        return () => {

            if (animationRef.current) {
                animationRef.current.destroy();
            }

            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        };

    }, []);

    return (
        <section className="archer-wrapper">
            <div ref={mainHeadingRef} className="archery_main_heading">
                <div className="archery_main_heading_inner">
                    <span className="section-sub-title text-uppercase small fw-bold">
                        <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                        Awards
                    </span>
                    <ScrollRevealText text="Recognising True Excellence" className="reveal_heading" />
                </div>
            </div>

            <div ref={sectionRef} className="archer-section">
                <div ref={lottieContainer} className="lottie-container"></div>
            </div>

            <div className="archery_anim_content">
                <div ref={textRef} className="archer-text">
                    <img src="./assets/images/ssvm-student-award.gif" alt="" />
                    <ScrollRevealText text="Studentpreneur Awards 2026" className="reveal_heading" />
                    <p>The Studentpreneur Awards is an initiative that encourages students to start thinking and acting like entrepreneurs early. It gives them a platform to showcase ideas they are actively working on and motivates them to take action instead of just thinking. The goal is to build confidence, real-world skills, and a mindset of creating and solving problems from a young age.</p>
                </div>
            </div>
        </section>
    );
};

export default ArcherScrollAnimation;