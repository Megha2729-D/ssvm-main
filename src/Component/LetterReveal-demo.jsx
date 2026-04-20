// import React, { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import SplitType from "split-type";

// gsap.registerPlugin(ScrollTrigger);

// const LetterReveal = ({ text, className = "", isVisible = true, scrubProgress = null }) => {
//     const textRef = useRef(null);
//     const timeline = useRef(null);

//     useLayoutEffect(() => {
//         const element = textRef.current;
//         const split = new SplitType(element, { types: "chars" });
//         const chars = split.chars;

//         gsap.set(chars, {
//             opacity: 0,
//             x: 150,
//             willChange: "transform"
//         });

//         timeline.current = gsap.to(chars, {
//             opacity: 1,
//             x: 0,
//             duration: 1,
//             ease: "power2.out",
//             stagger: 0.1,
//             force3D: true,
//             paused: true
//         });

//         return () => {
//             split.revert();
//             if (timeline.current) timeline.current.kill();
//         };
//     }, []);

//     useLayoutEffect(() => {
//         if (scrubProgress !== null && timeline.current) {
//             timeline.current.progress(scrubProgress);
//         } else if (isVisible && timeline.current) {
//             timeline.current.play();
//         }
//     }, [isVisible, scrubProgress]);

//     return (
//         <h1 ref={textRef} className={className} style={{ perspective: "1000px", overflow: "hidden" }}>
//             {text}
//         </h1>
//     );
// };

// export default LetterReveal;