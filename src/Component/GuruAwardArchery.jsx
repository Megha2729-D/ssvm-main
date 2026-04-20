import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import gsap from "gsap";
import TitleReveal from "./TitleReveal";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/archer.css";
import "../assets/css/GuruAwardArchery.css";

import archerDesktop from "../assets/json/69ad2fc267eed7319abe0df2_archer_desktop.json";
import archerMobile from "../assets/json/69ad2fd7d569da6b4b7f5c46_archer_mobile.json";

const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"

gsap.registerPlugin(ScrollTrigger);

const GuruAwardArchery = () => {

    const lottieContainer = useRef(null);
    const sectionRef = useRef(null);
    const mainHeadingRef = useRef(null);
    const textRef = useRef(null);
    const animationRef = useRef(null);
    const navigate = useNavigate();

    const handleAwardSelect = (category, type = '') => {
        const typeParam = type ? `&type=${type}` : '';
        navigate(`/register?category=${category}${typeParam}`);
    };


    useEffect(() => {
        gsap.set(mainHeadingRef.current, {
            opacity: 1,
            y: 0
        });
    }, []);
    useEffect(() => {
        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    useEffect(() => {

        const isMobile = window.innerWidth < 1025;
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
            ScrollTrigger.refresh();
            if (!isMobile) {

                const totalFrames = animationRef.current.totalFrames;

                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => "+=" + window.innerHeight * 2.5,
                    scrub: true,
                    pin: true,
                    pinType: "fixed", // ✅ force real fixed
                    anticipatePin: 1,

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

            return () => {
                if (animationRef.current) animationRef.current.destroy();
            };

        };

    }, []);

    return (
        <section ref={sectionRef} className="guru_award_archery archer-wrapper" id="awards">
            <div ref={mainHeadingRef} className="archery_main_heading">
                <span className="section-sub-title text-uppercase fw-bold">
                    <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                    Awards
                </span>
                <TitleReveal text="Honoring Authentic Excellence" className="reveal_heading text-c1 mt-2" />
            </div>
            <div className="w-100">
                <div className="archer-section">
                    <div ref={lottieContainer} className="lottie-container"></div>
                </div>

                <div className="archery_anim_content">
                    <div ref={textRef} className="archer-text">
                        <img src={`${BASE_IMAGE_URL}ssvm-guru-award.gif`} alt="" />
                        <div data-aos="fade-up">
                            <TitleReveal text="Inspirational Guru Awards 2026" className="reveal_heading text-c1" />
                            <p>
                                While students are the future, educators are the force shaping that future.
                                The Inspirational Guru Awards honour educators who go beyond teaching subjects—and instead shape mindsets, character, and confidence.
                            </p>
                            <div className="col-lg-12 guru_award_parent">
                                <div className="d-flex flex-lg-row flex-column justify-content-between w-100">
                                    <div className="d-flex flex-column align-items-center justify-content-center mt-lg-0 mt-2 ">
                                        <button onClick={() => handleAwardSelect('guru', 'internal')} className="btn-primary">
                                            <span>Register – Internal</span>
                                        </button>
                                        <small className="mt-3 px-2 text-white text-center small">Internal Category – Open to students from SSVM Institutions</small>
                                    </div>
                                    <div onClick={() => handleAwardSelect('guru', 'external')} className="mt-lg-0 mt-4 d-flex flex-column align-items-center justify-content-center">
                                        <button className="btn-ghost">
                                            <span>Register – External</span>
                                        </button>
                                        <small className="mt-3 px-2 text-white text-center small">External Category – Open to students from other schools and institutions</small>
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

export default GuruAwardArchery;