import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/footer.css";

const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"

const Footer = () => {
    const handleTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [visible, setVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;

            const isBottom = currentY + winHeight >= docHeight - 10;
            const scrollingUp = currentY < lastScrollY;
            const scrollingDown = currentY > lastScrollY;

            if (currentY <= 200) {
                setVisible(false);
            } else if (isBottom) {
                setVisible(true);
            } else if (scrollingUp) {
                setVisible(true);
            } else if (scrollingDown) {
                setVisible(false);
            }

            setLastScrollY(currentY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <div data-aos="zoom-in">

                <footer className="site-footer" id="contact">

                    {/* <div className="wave-bg">
                    <div className="box">
                        <div className="wave one"></div>
                        <div className="wave two"></div>
                        <div className="wave three"></div>
                    </div>
                </div> */}

                    <div className="section_container footer-container">

                        <div className="row">
                            <div className="col-lg-6">
                                <div className="footer-block text-lg-start text-center">
                                    <div className="logo d-flex justify-content-lg-start justify-content-center">
                                        <Link to={"/"}>
                                            <img src={`/assets/images/ssvm-anim-white.gif`} className="logo-video" alt="" />
                                        </Link>
                                    </div>
                                    <p className="footer-text mt-4">
                                        Stay connected with SSVM Institutions and explore what’s shaping the future of education.
                                    </p>

                                    <div className="social-links">
                                        <a href="https://www.facebook.com/pages/category/School/SSVM-Institutions-211437765733217/" target="_blank">
                                            <span><i className="bi bi-facebook"></i></span>
                                        </a>
                                        <a href="https://www.instagram.com/ssvminstitutions/?hl=en" target="_blank">
                                            <span><i className="bi bi-instagram"></i></span>
                                        </a>
                                        <a href="https://www.linkedin.com/school/ssvminstitutions/posts/?feedView=all" target="_blank">
                                            <span><i className="bi bi-linkedin"></i></span>
                                        </a>
                                        <a href="https://twitter.com/ssvminstitution?lang=en" target="_blank">
                                            <span><i className="bi bi-twitter"></i></span>
                                        </a>
                                        <a href="https://www.youtube.com/channel/UC3a_O3pM5PRpVzL_RQECRVg" target="_blank">
                                            <span><i className="bi bi-youtube"></i></span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 d-flex justify-content-lg-end justify-content-start">
                                <div className="footer-block mt-5 mt-lg-0">
                                    <h4 className="text-c1">CONTACT US</h4>

                                    <p className="my-4 d-flex gap-1">
                                        <i className="bi bi-geo-fill text-secondary"></i>
                                        Sf No 72/2, Pattanam, To, Vellalore Rd, Vaigai Nagar, Singanallur, Coimbatore, Tamil Nadu 641016
                                    </p>

                                    <p className="my-4 d-flex gap-1">
                                        <i className="bi bi-envelope-fill text-secondary"></i>
                                        <a href="mailto:tic@ssvminstitutions.ac.in">
                                            tic@ssvminstitutions.ac.in
                                        </a>
                                    </p>

                                    <p className="my-4 d-flex gap-1">
                                        <i className="bi bi-telephone-fill text-secondary"></i>
                                        <a href="tel:+919344505000">+91 93445 05000</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                <div className="footer-bottom">
                    <p className="mb-0 fw-bold">© 2026 . All rights reserved SSVM.</p>
                    {/* <p className="mb-0 fw-bold footer-credit">Designed by <span><a href="https://iqtechway.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>IQTechway</a></span></p> */}
                </div>
            </div>

            {/* BACK TO TOP */}
            <div className={`back-to-top ${visible ? "show" : ""}`} onClick={handleTop}>
                <img src={`${BASE_IMAGE_URL}icon/up-arrows.png`} alt="up" />
            </div>
        </>
    );
};

export default Footer;