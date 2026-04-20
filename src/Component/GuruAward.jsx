import React from "react";
import TitleReveal from "./TitleReveal";
import "../assets/css/guruaward.css";
import { useNavigate } from 'react-router-dom';

const BASE_IMAGE_URL = "https://ssvmtransformingindia.com/assets/images/"

const GuruAward = () => {
    const navigate = useNavigate();
    
    const handleAwardSelect = (category, type = '') => {
        const typeParam = type ? `&type=${type}` : '';
        navigate(`/register?category=${category}${typeParam}`);
    };

    return (
        <div className="guru_award_parent">
            <div className="hero-bg"></div>

            <section className="hero-wrapper">
                <div className="hero">
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="hero-text text-white">
                                <div className="eyebrow">
                                    <span className="section-sub-title text-uppercase fw-bold">
                                        <img src={`${BASE_IMAGE_URL}favicon.png`} alt="" />
                                        Celebrating Excellence
                                    </span>
                                    {/* <span className="eyebrow-dot"></span>
                                    <span>Inspirational Guru Awards</span> */}
                                </div>

                                <div data-aos="fade-up">
                                    <TitleReveal
                                        text="Inspirational Guru"
                                        className="heading_about text-c1 "
                                        style={{
                                            textAlign: "start",
                                            display: "block",
                                        }}
                                    />
                                    <TitleReveal
                                        text="Awards"
                                        className="heading_about text-c1 "
                                        style={{
                                            textAlign: "start",
                                            display: "block",
                                        }}
                                    />

                                    <div className="mt-3">
                                        <p className="hero-subtitle">
                                            While students are the future, educators are the force shaping that future.
                                        </p>
                                        <p className="hero-subtitle">
                                            The Inspirational Guru Awards honour educators who go beyond teaching subjects—and instead shape mindsets, character, and confidence.
                                        </p>
                                        <p className="hero-subtitle">

                                            These are mentors who:
                                        </p>

                                        <ul>
                                            <li>Inspire action, not just understanding</li>
                                            <li>Build resilience, not just knowledge</li>
                                            <li>Influence lives far beyond classrooms</li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="hero-visual">
                                <article className="orbital-card">
                                    <div className="orbital-card-inner">
                                        <img src={`${BASE_IMAGE_URL}ssvm-guru-award.gif`} className="w-100" alt="" />
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div className="col-lg-12 mt-4">
                            <div className="hero-actions d-flex justify-content-between w-100">
                                <div className="d-flex flex-column align-items-center justify-content-center">
                                    <button onClick={() => handleAwardSelect('guru', 'internal')} className="btn-primary">
                                        <span>Register – Internal</span>
                                    </button>
                                    <p className="mt-3 text-white text-center small">Internal Category – Open to students from SSVM Institutions</p>
                                </div>
                                <div onClick={() => handleAwardSelect('guru', 'external')} className="d-flex flex-column align-items-center justify-content-center">
                                    <button className="btn-ghost">
                                        <span>Register – External</span>
                                    </button>
                                    <p className="mt-3 text-white text-center small">External Category – Open to students from other schools and institutions</p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-lg-12 mt-4">
                            <div className="hero-actions d-flex justify-content-between w-100 gap-3">
                                <div>
                                    <button className="btn-primary">
                                        <span>Register – Internal</span>
                                    </button>
                                    <p className="text-white small">Internal Category – Open to students from SSVM Institutions</p>
                                </div>

                                <div>
                                    <button className="btn-ghost">
                                        <span>Register – External</span>
                                    </button>
                                    <p className="text-white small">External Category – Open to students from other schools and institutions</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    {/* LEFT: TEXT */}
                </div>
            </section>
        </div>
    );
};

export default GuruAward;