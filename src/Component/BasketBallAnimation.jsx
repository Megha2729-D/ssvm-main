import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/volleyball.css";
import runnerAnimation from "../assets/json/69ad2ff0c691c180dd09490c_lifter_01.json";

gsap.registerPlugin(ScrollTrigger);

const BasketBallAnimation = () => {
    const lottieContainer = useRef(null);
    const wrapperRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {

        // Load Lottie (no autoplay)
        animationRef.current = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: false,
            animationData: runnerAnimation,
        });

        // Initial hidden state
        gsap.set(wrapperRef.current, {
            opacity: 0,
            y: 40,
            scale: 0.8
        });

        // ScrollTrigger animation
        ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "top 60%",

            onEnter: () => {
                gsap.to(wrapperRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out"
                });

                animationRef.current?.play();
            },

            onLeaveBack: () => {
                gsap.to(wrapperRef.current, {
                    opacity: 0,
                    y: 40,
                    scale: 0.8,
                    duration: 0.4
                });

                animationRef.current?.pause();
            }
        });

        // ✅ Refresh ScrollTrigger when Lottie is loaded
        animationRef.current.addEventListener("DOMLoaded", () => {
            ScrollTrigger.refresh();
        });


        return () => {
            if (animationRef.current) {
                animationRef.current.destroy();
                animationRef.current = null;
            }
        };

    }, []);

    return (
        <span ref={wrapperRef} className="basket-wrapper">
            <span ref={lottieContainer} className="basket-lottie"></span>
        </span>
    );
};

export default BasketBallAnimation;