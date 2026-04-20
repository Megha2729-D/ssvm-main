import { useEffect, useRef } from "react";
import "../assets/css/cursor.css";

export default function CustomCursor() {
    const innerRef = useRef(null);
    const outerRef = useRef(null);

    useEffect(() => {
        const inner = innerRef.current;
        const outer = outerRef.current;

        if (!inner || !outer) return;

        // Hide on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) {
            inner.style.display = "none";
            outer.style.display = "none";
            return;
        }

        let cursorVisible = false;

        const mouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;

            outer.style.transform = `translate(${x}px, ${y}px)`;
            inner.style.transform = `translate(${x}px, ${y}px)`;

            if (!cursorVisible) {
                inner.classList.add("cursor-visible");
                outer.classList.add("cursor-visible");

                inner.classList.remove("cursor-hidden");
                outer.classList.remove("cursor-hidden");

                cursorVisible = true;
            }
        };

        const mouseLeave = () => {
            inner.classList.remove("cursor-visible");
            outer.classList.remove("cursor-visible");

            inner.classList.add("cursor-hidden");
            outer.classList.add("cursor-hidden");

            cursorVisible = false;
        };

        const mouseEnter = () => {
            inner.classList.add("cursor-visible");
            outer.classList.add("cursor-visible");

            inner.classList.remove("cursor-hidden");
            outer.classList.remove("cursor-hidden");

            cursorVisible = true;
        };

        const addHover = () => {
            inner.classList.add("cursor-hover");
            outer.classList.add("cursor-hover");
        };

        const removeHover = () => {
            inner.classList.remove("cursor-hover");
            outer.classList.remove("cursor-hover");
        };

        const links = document.querySelectorAll(
            "a, button, .cursor-pointer"
        );

        links.forEach((el) => {
            el.addEventListener("mouseenter", addHover);
            el.addEventListener("mouseleave", removeHover);
        });

        window.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseleave", mouseLeave);
        document.addEventListener("mouseenter", mouseEnter);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseleave", mouseLeave);
            document.removeEventListener("mouseenter", mouseEnter);

            links.forEach((el) => {
                el.removeEventListener("mouseenter", addHover);
                el.removeEventListener("mouseleave", removeHover);
            });
        };
    }, []);

    return (
        <>
            <div className="mouse-cursor cursor-inner" ref={innerRef}></div>
            <div className="mouse-cursor cursor-outer" ref={outerRef}></div>
        </>
    );
}