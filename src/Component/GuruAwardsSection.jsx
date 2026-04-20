import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TitleReveal from "./TitleReveal";

gsap.registerPlugin(ScrollTrigger);

const GuruAwardsSection = () => {
    const sectionRef = useRef(null);
    const isMobile = window.innerWidth < 768;

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Kinetic Background Text (Parallax)
            gsap.utils.toArray(".kinetic-bg-detail").forEach((text, i) => {
                gsap.to(text, {
                    scrollTrigger: {
                        trigger: text,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                    x: i % 2 === 0 ? -120 : 120,
                    opacity: 0.05,
                });
            });

            // 2. Trait Rows: Layered Parallax
            gsap.utils.toArray(".guru-kinetic-row").forEach((row, i) => {
                const icon = row.querySelector(".guru-icon-raw");
                const title = row.querySelector(".guru-title-raw");
                const desc = row.querySelector(".guru-desc-raw");

                gsap.from(icon, {
                    scrollTrigger: { trigger: row, start: "top 90%", end: "bottom 10%", scrub: 1 },
                    y: 100,
                    opacity: 0,
                    scale: 0.8,
                });

                gsap.from(title, {
                    scrollTrigger: { trigger: row, start: "top 85%", end: "bottom 20%", scrub: 1 },
                    y: 60,
                    opacity: 0,
                });

                gsap.from(desc, {
                    scrollTrigger: { trigger: row, start: "top 80%", end: "bottom 30%", scrub: 1 },
                    y: 40,
                    opacity: 0,
                });
            });

            // 3. Category Split Animation
            gsap.from(".guru-cat-vertical", {
                scrollTrigger: {
                    trigger: ".guru-categories-kinetic",
                    start: "top 95%",
                    end: "top 75%",
                    scrub: 1,
                },
                x: (i) => i === 0 ? -30 : 30,
                opacity: 0,
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    const traits = [
        { 
            bg: "COACH",
            title: "Strategic Coaching", 
            text: "Moving beyond teaching to coach real-world impact and student-led initiative.", 
            icon: "bi-activity" 
        },
        { 
            bg: "ENDURE",
            title: "Endurance Training", 
            text: "Preparing resilient mindsets for the long-distance challenges of the global future.", 
            icon: "bi-stopwatch" 
        },
        { 
            bg: "LEGACY",
            title: "Heritage Relay", 
            text: "Passing the baton of innovation to redefine every student's untapped potential.", 
            icon: "bi-chevron-double-right" 
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="guru_awards_section position-relative overflow-hidden"
            style={{
                backgroundColor: "transparent",
                padding: isMobile ? "60px 0" : "150px 0",
                zIndex: 1,
                width: "100%"
            }}
        >
            {/* INJECTED CSS TO PREVENT WORD BREAKS IN SPLIT-TYPE */}
            <style dangerouslySetInnerHTML={{ __html: `
                .title-frame .word {
                    display: inline-block !important;
                    white-space: nowrap !important;
                }
            `}} />

            <div className="container position-relative" style={{ zIndex: 10 }}>
                {/* Intro Header */}
                <div className="row mb-lg-5 mb-4 justify-content-center text-center">
                    <div className="col-lg-12">
                        <span className="text-uppercase small fw-bold mb-3 d-block" style={{ color: "#F2FF33", letterSpacing: "8px" }}>
                            Architects of Society
                        </span>
                        <div className="title-frame mx-auto d-flex flex-wrap justify-content-center" style={{ 
                            width: "100%",
                            maxWidth: "1000px", 
                            overflow: "visible",
                            textAlign: "center"
                        }}>
                            <TitleReveal 
                                text="Inspirational Guru Awards" 
                                className="fw-bold text-white mb-4"
                                style={{ 
                                    lineHeight: "1.2", 
                                    fontSize: "clamp(1.5rem, 5vw, 2.8rem)",
                                    textAlign: "center"
                                }}
                            />
                        </div>
                        <div className="mx-auto" style={{ width: "40px", height: "1.5px", background: "#F2FF33" }}></div>
                    </div>
                </div>

                <div className="guru-kinetic-wrapper mt-5">
                    {traits.map((item, index) => (
                        <div key={index} 
                            className="guru-kinetic-row row align-items-center mb-lg-5 mb-5 position-relative py-5"
                            style={{ cursor: "pointer", overflow: "visible" }}
                            onMouseEnter={(e) => {
                                const row = e.currentTarget;
                                row.querySelector(".guru-icon-raw").style.transform = "scale(1.1) rotate(5deg)";
                                row.querySelector(".guru-icon-raw").style.filter = "drop-shadow(0 0 30px rgba(242,255,51,0.5))";
                                row.querySelector(".guru-title-raw").style.color = "#F2FF33";
                                row.querySelector(".guru-desc-raw").style.color = "white";
                                if (row.querySelector(".kinetic-bg-detail")) row.querySelector(".kinetic-bg-detail").style.opacity = "0.15";
                            }}
                            onMouseLeave={(e) => {
                                const row = e.currentTarget;
                                row.querySelector(".guru-icon-raw").style.transform = "scale(1) rotate(0deg)";
                                row.querySelector(".guru-icon-raw").style.filter = "drop-shadow(0 0 15px rgba(242,255,51,0.2))";
                                row.querySelector(".guru-title-raw").style.color = "white";
                                row.querySelector(".guru-desc-raw").style.color = "rgba(255,255,255,0.5)";
                                if (row.querySelector(".kinetic-bg-detail")) row.querySelector(".kinetic-bg-detail").style.opacity = "0.05";
                            }}
                        >
                            {/* Huge Background Word - Now wrapped and nowrap */}
                            <div className="kinetic-bg-detail position-absolute w-100 text-center pointer-events-none" style={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: isMobile ? "24vw" : "18vw",
                                fontWeight: "1000",
                                WebkitTextStroke: "1px rgba(252, 255, 51, 0.05)",
                                color: "transparent",
                                zIndex: -1,
                                whiteSpace: "nowrap",
                                display: isMobile ? "none" : "block",
                                letterSpacing: "-0.05em"
                            }}>
                                {item.bg}
                            </div>

                            <div className={`col-lg-6 ${index % 2 === 0 ? "order-lg-1" : "order-lg-2 text-lg-end"}`} style={{ transition: "all 0.4s ease", zIndex: 10 }}>
                                <h2 className="guru-title-raw text-white mb-3 fw-bold" style={{ 
                                    fontSize: isMobile ? "1.75rem" : "2.25rem", 
                                    wordBreak: "keep-all",
                                    lineHeight: "1.2",
                                    transition: "all 0.4s ease" 
                                }}>
                                    {item.title}
                                </h2>
                                <p className="guru-desc-raw text-white-50 mb-0" style={{ 
                                    maxWidth: index % 2 === 0 ? "500px" : "none", 
                                    marginLeft: index % 2 === 0 ? "0" : "auto",
                                    fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)",
                                    transition: "all 0.4s ease"
                                }}>
                                    {item.text}
                                </p>
                            </div>
                            <div className={`col-lg-6 ${index % 2 === 0 ? "order-lg-2 text-lg-end" : "order-lg-1"} mb-lg-0 mb-4`}>
                                <div className="guru-icon-raw d-inline-flex" style={{ 
                                    color: "#F2FF33", 
                                    fontSize: isMobile ? "4rem" : "7rem",
                                    filter: "drop-shadow(0 0 15px rgba(242,255,51,0.2))",
                                    transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                }}>
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Categories Modern Vertical Split */}
                <div className="guru-categories-kinetic mt-lg-5 pt-lg-5 border-top" style={{ borderColor: "rgba(255,255,255,0.1)", zIndex: 10 }}>
                    <div className="row g-0 justify-content-center">
                        <div className="col-lg-12">
                            <div className="row align-items-stretch">
                                <div className="col-lg-5 guru-cat-vertical text-lg-start text-center mb-lg-0 mb-5 py-lg-4">
                                    <h6 className="text-uppercase small fw-bold mb-3" style={{ color: "#F2FF33", letterSpacing: "3px" }}>Phase 01</h6>
                                    <h3 className="text-white mb-2 fw-bold" style={{ wordBreak: "keep-all" }}>Internal Category</h3>
                                    <p className="text-white-50 small">Exclusively for educators within SSVM institutions.</p>
                                </div>
                                <div className="col-lg-2 d-none d-lg-flex justify-content-center align-items-center">
                                    <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.1)" }}></div>
                                </div>
                                <div className="col-lg-5 guru-cat-vertical text-lg-end text-center py-lg-4">
                                    <h6 className="text-uppercase small fw-bold mb-3" style={{ color: "white", opacity: 0.5, letterSpacing: "3px" }}>Phase 02</h6>
                                    <h3 className="text-white mb-2 fw-bold" style={{ wordBreak: "keep-all" }}>External Category</h3>
                                    <p className="text-white-50 small">Honoring global mentors from across the nation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuruAwardsSection;
