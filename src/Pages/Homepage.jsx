import React, { useRef, useState, useEffect } from "react";
import TitleReveal from "../Component/TitleReveal";
import { Autoplay, FreeMode } from "swiper/modules";

import MattersSection from "../Component/MattersSection";

import VolleyBallAnimation from "../Component/VolleyBallAnimation";
import MobileBallAnimation from "../Component/MobileBallAnimation";

import HorseAnimation from "../Component/HorseAnimation";
import ArcherScrollAnimation from "../Component/ArcherScrollAnimation";
import GuruAward from "../Component/GuruAward";
import GuruAwardArchery from "../Component/GuruAwardArchery";
import SpeakerSwiper from "../Component/SpeakerSwiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"
const images = [
    // "https://ssvmtransformingindia.com/assets/images/banner/image-1.jpg",
    "https://ssvmtransformingindia.com/assets/images/banner/image-2.jpg",
    "https://ssvmtransformingindia.com/assets/images/banner/image-3.jpg",
    "https://ssvmtransformingindia.com/assets/images/banner/image-4.jpg",
    "https://ssvmtransformingindia.com/assets/images/banner/image-5.jpg",
];

const slides = [
    {
        id: 1,
        image: "./assets/images/media/Andhra-Jyothi.jpg",
    },
    {
        id: 2,
        image: "./assets/images/media/comail.png",
    },
    {
        id: 3,
        image: "./assets/images/media/Deepika-Emblem.png",
    },
    {
        id: 4,
        image: "./assets/images/media/dinakaran.png",
    },
    {
        id: 5,
        image: "./assets/images/media/dinamalar.png",
    },
    {
        id: 6,
        image: "./assets/images/media/dinamani-logo.webp",
    },
    {
        id: 7,
        image: "./assets/images/media/makkal.jpeg",
    },
    {
        id: 9,
        image: "./assets/images/media/Malai_Murasu.webp",
    },
    {
        id: 10,
        image: "./assets/images/media/malai-malar.webp",
    },
    {
        id: 11,
        image: "./assets/images/media/Malayalamanorama.png",
    },
    {
        id: 12,
        image: "./assets/images/media/Mathrubhumi_English.webp",
    },
    {
        id: 13,
        image: "./assets/images/media/Thanthi.png",
    },
    {
        id: 13,
        image: "./assets/images/media/The-Hindu-Logo.jpg",
    },
    {
        id: 14,
        image: "./assets/images/media/The-Hindu-Tamil.jpg",
    },
    {
        id: 15,
        image: "./assets/images/media/thinathanti.png",
    },
    {
        id: 16,
        image: "./assets/images/media/tm_logo.webp",
    },
    {
        id: 17,
        image: "./assets/images/media/TNIE.webp",
    },
    {
        id: 18,
        image: "./assets/images/media/ttof.png",
    },
];

