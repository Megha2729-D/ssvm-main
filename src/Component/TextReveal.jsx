import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

const TextReveal = ({ text, className = "" }) => {
    const textRef = useRef(null);

    useLayoutEffect(() => {
        const element = textRef.current;

        const split = new SplitType(element, { types: "chars" });

        const chars = split.chars;

        gsap.set(chars, {
            opacity: 0,
            x: 120,
            rotation: 10,
            willChange: "transform"
        });

        requestAnimationFrame(() => {
            gsap.to(chars, {
                opacity: 1,
                x: 0,
                rotation: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.07,
                force3D: true
            });
        });

        return () => {
            split.revert();
        };
    }, []);

    return (
        <h1 ref={textRef} className={className}>
            {text}
        </h1>
    );
};

export default TextReveal;