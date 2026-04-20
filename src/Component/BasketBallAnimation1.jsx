import React, { useEffect, useRef } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/runner.css";
import BasketLottie2 from "../assets/json/699c0d482468f78a4a5d7526_basketball_1.lottie";

gsap.registerPlugin(ScrollTrigger);

const BasketStickerAnimation1 = () => {
    const lottieRef = useRef(null);
    const wrapperRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {

        // Load lottie (no autoplay)
        playerRef.current = new DotLottie({
            autoplay: false,
            loop: true,
            canvas: lottieRef.current,
            src: BasketLottie2,
        });

        // Initial hidden state
        gsap.set(wrapperRef.current, {
            opacity: 0,
            y: 40,
            scale: 0.8
        });

        // Scroll trigger
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

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };

    }, []);

    return (
        <span ref={wrapperRef} className="runner-inline">
            <canvas ref={lottieRef}></canvas>
        </span>
    );
};

export default BasketStickerAnimation1;