const Homepage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [stackImages, setStackImages] = useState(images);
    const [animating, setAnimating] = useState(false);
    const [hoverImages, setHoverImages] = useState([]);
    const imageIndex = useRef(0);
    const lastPos = useRef({ x: 0, y: 0 });
    const mobileGalleryRef = useRef(null);
    const videoRef = useRef(null);
    const [index, setIndex] = useState(0);
    const iframeRef = useRef(null);
    const videos = [
        "6qpZGsod9dk",
        "d43oTWwyK_g",
        "lA-mD4EEG9Y",
    ];

    useEffect(() => {
        const handleMessage = (event) => {
            if (!event.data) return;

            // YouTube "ended" event
            try {
                const data =
                    typeof event.data === "string"
                        ? JSON.parse(event.data)
                        : event.data;

                if (data.event === "onStateChange" && data.info === 0) {
                    // video ended → next
                    setIndex((prev) => (prev + 1) % videos.length);
                }
            } catch (e) {
                console.clear();
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.clear();
                console.log("Autoplay blocked:", err);
            });
        }
    }, []);
    // Detect mobile
    useEffect(() => {
        if (window.innerWidth < 1025) setIsMobile(true);
    }, []);


    // Mobile card fly-in
    useEffect(() => {
        if (!isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const cards = mobileGalleryRef.current.querySelectorAll(".stack_card");
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add(index % 2 === 0 ? "fly-left" : "fly-right");
                            }, index * 150); // stagger 150ms
                        });

                        // Total delay = last card delay + animation duration
                        const totalDelay = (cards.length - 1) * 150 + 600; // ms

                        setTimeout(() => {
                            mobileGalleryRef.current.classList.add("active");
                        }, totalDelay);

                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (mobileGalleryRef.current) observer.observe(mobileGalleryRef.current);

        return () => observer.disconnect();
    }, [isMobile]);

    // Desktop hover images
    const handleMouseMove = (e) => {
        if (isMobile) return;

        const distance = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
        if (distance < 200) return;

        lastPos.current = { x: e.clientX, y: e.clientY };
        const newImage = { id: Date.now(), src: images[imageIndex.current % images.length], x: e.clientX, y: e.clientY };
        imageIndex.current++;
        setHoverImages((prev) => [...prev, newImage]);
        setTimeout(() => setHoverImages((prev) => prev.filter((img) => img.id !== newImage.id)), 1000);
    };

    // Mobile swipe logic
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
    const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);

    const handleTouchEnd = () => {
        const deltaX = touchEndX.current - touchStartX.current;
        if (Math.abs(deltaX) > 50) animateTopCard(deltaX < 0 ? "left" : "right");
    };

    const animateTopCard = (direction) => {
        if (animating) return;
        setAnimating(true);

        const topCard = document.querySelector(".stack_card.top");
        if (!topCard) return;

        // Apply swipe animation first
        topCard.classList.add(direction === "left" ? "swipe-left" : "swipe-right");

        // Wait for animation to finish before rotating stack
        setTimeout(() => {
            topCard.classList.remove("swipe-left", "swipe-right");

            // Rotate stack now
            setStackImages((prev) => {
                const arr = [...prev];
                const first = arr.shift();
                arr.push(first);
                return arr;
            });

            setAnimating(false);
        }, 400); // match animation duration
    };

    return (
        <>
            <section id="home">
                <div className="main_content">
                    <div className="top_section">
                        <div className="section_container ">
                            <div className="banner_content_parent">
                                <div className="row justify-content-center pb-4">
                                    <div className="col-lg-8">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-3 col-6 py-3">
                                                <img src={`${BASE_IMAGE_URL}thug-of-war.gif`} className="w-100" alt="" />
                                                {/* <FencingStickerAnimation /> */}
                                            </div>
                                        </div>
                                        <div className="banner_content">
                                            <div className="anim_heading_wrapper" onMouseMove={handleMouseMove}>
                                                {/* <img src="/assets/images/ring_theme.png" alt="Yellow Oval" className="yellow-oval" /> */}
                                                <div className="anim_heading">
                                                    <img src={`${BASE_IMAGE_URL}banner-anim-cont.gif`} className="w-100" alt="" />
                                                    {/* <TitleReveal text="Flex" className="banner_text" />
                                                <TitleReveal text=" Your" className="banner_text" />
                                                <TitleReveal text=" Future" className="banner_text" /> */}
                                                </div>
                                            </div>

                                            {isMobile && (
                                                <p>
                                                    SSVM brings together talent, innovation, and opportunities to help you build and flex your future.
                                                </p>
                                            )}
                                        </div>

                                        {isMobile && (
                                            <div
                                                className="mobile_gallery"
                                                ref={mobileGalleryRef}
                                                onTouchStart={handleTouchStart}
                                                onTouchMove={handleTouchMove}
                                                onTouchEnd={handleTouchEnd}
                                            >
                                                {stackImages.map((img, index) => {
                                                    let className = "stack_card";
                                                    const orderClass = ["top", "second", "third", "fourth"];
                                                    if (index < 4) className += ` ${orderClass[index]}`;
                                                    if (img.includes("image-1.jpg")) className += " one";
                                                    else if (img.includes("image-2.jpg")) className += " two";
                                                    else if (img.includes("image-3.jpg")) className += " three";
                                                    else if (img.includes("image-4.jpg")) className += " four";
                                                    return <img key={img} src={img} className={className} alt="SSVM Logo" />;
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isMobile && (
                    <div className="hover-images-container">
                        {hoverImages.map((img) => (
                            <img
                                key={img.id}
                                src={img.src}
                                alt=""
                                className="floating-img"
                                style={{ left: img.x + "px", top: img.y + "px", position: "fixed", pointerEvents: "none", zIndex: 9999 }}
                            />
                        ))}
                    </div>
                )}
            </section>
            <MobileBallAnimation />
            <VolleyBallAnimation />
            <section>
                <div className="marquee-strip">
                    <div className="marquee-inner">
                        <h2 className="event-strip">
                            <span>September</span>
                            <span className="lit">2026</span>
                            <span>Location: </span>
                            <span className="lit">SSVM World School, Coimbatore</span>
                            <span className="divider">|</span>

                            <span>September</span>
                            <span className="lit">2026</span>
                            <span>Location: </span>
                            <span className="lit">SSVM World School, Coimbatore</span>
                            <span className="divider">|</span>


                        </h2>
                    </div>
                </div>
            </section>
            <HorseAnimation />
            <div className="position-relative " id="speakers">
                <SpeakerSwiper />
            </div>
            <ArcherScrollAnimation />
            
            <GuruAwardArchery />

            {/* <div data-aos="zoom-in">
                <GuruAward />
            </div> */}
            {/* <section className="pt-5 features_section">
                <div className="features_content">
                    <div className="section_container">
                        <div className="features_header">
                            <span className="section-sub-title text-white text-uppercase small fw-bold">
                                <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                                Inside SSVM
                            </span>
                            <TitleReveal text="Areas of Inspiration" className="reveal_heading text-white" />
                        </div>
                        <div className="row mt-4">
                            <div className="col-lg-3 d-flex align-items-center justify-content-lg-start justify-content-center">
                                <div className="kid_play_img">
                                    <img src="./assets/images/anim-playing-kid.png" loading="lazy"
                                        style={{ opacity: "1" }} alt="" className="hero_bam-dunk bam-glitch glitching" />
                                </div>
                            </div>
                            <div className="col-lg-9 d-flex align-items-center mt-4 mt-lg-0">
                                <div>
                                    <div className="row column-gap-5">
                                        <div className="col-lg-3 col-6 d-flex flex-column justify-content-center align-items-center" data-aos="zoom-in">
                                            <img src="./assets/images/icon/sports.png" alt="" />
                                            <h6 className="text-center">Sports & Performance</h6>
                                        </div>
                                        <div className="col-lg-3 col-6 d-flex flex-column justify-content-center align-items-center" data-aos="zoom-in">
                                            <img src="./assets/images/icon/mental-wellness.png" alt="" />
                                            <h6 className="text-center">Mental Wellness</h6>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center column-gap-5 my-5">
                                        <div className="col-lg-3 col-6 d-flex flex-column justify-content-center align-items-center" data-aos="zoom-in">
                                            <img src="./assets/images/icon/nutrition-food.png" alt="" />
                                            <h6 className="text-center">Nutrition & Food</h6>
                                        </div>
                                        <div className="col-lg-3 col-6 d-flex flex-column justify-content-center align-items-center" data-aos="zoom-in">
                                            <img src="./assets/images/icon/wheelchair.png" alt="" />
                                            <h6 className="text-center">Accessibility & Inclusion</h6>
                                        </div>
                                        <div className="col-lg-3 col-6 d-flex flex-column justify-content-center align-items-center" data-aos="zoom-in">
                                            <img src="./assets/images/icon/responsible.png" alt="" />
                                            <h6 className="text-center">Services & Experiences</h6>
                                        </div>
                                    </div>
                                    <div className="row justify-content-end my-5 column-gap-5">
                                        <div className="col-lg-3 col-6 d-flex flex-column justify-content-center align-items-center" data-aos="zoom-in">
                                            <img src="./assets/images/icon/responsibility.png" alt="" />
                                            <h6 className="text-center">Social Enterprises</h6>
                                        </div>
                                        <div className="col-lg-3 col-6 d-flex flex-column justify-content-center align-items-center" data-aos="zoom-in">
                                            <img src="./assets/images/icon/psychology.png" alt="" />
                                            <h6 className="text-center">Behavioural & Habit Science</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* <CycleAnimation /> */}
            {/* <section className="pt-5 features_section">
                <div className="features_content">
                    <div className="section_container">
                        <div className="features_header">
                            <span className="section-sub-title text-uppercase small fw-bold">
                                <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                                Inside SSVM
                            </span>
                            <TitleReveal text="Inspirational Guru Awards 2026" className="reveal_heading" />
                            <p>
                                While students are the future, educators are the force shaping that future.
                            </p>
                            <p>
                                The Inspirational Guru Awards honour educators who go beyond teaching
                                subjects—and instead shape mindsets, character, and confidence.
                            </p>
                            <p>These are mentors who:</p>
                            <ul>
                                <li>Inspire action, not just understanding</li>
                                <li>Build resilience, not just knowledge</li>
                                <li>Influence lives far beyond classrooms</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* <section className="about_section">
                <div className="section_container text-white py-5">
                    <div className="row g-4 py-5 justify-content-center align-items-stretch">
                        <div className="col-xl-6">
                            <div className="about__content">
                                <div className="section-header">
                                    <span className="section-sub-title text-uppercase small text-white fw-bold">
                                        <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                                        About Us
                                    </span>
                                    <TitleReveal text="About ssvm Institutions" className="reveal_heading" />
                                    <p>
                                        SSVM Institutions have consistently stood at the intersection of academic excellence and future-focused education. With a strong belief that education must extend beyond classrooms, SSVM has built a culture that nurtures curiosity, leadership, and real-world thinking.
                                    </p>
                                    <p>
                                        Across campuses, the focus has always been clear: shape individuals who don’t just succeed in exams, but thrive in life. From entrepreneurship and innovation to sports and holistic development, SSVM students are encouraged to explore, experiment, and evolve.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-5 d-flex align-items-center">
                            <div className="about__thumbs" data-aos="zoom-in">
                                <img src="https://ssvm-2o-d4pw.vercel.app/_next/image?url=https%3A%2F%2Fssvmtransformationindia.s3.ap-south-1.amazonaws.com%2Fimages%2Fabout.jpg&w=640&q=75" className="w-100 rounded-3" alt="" />
                              <div className="thumb-column thumb-column-1">
                                    <div className="thumb-1 h-100 thumb bounce-y-down">
                                        <img
                                            src={`${BASE_IMAGE_URL}about1.jpeg`}
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                </div>

                                <div className="thumb-column thumb-column-2">
                                    <div className="thumb-2 thumb bounce-x">
                                        <img
                                            src={`${BASE_IMAGE_URL}about2.jpg`}
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                    <div className="thumb-3 thumb bounce-y-up">
                                        <img
                                            src={`${BASE_IMAGE_URL}about3.jpg`}
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            <section className="about_section py-3" id="about">
                <div className="section_container text-white py-5">
                    <div className="about_box">
                        <div className="row g-4 align-items-center">

                            {/* LEFT */}
                            <div className="col-xl-6 d-flex align-items-center">
                                <div className="about__image">
                                    <img
                                        src="https://ssvm-2o-d4pw.vercel.app/_next/image?url=https%3A%2F%2Fssvmtransformationindia.s3.ap-south-1.amazonaws.com%2Fimages%2Fabout.jpg&w=640&q=75"
                                        alt=""
                                    />
                                </div>
                            </div>

                            {/* RIGHT */}

                            <div className="col-xl-6">
                                <div className="about__content ps-lg-4">

                                    <span className="section-sub-title fw-bold text-white">
                                        <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                                        About Us
                                    </span>

                                    <div data-aos="fade-up">
                                        <h2 className="about_heading text-c1">
                                            About SSVM Institutions
                                        </h2>
                                        <p className="mt-4">
                                            SSVM Institutions have consistently stood at the intersection of academic excellence and future-focused education. With a strong belief that education must extend beyond classrooms, SSVM has built a culture that nurtures curiosity, leadership, and real-world thinking.
                                        </p>
                                        <p>
                                            Across campuses, the focus has always been clear: shape individuals who don’t just succeed in exams, but thrive in life. From entrepreneurship and innovation to sports and holistic development, SSVM students are encouraged to explore, experiment, and evolve.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="pb-4 media_coverage">
                    <div data-aos="fade-up" data-aos-delay="200">
                        <TitleReveal text="Media Coverage" className="heading_about text-c1 text-center small_sm_abt_heading" />
                    </div>
                    <div className="pt-4" data-aos="fade-up" data-aos-delay="300">
                        <Swiper
                            modules={[Autoplay, FreeMode]}
                            loop={true}
                            freeMode={true}
                            speed={4000}
                            autoplay={{
                                delay: 0,               // no pause
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 2,
                                },
                                480: {
                                    slidesPerView: 2,
                                },
                                680: {
                                    slidesPerView: 4,
                                },
                                768: {
                                    slidesPerView: 5,
                                },
                                1024: {
                                    slidesPerView: 5,
                                },
                                1280: {
                                    slidesPerView: 6,
                                },
                                1600: {
                                    slidesPerView: 6,
                                },
                            }}
                            spaceBetween={50}
                            allowTouchMove={false}
                        >
                            {slides.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <div className="slide-card">
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>
            <section>
                <div className="py-5 section_container">
                    <div data-aos="fade-up" data-aos-delay="200">
                        <TitleReveal text="Past Edition Highlights" className="heading_about text-center text-c1 small_sm_abt_heading" />
                    </div>
                    <div className="row g-4 mt-4" data-aos="fade-up" data-aos-delay="300">
                        {videos.map((id, i) => (
                            <div className="col-md-4 my-4" key={i}>
                                <iframe
                                    ref={i === index ? iframeRef : null}
                                    width="100%"
                                    height="220"
                                    src={`https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&autoplay=1&mute=1`}
                                    title="YouTube video"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-https://ssvmtransformingindia.com"
                                    allowFullScreen
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <MattersSection />
        </>
    );
};

export default Homepage;