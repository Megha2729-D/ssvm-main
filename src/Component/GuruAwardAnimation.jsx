import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "../assets/css/GuruAwardAnimation.css";

gsap.registerPlugin(ScrollTrigger);

const GuruAwardAnimation = () => {
    const guruSectionRef = useRef(null);
    const guruCircleRef = useRef(null);
    const guruContentRef = useRef(null);

    useEffect(() => {

        // ✅ Initial states
        gsap.set(guruCircleRef.current, {
            scale: 0.2,
            transformOrigin: "center center",
        });

        gsap.set(guruContentRef.current, {
            scale: 0.8,
            opacity: 0,
            transformOrigin: "center center",
        });

        // 🎬 Timeline
        const tl = gsap.timeline({ paused: true });

        // 🟡 Circle zoom (full scroll)
        tl.to(guruCircleRef.current, {
            scale: 1,
            ease: "power2.out",
            duration: 1,
        });

        // ✨ Content reveal (near end)
        tl.to(
            guruContentRef.current,
            {
                scale: 1,
                opacity: 1,
                ease: "power2.out",
                duration: 0.4,
            },
            0.85 // show at 85% scroll
        );

        // 📜 ScrollTrigger
        const st = ScrollTrigger.create({
            trigger: guruSectionRef.current,
            start: "top top",        // start when section hits top
            end: "bottom bottom",    // end when section finishes
            scrub: true,
            invalidateOnRefresh: true,

            onUpdate: (self) => {
                tl.progress(self.progress);
            }
        });

        return () => {
            st.kill();
            tl.kill();
        };

    }, []);

    return (
        <section className="guru-section" ref={guruSectionRef}>
            <div className="circle-wrapper">
                <div className="circle" ref={guruCircleRef}></div>
            </div>

            <div className="guru-content" ref={guruContentRef}>
                <h2>Inspirational Guru Awards</h2>

                <p>
                    While students are the future, educators are the force shaping that future.
                </p>

                <p>
                    The Inspirational Guru Awards honour educators who go beyond teaching subjects—
                    and instead shape mindsets, character, and confidence.
                </p>

                <ul>
                    <li>Inspire action, not just understanding</li>
                    <li>Build resilience, not just knowledge</li>
                    <li>Influence lives far beyond classrooms</li>
                </ul>
            </div>
        </section>
    );
};

export default GuruAwardAnimation;