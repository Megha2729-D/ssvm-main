import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import ScrollRevealText from "./ScrollRevealText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/archer.css";

import archerDesktop from "../assets/json/69ad2fc267eed7319abe0df2_archer_desktop.json";
import archerMobile from "../assets/json/69ad2fd7d569da6b4b7f5c46_archer_mobile.json";

gsap.registerPlugin(ScrollTrigger);

const ArcherScrollAnimation = () => {

    const lottieContainer = useRef(null);
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const animationRef = useRef(null);

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
                    end: "+=2500",
                    scrub: true,
                    pin: true,

                    onUpdate: (self) => {

                        const progress = self.progress;
                        const frame = totalFrames * progress;

                        // keep last frame if at 100%
                        if (progress >= 1) {
                            animationRef.current.goToAndStop(totalFrames - 1, true);
                        } else {
                            animationRef.current.goToAndStop(frame, true);
                        }

                        // TEXT SHOW / HIDE
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
        <section ref={sectionRef} className="archer-wrapper position-relative">

            <div className="archer-section">
                <div ref={lottieContainer} className="lottie-container"></div>
            </div>

            <div className="archery_anim_content">
                <div ref={textRef} className="archer-text">
                    <img src="https://ssvmtransformingindia.com/assets/images/ssvm-award-1.gif" alt="" />
                    <ScrollRevealText text="Focus. Aim. Achieve." className="reveal_heading" />
                    <p>The journey begins with a single shot.</p>
                </div>
            </div>
        </section>
    );
};

export default ArcherScrollAnimation;