import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import "../assets/css/archer.css";

import FencingAnim from "../assets/json/69ad2f7fa0d8a42f48e7cb33_fencing.json";

const FencingScrollAnimation = () => {

    const lottieContainer = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {

        animationRef.current = lottie.loadAnimation({
            container: lottieContainer.current,
            renderer: "svg",
            loop: true,          // keep repeating
            autoplay: true,      // start automatically
            animationData: FencingAnim,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet"
            }
        });

        return () => {
            if (animationRef.current) {
                animationRef.current.destroy();
            }
        };

    }, []);

    return (
        <section>
            <div className="fencing-section">
                <div ref={lottieContainer} className="lottie-container"></div>
            </div>
        </section>
    );
};

export default FencingScrollAnimation;