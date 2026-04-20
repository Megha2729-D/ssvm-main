import React, { useRef, useState, useEffect } from "react";
import CustomCursor from "../Component/Cursor";
import TextReveal from "../Component/TextReveal";
import TextRevealSample from "../Component/sample";

// import BasketBallAnimation from "../Component/BasketBallAnimation"
// import BasketBallAnimation1 from "../Component/BasketBallAnimation1"
// import RunnerStickerAnimation from "../Component/RunnerStickerAnimation"
// import RunnerStickerAnimation2 from "../Component/RunnerStickerAnimation2"

import FencingStickerAnimation from "../Component/FencingStickerAnimation"
import ScrollRevealText from "../Component/ScrollRevealText";
import SportsAnimation from "../Component/SportsAnimation";
import VolleyBallAnimation from "../Component/VolleyBallAnimation";
import ArcherScrollAnimation from "../Component/ArcherScrollAnimation";
import Navbar from "./Navbar";

import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"
const images = [
    "https://ssvmtransformingindia.com/assets/images/banner/image-1.jpg",
    "https://ssvmtransformingindia.com/assets/images/banner/image-2.jpg",
    "https://ssvmtransformingindia.com/assets/images/banner/image-3.jpg",
    "https://ssvmtransformingindia.com/assets/images/banner/image-4.jpg",
];

