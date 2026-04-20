import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TitleReveal = ({
  text,
  className = "",
  style = {},
  triggerRef,
  scrub = true,
}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const letters = el.querySelectorAll(".letter");

    const ctx = gsap.context(() => {
      const total = letters.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef?.current || el,
          start: "top 90%",
          end: "top 40%",
          scrub: scrub,
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
    }, containerRef);

    return () => ctx.revert();
  }, [text, triggerRef, scrub]);

  return (
    <h2
      ref={containerRef}
      className={className}
      style={{
        ...style,
        display: "block",
        overflow: "hidden",
      }}
    >
      {text.split(" ").map((word, wIndex) => (
        <span
          key={wIndex}
          className="word"
          style={{
            display: "inline-block",
            whiteSpace: "nowrap", // ✅ prevents word breaking
            marginRight: "0.25em",
          }}
        >
          {word.split("").map((char, cIndex) => (
            <span
              key={cIndex}
              className="letter"
              style={{
                display: "inline-block",
                whiteSpace: "pre",
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
};

export default TitleReveal;