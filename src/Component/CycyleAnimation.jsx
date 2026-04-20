import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/cycle.css";
import bikeAnimation from "../assets/json/69ad30372873beed539c57eb_bike.json";

gsap.registerPlugin(ScrollTrigger);

const CycleAnimation = () => {
    const sectionRef = useRef(null);
    const lottieRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        let animation;

        const safeRefresh = () => {
            document.body.getBoundingClientRect(); // Force layout check
            ScrollTrigger.refresh();
        };

        animation = lottie.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: bikeAnimation,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
            },
        });

        const ro = new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
                safeRefresh();
            });
        });
        if (sectionRef.current) ro.observe(sectionRef.current);

        const onLoaded = () => {
            // ✅ Sequence of refreshes to handle nested layout shifts
            safeRefresh();
            setTimeout(safeRefresh, 100);
            setTimeout(safeRefresh, 500);

            const totalFrames = animation.totalFrames;
            const playhead = { frame: 0 };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=1800",
                    scrub: true,
                    pin: true,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                },
            });

            gsap.set(lottieRef.current, {
                x: "-40vw",
                opacity: 1,
            });

            tl.to(lottieRef.current, {
                x: "120vw",
                ease: "none",
            }, 0);

            tl.to(
                playhead,
                {
                    frame: totalFrames - 1,
                    ease: "none",
                    onUpdate: () => {
                        animation.goToAndStop(Math.round(playhead.frame), true);
                    },
                },
                0
            );

            gsap.set(contentRef.current, {
                x: "-100vw",
                opacity: 1,
            });

            tl.to(
                contentRef.current,
                {
                    x: "0vw",
                    ease: "power3.out",
                },
                0.6
            );
        };

        animation.addEventListener("DOMLoaded", onLoaded);

        return () => {
            animation?.destroy();
            ro.disconnect();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="cycle-section">
            <div className="cycle-wrapper">

                {/* 🚴 Lottie */}
                <div ref={lottieRef} className="cycle-lottie" />

                {/* 📦 Content */}
                <div ref={contentRef} className="cycle-content">
                    <h2>SSVM Conclave</h2>
                    <p>
                        The SSVM Transforming India Conclave is a platform where ideas meet action.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default CycleAnimation;