const Homepage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [stackImages, setStackImages] = useState(images);
    const [animating, setAnimating] = useState(false);
    const [hoverImages, setHoverImages] = useState([]);
    const imageIndex = useRef(0);
    const lastPos = useRef({ x: 0, y: 0 });
    const mobileGalleryRef = useRef(null);

    // Detect mobile
    useEffect(() => {
        if (window.innerWidth < 768) setIsMobile(true);
    }, []);

    // AOS init
    useEffect(() => {
        AOS.init({ duration: 1000, once: false, easing: "ease-in-out" });
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

    const cards = [
        { title: "STARTER", price: "45€", color: "#23002b", textColor: "#e894ff" },
        { title: "BOOSTER", price: "85€", color: "#002629", textColor: "#94ffe4" },
        { title: "PRO", price: "125€", color: "#291900", textColor: "#FF9D42" },
        { title: "BOOSTER", price: "85€", color: "#e894ff", textColor: "#23002b" },
        { title: "PRO", price: "125€", color: "#23002b", textColor: "#e894ff" },
    ];

    return (
        <>
            <CustomCursor />
            <section>
                <div className="main_content">
                    <div className="top_section">
                        <Navbar />
                        {/* <video className="bg_video" autoPlay muted loop playsInline>
                            <source src="/assets/images/bg-video-1.mp4" type="video/mp4" />
                        </video>
                        <div className="video_overlay"></div> */}

                        <div className="section_container banner_content_parent">
                            <div className="row justify-content-center pb-4">
                                <div className="col-lg-8">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-5">
                                            <FencingStickerAnimation />
                                        </div>
                                    </div>
                                    <div className="banner_content">
                                        <div className="anim_heading_wrapper" onMouseMove={handleMouseMove}>
                                            <img src="/assets/images/ring_theme.png" alt="Yellow Oval" className="yellow-oval" />
                                            <div className="anim_heading">
                                                <TextReveal text="Flex" className="banner_text" />
                                                <TextReveal text=" Your" className="banner_text" />
                                                <TextReveal text=" Future" className="banner_text" />
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
            <VolleyBallAnimation />
            <section className="about_section">
                <div className="section_container text-white py-5">
                    <div className="row g-4 py-5 justify-content-center align-items-stretch">
                        <div className="col-xl-5">
                            <div className="about__content">
                                <div className="section-header">
                                    <span className="section-sub-title text-uppercase small text-white fw-bold">
                                        <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                                        Inside SSVM
                                        
                                    </span>
                                    <ScrollRevealText text="Flex Your Future with SSVM" className="reveal_heading" />
                                    <p>
                                        SSVM Institutions have consistently stood at the intersection of academic excellence and future-focused education. With a strong belief that education must extend beyond classrooms, SSVM has built a culture that nurtures curiosity, leadership, and real-world thinking.
                                    </p>
                                    <p>
                                        Across campuses, the focus has always been clear: shape individuals who don’t just succeed in exams, but thrive in life. From entrepreneurship and innovation to sports and holistic development, SSVM students are encouraged to explore, experiment, and evolve.
                                    </p>

                                    <div className="info-boxes d-flex flex-wrap justify-content-between my-4">
                                        <div className="info-box d-flex gap-2 my-3 my-lg-0">
                                            <div className="icon">
                                                <img
                                                    src="https://axora-html.netlify.app/assets/images/icons/icon-1.png"
                                                    alt="icon"
                                                />
                                            </div>
                                            <h6 className="info d-flex align-items-center">
                                                Our Core  <br className="d-none d-xl-block" />
                                                Mission
                                            </h6>
                                        </div>
                                        <div className="info-box d-flex gap-2 my-3 my-lg-0">
                                            <div className="icon">
                                                <img
                                                    src="https://axora-html.netlify.app/assets/images/icons/icon-2.png"
                                                    alt="icon"
                                                />
                                            </div>
                                            <h6 className="info d-flex align-items-center">
                                                Vision & <br className="d-none d-xl-block" />
                                                Future Goals
                                            </h6>
                                        </div>
                                    </div>

                                    {/* <div className="info-lists-wrapper">
                                        <div className="info-lists">
                                            <ul>
                                                <li>
                                                    <i className="fa-solid fa-badge-check"></i>
                                                    Empower students with innovation and leadership
                                                </li>
                                                <li>
                                                    <i className="fa-solid fa-badge-check"></i>
                                                    Foster holistic development beyond academics
                                                </li>
                                                <li>
                                                    <i className="fa-solid fa-badge-check"></i>
                                                    Prepare young minds to thrive in a global world
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="video-thumb">
                                            <img
                                                src="https://axora-html.netlify.app/assets/images/about/about-video-thumb.png"
                                                alt="about-video-thumb"
                                            />
                                            <button
                                                className="video-play-btn"
                                                type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#globalVideoModal"
                                                data-video-id="M7lc1UVf-VE"
                                            >
                                                <i className="fa-solid fa-play"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <a className='button-v1' href='/about'>
                                        Read More
                                        <span className="button-icon">
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </span>
                                    </a> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6 d-flex align-items-center">
                            <div className="about__thumbs" data-aos="zoom-in" data-aos-delay="100">
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
            </section>
            {/* <section className="section_container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="mission_container text-center">
                            <div className="big_text text-center">
                                <ScrollRevealText text="OUR MISSION?" className="reveal_heading" />
                                <div className="d-flex">
                                    <BasketBallAnimation />
                                    <ScrollRevealText text=" BREAK " className="reveal_heading" />
                                </div>
                                <ScrollRevealText text=" THE RULES OF" className="reveal_heading" />
                                <ScrollRevealText text="CHALLENGE TRADITIONAL " className="reveal_heading" />
                                <div className="d-flex">
                                    <ScrollRevealText text=" CAREERS" className="reveal_heading" />
                                    <RunnerStickerAnimation />
                                </div>
                                <ScrollRevealText text="REIMAGINE TALENT & OPPORTUNITY" className="reveal_heading" />
                                <div className="d-flex">
                                    <RunnerStickerAnimation2 />
                                    <ScrollRevealText text=" EMPOWER" className="reveal_heading" />
                                </div>
                                <ScrollRevealText text=" YOUNG INNOVATORS" className="reveal_heading" />
                                <ScrollRevealText text="UNLOCK" className="reveal_heading" />
                                <div className="d-flex">
                                    <RunnerStickerAnimation />
                                    <ScrollRevealText text=" THE " className="reveal_heading" />
                                </div>
                                <ScrollRevealText text="FUTURE" className="reveal_heading" />
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            <ArcherScrollAnimation />
            {/* <section className="">
                <div className="section_container">
                    <div className="swiper-container">
                        <Swiper
                            effect={'cards'}
                            grabCursor={true}
                            loop={true}
                            modules={[EffectCards, EffectCreative]}
                            className="mySwiper"
                            initialSlide={2}
                            cardsEffect={{
                                slideShadows: false,
                                perSlideRotate: 8,
                                perSlideOffset: 12,
                            }}
                        >
                            {cards.map((card, index) => (
                                <SwiperSlide key={index} style={{ backgroundColor: card.color }}>
                                    <div className="card-content" style={{ color: card.textColor }}>
                                        <div className="icon">⚡</div> 
                                        <h2>{card.title}</h2>
                                        <p className="price">{card.price}/Monat</p>

                                        <div className="description">
                                            <p>Die {card.title} Membership richtet sich an junge Unternehmen...</p>
                                            <ul>
                                                <li><span> get</span> Networking mit Unternehmen</li>
                                                <li><span> get</span> Teilnahme an Club Events</li>
                                                <li><span> get</span> Zugang zu Konditionen</li>
                                            </ul>
                                        </div>

                                        <button className="join-btn">Join</button>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>
            <SportsAnimation /> */}
            <section>
                <img src="./assets/images/basketball-anim.png" loading="lazy"
                    style={{ opacity: "1" }} alt="" className="hero_bam-dunk bam-glitch glitching"></img>
            </section>
        </>
    );
};

export default Homepage;