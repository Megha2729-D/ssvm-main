import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/letterAnimation.css";

gsap.registerPlugin(ScrollTrigger);

const LetterReveal = ({
    text,
    className = "",
    triggerRef,
    controlled = false, // 🔥 NEW
}) => {
    const textRef = useRef();

    useEffect(() => {
        if (controlled) return; // ❌ skip ScrollTrigger if parent controls

        const ctx = gsap.context(() => {
            const el = textRef.current;
            const letters = el.querySelectorAll(".letter");
            const total = letters.length;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef?.current || el,
                    start: "top 90%",
                    end: "top 40%",
                    scrub: true,
                },
            });

            letters.forEach((letter, i) => {
                const progress = i / total;

                tl.fromTo(
                    letter,
                    {
                        x: progress * 3,
                        skewX: 20,
                        opacity: 0,
                    },
                    {
                        x: 0,
                        skewX: 0,
                        opacity: 1,
                        ease: "none",
                        duration: 0.25,
                    },
                    i * 0.08
                );
            });
        }, textRef);

        return () => ctx.revert();
    }, [triggerRef, controlled]);

    return (
        <h2 ref={textRef} className={`${className}`}>
            {text.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="word" style={{ whiteSpace: "nowrap" }}>
                    {word.split("").map((char, charIndex) => (
                        <span key={charIndex} className="letter">
                            {char}
                        </span>
                    ))}
                    {wordIndex < text.split(" ").length - 1 && "\u00A0"}
                </span>
            ))}
        </h2>
    );
};

export default LetterReveal;