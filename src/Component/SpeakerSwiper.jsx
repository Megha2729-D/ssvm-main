import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../assets/css/speakerSwiper.css";
import TitleReveal from "./TitleReveal";

import "swiper/css";
import "swiper/css/effect-coverflow";

gsap.registerPlugin(ScrollTrigger);

const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/";

export default function SpeakerSwiper() {
    const sectionRef = useRef();

    const speaker = [
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` },
        { img: `${BASE_IMAGE_URL}speakers.jpeg` }
    ];
    useEffect(() => {
        const ctx = gsap.context(() => {

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 80%",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;

                    const lines = sectionRef.current.querySelectorAll(".main_heading_about");

                    if (progress > 0.23 && progress < 0.9) {

                        // ✅ FIXED RANGE
                        const localProgress = (progress - 0.23) / (0.9 - 0.23);

                        lines.forEach((line, lineIndex) => {
                            const letters = line.querySelectorAll(".letter");

                            letters.forEach((letter, i) => {
                                const delay = (lineIndex * 0.2) + (i * 0.04);
                                const p = Math.min(Math.max(localProgress - delay, 0), 1);

                                gsap.set(letter, {
                                    x: (1 - p) * 40,     // 🔥 stronger effect
                                    skewX: (1 - p) * 10,
                                    opacity: p,
                                });
                            });
                        });
                    }
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="section_container speaker_swiper py-5" id="speakers">

            {/* TEXT */}
            <div className="row justify-content-center">
                <div className="col-lg-5">
                    <div className="speaker_description_main text-center text-white">

                        <span className="section-sub-title text-uppercase small fw-bold">
                            <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                            Voices of Innovation
                        </span>

                        {/* 🔥 IMPORTANT: Only use for splitting, NOT animation */}
                        <div data-aos="fade-up">
                            <TitleReveal
                                text="Speakers"
                                className="main_heading_about text-c1"
                            />
                            <p>
                                The SSVM Transforming India Conclave 2026 is a premier gathering of visionary leaders,
                                industry trailblazers, and social entrepreneurs.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* SWIPER */}
            <Swiper
                modules={[EffectCoverflow, Autoplay]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                loop={true}
                spaceBetween={50}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 3,
                    slideShadows: true
                }}
                className="speakerSwiper"
            >
                {speaker.map((item, index) => (
                    <SwiperSlide key={index} className="speaker-slide">
                        <img src={item.img} alt="speaker" />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
}