import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollRevealText = ({ text, className }) => {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const letters = textRef.current.querySelectorAll(".letter");
    const totalLetters = letters.length;

    // Hide all letters initially
    gsap.set(letters, { opacity: 0, y: 40, rotation: 6 });

    // ScrollTrigger: tie a timeline to scroll progress of this section only
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",      // start when section enters viewport
        end: "bottom top",     // end when section leaves viewport
        scrub: 0.5,            // smooth scroll-based animation
      },
    });

    // Animate letters one by one
    tl.to(
      letters,
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        stagger: 0.05,
        ease: "power2.out",
      },
      0 // start at the beginning of the timeline
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <h2 ref={textRef} className={className}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="word"
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word.split("").map((letter, j) => (
            <span
              key={j}
              className="letter"
              style={{ display: "inline-block" }}
            >
              {letter}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
};

export default ScrollRevealText;