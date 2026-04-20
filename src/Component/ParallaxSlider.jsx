import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Controller, Mousewheel } from "swiper/modules";
import TextReveal from "./TextReveal";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/mousewheel";
import "../assets/css/parallaxSwiper.css";

gsap.registerPlugin(ScrollTrigger);

const images = [
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-1.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-2.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-3.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-4.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-5.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-6.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-7.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-8.webp",
    "https://ssvmtransformationindia.s3.ap-south-1.amazonaws.com/images/speaker-9.webp",
];

export default function ParallaxSlider() {
    const sectionRef = useRef(null);

    const [mainSwiper, setMainSwiper] = useState(null);
    const [bgSwiper, setBgSwiper] = useState(null);
    const [opened, setOpened] = useState(null);
    const [hideDesc, setHideDesc] = useState(false);

    const handleClick = (index) => {
        setOpened(opened === index ? null : index);
    };

    // useEffect(() => {
    //     if (!mainSwiper) return;

    //     const totalSlides = images.length;

    //     const trigger = ScrollTrigger.create({
    //         trigger: sectionRef.current,
    //         start: "top top",
    //         end: `+=${totalSlides * 600}`,
    //         pin: true,
    //         scrub: true,

    //         onUpdate: (self) => {
    //             const progress = self.progress;
    //             const slideIndex = Math.round(progress * (totalSlides - 1));

    //             if (mainSwiper.activeIndex !== slideIndex) {
    //                 mainSwiper.slideTo(slideIndex);
    //             }

    //             setHideDesc(slideIndex > 0);
    //         }
    //     });

    //     return () => trigger.kill();
    // }, [mainSwiper]);

    return (
        <section ref={sectionRef} className="parallax_parent">

            {/* Description */}
            <div className={`description ${hideDesc ? "hidden" : ""}`}>
                <TextReveal text="Speakers" className="banner_text" />
                <p>
                    The SSVM Transforming India Conclave 2026 is a premier gathering of visionary leaders, industry trailblazers, and social entrepreneurs.
                </p>
            </div>

            {/* MAIN SLIDER */}
            <Swiper
                modules={[Parallax, Controller, Mousewheel]}
                onSwiper={setMainSwiper}
                controller={bgSwiper ? { control: bgSwiper } : undefined}
                centeredSlides
                parallax
                // mousewheel={{
                //     forceToAxis: false,
                //     sensitivity: 1.2,
                //     releaseOnEdges: true
                // }}
                speed={900}
                className="slider slider_main"
                breakpoints={{
                    0: { slidesPerView: 2.5, spaceBetween: 20 },
                    680: { slidesPerView: 3.5, spaceBetween: 60 }
                }}

                onSlideChange={(swiper) => {
                    if (swiper.activeIndex > 0) {
                        setHideDesc(true);   // hide description
                    } else {
                        setHideDesc(false);  // show description
                    }
                }}
            >
                {images.map((img, i) => (
                    <SwiperSlide
                        key={i}
                        className={`slider__item ${opened === i ? "opened" : ""}`}
                        onClick={() => handleClick(i)}
                    >
                        <img
                            className="slider__img"
                            data-swiper-parallax="20%"
                            src={img}
                            alt={`speaker-${i}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* BACKGROUND SLIDER */}
            {/* <Swiper
                modules={[Parallax, Controller]}
                onSwiper={setBgSwiper}
                controller={mainSwiper ? { control: mainSwiper } : undefined}
                centeredSlides
                slidesPerView={3.5}
                spaceBetween={60}
                allowTouchMove={false}
                parallax
                className="slider slider_bg"
            >
                {images.map((img, i) => (
                    <SwiperSlide key={i} className="slider__item">
                        <div
                            className="slider__img"
                            data-swiper-parallax="20%"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper> */}

        </section>
    );
}