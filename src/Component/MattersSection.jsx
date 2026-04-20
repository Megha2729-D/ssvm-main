import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TitleReveal from "./TitleReveal";
import "../assets/css/matters.css"
const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"

gsap.registerPlugin(ScrollTrigger);

const MattersSection = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background parallax effect - Only on Desktop for performance

            // Staggered cards reveal
            gsap.from(".matter-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: isMobile ? "top 90%" : "top 80%",
                    toggleActions: "play none none none",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: isMobile ? 0.1 : 0.2,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    const values = [
        {
            title: "Expose",
            text: "Expose students to real-world thinking early",
            icon: "bi-lightbulb",
            color: "#F2FF33"
        },
        {
            title: "Encourage",
            text: "Encourage independent, bold decision-making",
            icon: "bi-rocket-takeoff",
            color: "#ffffff"
        },
        {
            title: "Bridge",
            text: "Bridge the gap between education and execution",
            icon: "bi-link-45deg",
            color: "#F2FF33"
        },
        {
            title: "Recognise",
            text: "Recognise effort, initiative, and progress",
            icon: "bi-trophy",
            color: "#ffffff"
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="matters_section position-relative overflow-hidden"
        >
            {/* Large Background Text for Aesthetic Depth - Desktop Only */}
            {!isMobile && (
                <div className="matters-bg-text position-absolute w-100 text-nowrap">
                    CONCLAVE
                </div>
            )}

            <div className="section_container position-relative" style={{ zIndex: 1 }}>
                <div className="row justify-content-center mb-lg-5 mb-0">
                    <div className="col-lg-10 text-center">
                        {/* <span className="section-sub-title text-uppercase fw-bold mb-3 d-block" style={{ color: "#F2FF33" }}>
                            <i className="bi bi-info-circle-fill me-2"></i> 
                        </span> */}
                        <span className="section-sub-title text-uppercase small fw-bold" style={{ color: "#FFF" }}>
                            <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                            Why It Matters
                        </span>
                        <TitleReveal
                            text="Why This Conclave"
                            className="heading_about text-c1 text-center d-block"
                            triggerRef={sectionRef}
                        />
                        <TitleReveal
                            text=" Matters"
                            className="heading_about text-c1 text-center d-block"
                            triggerRef={sectionRef}
                        />
                        <div data-aos="fade-up" data-aos-delay="200">
                            <p className="lead text-white-50 mx-auto px-lg-0 px-3" style={{
                                maxWidth: "700px",
                                lineHeight: "1.6"
                            }}>
                                Most platforms <span style={{ color: "white", fontWeight: "bold" }}>talk to students</span>. <br className="d-lg-block d-none" />
                                This one <span style={{ color: "#F2FF33", fontWeight: "bold" }}>builds with them</span>.
                            </p>
                        </div>
                    </div>
                </div>

                <div ref={containerRef} className="row g-lg-1 g-3 mt-lg-5 mt-2 justify-content-center">
                    {values.map((item, index) => (
                        <div key={index} className="col-lg-3 col-md-6 col-11 matter-card-col py-3 py-lg-0" data-aos="fade-up">
                            <div className="matter-card h-100" style={{
                                border: `1px solid ${index % 2 === 0 ? "rgba(242,255,51,0.2)" : "rgba(255,255,255,0.1)"}`,
                            }}>
                                <div className="card-content-wrapper">
                                    {/* Icon set at Top 0 for Premium Curve Alignment */}
                                    <div className="card-icon-wrapper" style={{
                                        backgroundColor: index % 2 === 0 ? "rgba(242,255,51,0.2)" : "rgba(255,255,255,0.12)",
                                        color: item.color,
                                        border: `1px solid ${item.color}55`,
                                    }}>
                                        <i className={`bi ${item.icon}`}></i>
                                    </div>

                                    {/* Centered Content with Optimized Mobile Constraints */}
                                    <div className="card-text-content">
                                        <TitleReveal
                                            text={item.title.toUpperCase()}
                                            className="card-title-reveal text-c1"
                                            style={{ color: item.color }}
                                            triggerRef={sectionRef}
                                        />
                                        <p className="card-description">{item.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-lg-5 mt-4 pt-lg-5 pt-4 justify-content-center">
                    <div className="col-lg-8 col-11 text-center" data-aos="zoom-in">
                        {/* <TitleReveal
                            text="Shape Tomorrow Through"
                            className="fw-bold"
                            style={{
                                fontSize: isMobile ? "1.5rem" : "2.5rem",
                                color: "#F2FF33",
                                letterSpacing: "2px"
                            }}
                            triggerRef={sectionRef}
                        />
                        <TitleReveal
                            text=" Action"
                            className="mb-4 fw-bold"
                            style={{
                                fontSize: isMobile ? "1.5rem" : "2.5rem",
                                color: "#F2FF33",
                                letterSpacing: "2px"
                            }}
                            triggerRef={sectionRef}
                        /> */}
                        <div className="p-lg-4 p-3 mt-4 rounded-4" style={{
                            borderLeft: "4px solid #F2FF33",
                            background: "rgba(242,255,51,0.05)",
                            textAlign: "center"
                        }}>
                            <p className="text-white mb-0">
                                If students are expected to shape the future, they need platforms that treat them like they already can.
                            </p>
                            {/* <TitleReveal
                                text="If students are expected to shape the future, they need platforms that treat them like they already can."
                                className="m-0 text-white italic"
                                style={{
                                    fontSize: isMobile ? "0.95rem" : "1.1rem",
                                    fontStyle: "italic",
                                    opacity: 0.9,
                                    lineHeight: "1.6",
                                    fontWeight: "normal"
                                }}
                                triggerRef={sectionRef}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative element */}
            <div className="position-absolute" style={{
                width: isMobile ? "150px" : "300px",
                height: isMobile ? "150px" : "300px",
                background: "radial-gradient(circle, rgba(242,255,51,0.1) 0%, rgba(242,255,51,0) 70%)",
                bottom: "-75px",
                right: "-25px",
                borderRadius: "50%",
                zIndex: 0
            }}></div>
        </section>
    );
};

export default MattersSection;
