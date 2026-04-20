import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/runner.css";
import TugAnimation from "../assets/json/thug.json";

gsap.registerPlugin(ScrollTrigger);

const TugAnimationSticker = () => {
    const lottieRef = useRef(null);
    const wrapperRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        const safeRefresh = () => {
            document.body.getBoundingClientRect(); 
            ScrollTrigger.refresh();
        };

        // Load Lottie
        playerRef.current = lottie.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: false,
            animationData: TugAnimation
        });

        const ro = new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
                safeRefresh();
            });
        });
        if (wrapperRef.current) ro.observe(wrapperRef.current);

        // Initial hidden state
        gsap.set(wrapperRef.current, {
            opacity: 0,
            y: 40,
            scale: 0.8
        });

        // Scroll Trigger
        const st = ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "top 60%",
            invalidateOnRefresh: true,

            onEnter: () => {
                gsap.to(wrapperRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out"
                });

                playerRef.current?.play();
            },

            onLeaveBack: () => {
                gsap.to(wrapperRef.current, {
                    opacity: 0,
                    y: 40,
                    scale: 0.8,
                    duration: 0.4
                });

                playerRef.current?.pause();
            }
        });

        // ✅ Multi-stage refresh when SVG is ready
        playerRef.current.addEventListener("DOMLoaded", () => {
            safeRefresh();
            setTimeout(safeRefresh, 200);
            setTimeout(safeRefresh, 1000);
        });


        return () => {
            playerRef.current?.destroy();
            ro.disconnect();
            st.kill();
        };

    }, []);

    return (
        <span ref={wrapperRef} className="runner-inline">
            <div ref={lottieRef}></div>
        </span>
    );
};

export default TugAnimationSticker;