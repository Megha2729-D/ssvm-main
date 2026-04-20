import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TitleReveal from "./TitleReveal";

import horseAnimation from "../assets/json/69b860a75dc06d6daafcd1ba_horse.json";
import "../assets/css/horse.css";

const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/";

gsap.registerPlugin(ScrollTrigger);

const HorseAnimation = () => {
    const lottieRef = useRef(null);
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const shapeRef = useRef(null);

    useEffect(() => {
        const handleResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        let animation;

        animation = lottie.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: horseAnimation,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
            },
        });

        const handleAnimation = () => {
            const totalFrames = animation.totalFrames;
            const playhead = { frame: 0 };

            // ✅ INITIAL STATES
            gsap.set(contentRef.current, {
                x: -1500,
                scale: 0,
                opacity: 0,
                transformOrigin: "center center",
            });

            gsap.set(shapeRef.current, {
                scale: 0.5,
                transformOrigin: "center center",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => "+=" + window.innerHeight * 1.6,
                    scrub: true,
                    pin: true,
                },
            });

            // 🎬 1. Lottie scroll sync
            tl.to(
                playhead,
                {
                    frame: totalFrames - 1,
                    ease: "none",
                    duration: 2,
                    onUpdate: () => {
                        animation.goToAndStop(Math.round(playhead.frame), true);
                    },
                },
                0
            );

            // 🟡 2. Shape zoom FIRST
            tl.to(
                shapeRef.current,
                {
                    scale: 1,
                    ease: "expo.out",
                    duration: 5,
                },
                0.2
            );

            // ✨ 3. Content reveal AFTER shape
            tl.to(
                contentRef.current,
                {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    ease: "expo.out",
                    duration: 6,
                },
                0.3
            );
        };

        animation.addEventListener("DOMLoaded", () => {
            handleAnimation();
            ScrollTrigger.refresh();
        });

        return () => {
            if (animation) animation.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="horse-section">
            <div className="horse-wrapper">

                {/* LOTTIE */}
                <div ref={lottieRef} className="horse-lottie"></div>

                {/* CONTENT */}
                <div ref={contentRef} className="horse-content-box mission-box">
                    <div className="h-100">
                        <div className="missin_inner_part h-100">

                            {/* SHAPE */}
                            <div ref={shapeRef} className="mission_shape"></div>

                            {/* TEXT */}
                            <div className="mission_inner_content">
                                <div className="section_container px-0 text-white d-flex justify-content-center align-items-center">
                                    <div className="row py-5 justify-content-center align-items-stretch">
                                        <div className="col-md-10 col-xl-9">
                                            <div className="about__content text-black">

                                                <span className="section-sub-title text-uppercase small fw-bold">
                                                    <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                                                    Transforming Minds. Shaping Futures.
                                                </span>

                                                <TitleReveal
                                                    text="SSVM Transforming India Conclave 2026"
                                                    className="reveal_heading"
                                                />

                                                <p className="fw-bold">
                                                    The SSVM Transforming India Conclave is not just an event—it’s a movement.
                                                </p>

                                                <p>
                                                    Over the past four years, the conclave has grown into a powerful platform where ideas meet action. Each year, under a new theme, it has brought together students, educators, entrepreneurs, and change-makers to engage in conversations that truly matter.
                                                </p>

                                                <div className="horse_second_sec">
                                                    <TitleReveal
                                                        text="Theme 2026 - Flex Your Future"
                                                        className="reveal_heading"
                                                    />

                                                    <p>
                                                        Flex Your Future shifts the focus to the foundation behind every form of success—health. It looks at the mind and body as one system, where mental resilience, emotional balance, nutrition, and physical strength work together.
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HorseAnimation;