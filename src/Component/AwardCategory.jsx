import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/awardcategory.css';

const AwardCategory = () => {
    const navigate = useNavigate();

    const handleAwardSelect = (category) => {
        window.location.href = `/register?category=${category}`;
    };

    return (
        <section className="award_category_section">
            <div className="section_container">
                <div className="row justify-content-center g-5">
                    {/* INSPIRATIONAL GURU AWARDS */}
                    <div className="col-lg-5 col-md-10" data-aos="fade-up">
                        <div className="award_card" onClick={() => handleAwardSelect('guru')} style={{ cursor: 'pointer' }}>
                            <div className="award_icon_box">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3m6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/>
                                </svg>
                            </div>
                            <h2 className="award_title">INSPIRATIONAL <br/> GURU AWARDS</h2>
                            <p className="award_subtitle">Honouring educators who shape <br/> mindsets and lives.</p>
                        </div>
                    </div>

                    {/* STUDENTPRENEUR AWARDS */}
                    <div className="col-lg-5 col-md-10" data-aos="fade-up" data-aos-delay="200">
                        <div className="award_card" onClick={() => handleAwardSelect('studentpreneur')} style={{ cursor: 'pointer' }}>
                            <div className="award_icon_box">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7m2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1"/>
                                </svg>
                            </div>
                            <h2 className="award_title">STUDENTPRENEUR <br/> AWARDS</h2>
                            <p className="award_subtitle">Recognizing young innovative minds <br/> and student ventures.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AwardCategory;
