import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function App() {

  const heroRef = useRef(null);
  const sectionsRef = useRef([]);

  sectionsRef.current = [];

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {

    // HERO animation
    gsap.from(heroRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // SECTIONS animation
    sectionsRef.current.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        duration: 1,
      });
    });

    ScrollTrigger.refresh();

  }, []);

  return (
    <div className="font-sans">

      {/* HERO */}
      <section
        ref={heroRef}
        className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Make an Impact</h1>
        <p className="text-lg mb-6">Build a better world together</p>

        <button className="px-6 py-3 bg-black text-white rounded-2xl hover:scale-105 transition">
          Get Started
        </button>
      </section>


      {/* SCROLL SECTIONS */}

      {[1, 2, 3].map((item, index) => (
        <section
          key={index}
          ref={addToRefs}
          className="h-screen flex items-center justify-center"
        >
          <div className="text-center max-w-xl">
            <h2 className="text-3xl font-semibold mb-4">
              Section {item}
            </h2>

            <p>
              This section animates on scroll just like the Champions4Good website.
            </p>
          </div>
        </section>
      ))}


      {/* PARALLAX */}

      <section className="h-screen relative overflow-hidden">

        <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee)] bg-cover bg-center bg-fixed"></div>

        <div className="relative z-10 flex items-center justify-center h-full text-white text-4xl font-bold">
          Parallax Effect
        </div>

      </section>

    </div>
  );
}