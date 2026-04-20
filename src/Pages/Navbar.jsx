import { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/navbar.css";

gsap.registerPlugin(ScrollTrigger);

const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/";

const Navbar = () => {
    const navRef = useRef(null);
    const overlayRef = useRef(null);
    const backdropRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    // Body scroll lock + animation
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";

            gsap.to(overlayRef.current, {
                x: 0,
                duration: 0.4,
                ease: "power3.out",
            });

            gsap.to(backdropRef.current, {
                opacity: 1,
                visibility: "visible",
                duration: 0.3,
            });
        } else {
            document.body.style.overflow = "";

            gsap.to(overlayRef.current, {
                x: "-100%",
                duration: 0.4,
                ease: "power3.in",
            });

            gsap.to(backdropRef.current, {
                opacity: 0,
                visibility: "hidden",
                duration: 0.3,
            });
        }
    }, [menuOpen]);

    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        setMenuOpen(false); // close mobile menu if open
    };

    return (
        <>
            <nav className="navbar p-0" ref={navRef}>
                <div className="section_container navbar-inner">

                    {/* LEFT LOGO */}
                    <div className="logo left_logo">
                        <Link to={"/"}>
                            <img src={`${BASE_IMAGE_URL}logo-video.gif`} className="logo-video" alt="" />
                        </Link>
                    </div>

                    {/* DESKTOP NAV */}
                    <ul className="nav-links mb-0">
                        <li className="nav-item px-0" onClick={() => handleScrollTo("home")}>Home</li>
                        <li className="nav-item px-0" onClick={() => handleScrollTo("about")}>About Conclave</li>
                        <li className="nav-item px-0" onClick={() => handleScrollTo("speakers")}>Speakers</li>
                        <li className="nav-item px-0" onClick={() => handleScrollTo("awards")}>Awards</li>
                        <li className="nav-item px-0" onClick={() => handleScrollTo("contact")}>Contact Us</li>
                    </ul>

                    {/* RIGHT SIDE */}
                    <div className="right_area">
                        <img
                            src={`${BASE_IMAGE_URL}initiative-logo.png`}
                            className="initiative_logo"
                            alt="initiative"
                        />
                    </div>
                    <button
                        className="hamburger"
                        onClick={() => setMenuOpen(true)}
                    >
                        ☰
                    </button>

                </div>
            </nav>

            {/* BACKDROP */}
            <div
                ref={backdropRef}
                className="backdrop"
                onClick={() => setMenuOpen(false)}
            />

            {/* OVERLAY MENU */}
            <div ref={overlayRef} className="mobile_overlay">

                <div className="w-100 d-flex justify-content-between">
                    <div className="nav_logo">
                        <img src={`/assets/images/ssvm-anim-white.gif`} className="w-100" alt="" />
                    </div>
                    <button
                        className="close_btn"
                        onClick={() => setMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <ul className="mobile_nav">
                    <li className="nav-item" onClick={() => handleScrollTo("home")}>Home</li>
                    <li className="nav-item" onClick={() => handleScrollTo("about")}>About Conclave</li>
                    <li className="nav-item" onClick={() => handleScrollTo("speakers")}>Speakers</li>
                    <li className="nav-item" onClick={() => handleScrollTo("awards")}>Awards</li>
                    <li className="nav-item" onClick={() => handleScrollTo("contact")}>Contact Us</li>
                </ul>

            </div>
        </>
    );
};

export default Navbar;