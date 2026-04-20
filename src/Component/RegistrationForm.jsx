import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import '../assets/registration/RegistrationForm.css';

const RegistrationForm = () => {
    const location = useLocation();
    const [step, setStep] = useState(1);
    
    // Synchronous Initialization from URL params
    const [mainCategory, setMainCategory] = useState(() => {
        return new URLSearchParams(window.location.search).get('category') || '';
    });
    const [filterType, setFilterType] = useState(() => {
        return new URLSearchParams(window.location.search).get('type') || '';
    });

    const [formData, setFormData] = useState({
        awardGroup: '',
        nominationType: '',
        studentName: '', // used for nominee/teacher name
        lastName: '',
        schoolName: '',
        phone: '',
        email: '',
        subjects: '',
        impact: '',
        vision: '',
        awardsWon: '',
        teacherProfile: '',
        experience: '',
        nominatorName: '',
        nominatorPhone: '',
        nominatorEmail: '',
        nominatorAddress: '',
        references: '',
        achievements: '',
        whyJoin: '',
        // Studentpreneur Specific
        schoolCity: '',
        schoolEmail: '',
        businessIdea: '',
        totalMembers: '',
        grade: '',
        schoolPhone: '',
        isPETeacher: '',
        petDetails: '',
        termsAccepted: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [regNumber, setRegNumber] = useState('');
    const formRef = useRef(null);

    // Auto-select if unique filter
    useEffect(() => {
        if (mainCategory && filterType && awardTypes[mainCategory]) {
            const possibleTypes = awardTypes[mainCategory].filter(t => !filterType || t.id.startsWith(filterType));
            if (possibleTypes.length === 1 && !formData.nominationType) {
                setFormData(prev => ({ 
                    ...prev, 
                    nominationType: possibleTypes[0].id,
                    awardGroup: mainCategory 
                }));
                // Auto skip to details if it's a direct choice (Studentpreneur)
                if (mainCategory === 'studentpreneur') {
                    setStep(2);
                }
            }
        }
    }, [mainCategory, filterType, formData.nominationType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const [fileName, setFileName] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'camera'

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            
            if (!allowedTypes.includes(file.type)) {
                alert('Only JPG, JPEG, and PNG files are accepted');
                e.target.value = '';
                return;
            }

            setFileName(file.name);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setCapturedImage(null);
        }
    };

    const removeImage = () => {
        setFileName('');
        setUploadPreview(null);
        setCapturedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        stopCamera();
    };

    const startCamera = async () => {
        setShowCamera(true);
        setCapturedImage(null);
        setUploadPreview(null);
        setFileName('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImage(dataUrl);
            stopCamera();
        }
    };

    const scrollToFormTop = () => {
        const section = document.querySelector('.registration-section');
        if (section) {
            const yOffset = -100;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Scroll to top on step change
    useEffect(() => {
        // Small timeout to ensure DOM update and avoid GSAP conflicts
        const timer = setTimeout(scrollToFormTop, 100);
        return () => clearTimeout(timer);
    }, [step, submitted]);

    const handleStepChange = (nextStep) => {
        gsap.to(formRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
                setStep(nextStep);
                gsap.to(formRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        if (currentStep === 2) {
            const isGuru = mainCategory === 'guru';
            const requiredFields = isGuru ? 
                ['studentName', 'lastName', 'schoolName', 'phone', 'email', 'subjects', 'impact', 'vision', 'teacherProfile', 'experience', 'isPETeacher'] :
                ['studentName', 'grade', 'email', 'phone', 'schoolName', 'schoolCity', 'schoolPhone', 'schoolEmail', 'businessIdea', 'totalMembers'];
            
            if (isGuru && formData.isPETeacher === 'yes') {
                requiredFields.push('petDetails');
            }
            
            for (let field of requiredFields) {
                if (!formData[field]) {
                    newErrors[field] = 'This field is required';
                }
            }

            // Spam/Disposable Email Validation
            if (formData.email) {
                const disposableDomains = [
                    'mailinator.com', 'yopmail.com', 'tempmail.com', 'guerrillamail.com', 
                    '10minutemail.com', 'sharklasers.com', 'trashmail.com', 'dispostable.com',
                    'getairmail.com', 'maildrop.cc', 'temp-mail.org', 'fake-mail.com'
                ];
                const emailDomain = formData.email.split('@')[1]?.toLowerCase();
                if (disposableDomains.includes(emailDomain)) {
                    newErrors.email = 'Disposable or spam emails are not allowed. Please use a valid email.';
                }
            }

            if (isGuru) {
                if (uploadMode === 'upload' && !uploadPreview) {
                    newErrors.photo = 'Please upload a candidate photo';
                }
                if (uploadMode === 'camera' && !capturedImage) {
                    newErrors.photo = 'Please capture a photo';
                }
            } else {
                if (!formData.pitchDeck) {
                    newErrors.pitchDeck = 'Please upload a presentation/pitch deck';
                }
            }
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            scrollToFormTop();
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            handleStepChange(step + 1);
        }
    };

    const awardTypes = {
        guru: [
            { id: 'internal-self', label: 'Internal - Self Nomination', desc: 'Nominate yourself as an SSVM educator ' },
            { id: 'internal-other', label: 'Internal - Nominate Other', desc: 'Nominate an educator from SSVM institutions' },
            { id: 'external-self', label: 'External - Self Nomination', desc: 'Nominate yourself' },
            { id: 'external-other', label: 'External - Nominate Others', desc: 'Nominate an educator you know' },
        ],
        studentpreneur: [
            { id: 'internal', label: 'Internal Studentpreneur', desc: 'For students currently studying at SSVM' },
            { id: 'external', label: 'External Studentpreneur', desc: 'For student entrepreneurs from other schools' },
        ]
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Final validation for Step 3
        const newErrors = {};
        const isGuru = mainCategory === 'guru';
        const requiredStep3 = isGuru ? 
            ['nominatorName', 'nominatorPhone', 'nominatorEmail', 'nominatorAddress', 'references'] :
            ['achievements', 'whyJoin'];

        for (let field of requiredStep3) {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        }

        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            scrollToFormTop();
            return;
        }

        setSubmitting(true);

        const data = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (key !== 'termsAccepted') {
                data.append(key, formData[key]);
            }
        });
        
        // Add awardGroup specifically if not already set (mainCategory)
        data.append('awardGroup', mainCategory);

        // Append image/photo if present (For Guru)
        if (uploadMode === 'upload' && fileInputRef.current?.files[0]) {
            data.append('photo', fileInputRef.current.files[0]);
        } else if (uploadMode === 'camera' && capturedImage) {
            data.append('capturedImage', capturedImage);
        }

        // Append Pitch Deck (For Studentpreneur)
        if (formData.pitchDeck) {
            data.append('pitchDeck', formData.pitchDeck);
        }

        try {
            console.log('Submitting to:', 'https://new.ssvmtransformingindia.com/public/api/register');
            const response = await fetch('https://new.ssvmtransformingindia.com/public/api/register', {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setRegNumber(result.data.register_number);
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(result.message || 'Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(`Network Error: ${error.message}. Please check if the backend server is running.`);
        } finally {
            setSubmitting(false);
        }
    };

    const renderFormBanner = () => {
        const stepNames = {
            1: 'Step 1: Category Selection',
            2: 'Step 2: Registration Details',
            3: 'Step 3: Final Submission'
        };

        const getBannerTitle = () => {
            if (mainCategory) {
                return mainCategory === 'guru' ? 'INSPIRATIONAL GURU AWARDS' : 'STUDENTPRENEUR AWARDS';
            }
            return 'SSVM AWARDS & RECOGNITION';
        };

        return (
            <div className="form-banner">
                <h1 className="banner-title-en">{getBannerTitle()}</h1>
                <div className="banner-path">
                    {stepNames[step] || 'REGISTRATION FORM'}
                </div>
            </div>
        );
    };

    const renderStepper = () => (
        <div className="stepper-wrapper">
            <div className="stepper-progress">
                {[1, 2, 3].map(num => (
                    <div key={num} className={`step-node ${step === num ? 'active' : step > num ? 'completed' : ''}`}>
                        {step > num ? '✓' : num}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <span className="step-label">Category</span>
                <span className="step-label">Details</span>
                <span className="step-label">Submission</span>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div ref={formRef}>
                        {!mainCategory ? (
                            <div className="nomination-cards">
                                <div 
                                    className="nomination-card"
                                    onClick={() => setMainCategory('guru')}
                                >
                                    <i className="bi bi-person-workspace"></i>
                                    <h4>Inspirational Guru Awards</h4>
                                    <p>Honouring educators who shape mindsets and lives.</p>
                                </div>
                                <div 
                                    className="nomination-card"
                                    onClick={() => setMainCategory('studentpreneur')}
                                >
                                    <i className="bi bi-lightbulb"></i>
                                    <h4>Studentpreneur Awards</h4>
                                    <p>Recognizing young innovative minds and student ventures.</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="nomination-cards">
                                    {awardTypes[mainCategory]
                                        .filter(type => {
                                            // Always show both for studentpreneur as per previous request
                                            if (mainCategory === 'studentpreneur') return true;
                                            // For Guru, only show if it matches the filter (e.g., internal-*)
                                            return !filterType || type.id.startsWith(filterType);
                                        })
                                        .map(type => (
                                            <div 
                                                key={type.id}
                                                className={`nomination-card ${formData.nominationType === type.id ? 'selected' : ''}`}
                                                onClick={() => setFormData(prev => ({ ...prev, nominationType: type.id, awardGroup: mainCategory }))}
                                            >
                                                {formData.nominationType === type.id && (
                                                    <span className="selected-badge">Selected</span>
                                                )}
                                                <i className={`bi ${formData.nominationType === type.id ? 'bi-check-circle-fill' : 'bi-check2-circle'}`}></i>
                                                <h4>{type.label}</h4>
                                                <p>{type.desc}</p>
                                            </div>
                                        ))}
                                </div>
                                <div className="form-footer" style={{ marginTop: '30px' }}>
                                    <button className="nav-btn btn-back" onClick={() => setMainCategory('')}>Back to Main</button>
                                    <button 
                                        className="nav-btn btn-next" 
                                        disabled={!formData.nominationType}
                                        onClick={() => handleStepChange(2)}
                                    >
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 2:
                const isNominateOther = formData.nominationType.includes('other');
                const isGuru = mainCategory === 'guru';
                
                return (
                    <div ref={formRef}>
                        <div className="registration-form">
                            {isGuru ? (
                                <>
                                    {/* Names Grid */}
                                    <div className={`input-group ${errors.studentName ? 'has-error' : ''}`}>
                                        <label>Teacher's First Name <span className="required-asterisk">*</span></label>
                                        <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="First Name" required />
                                        {errors.studentName && <span className="error-text">{errors.studentName}</span>}
                                    </div>
                                    <div className={`input-group ${errors.lastName ? 'has-error' : ''}`}>
                                        <label>Teacher's Last Name <span className="required-asterisk">*</span></label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                                        {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                                    </div>

                                    <div className={`input-group full-width ${errors.schoolName ? 'has-error' : ''}`}>
                                        <label>Name of the School <span className="required-asterisk">*</span></label>
                                        <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="School Name" required />
                                        {errors.schoolName && <span className="error-text">{errors.schoolName}</span>}
                                    </div>

                                    <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
                                        <label>Phone <span className="required-asterisk">*</span></label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>
                                    <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                                        <label>Email <span className="required-asterisk">*</span></label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.subjects ? 'has-error' : ''}`}>
                                        <label>Which subjects do they teach? <span className="required-asterisk">*</span></label>
                                        <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="e.g. Mathematics, Science" required />
                                        {errors.subjects && <span className="error-text">{errors.subjects}</span>}
                                    </div>

                                    <div className={`input-group full-width ${errors.isPETeacher ? 'has-error' : ''}`}>
                                        <label>Are you a physical educational teacher? <span className="required-asterisk">*</span></label>
                                        <div className="radio-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input 
                                                    type="radio" 
                                                    name="isPETeacher" 
                                                    value="yes" 
                                                    checked={formData.isPETeacher === 'yes'} 
                                                    onChange={handleChange} 
                                                /> Yes
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input 
                                                    type="radio" 
                                                    name="isPETeacher" 
                                                    value="no" 
                                                    checked={formData.isPETeacher === 'no'} 
                                                    onChange={handleChange} 
                                                /> No
                                            </label>
                                        </div>
                                        {errors.isPETeacher && <span className="error-text">{errors.isPETeacher}</span>}
                                    </div>

                                    {formData.isPETeacher === 'yes' && (
                                        <div className={`input-group full-width ${errors.petDetails ? 'has-error' : ''}`}>
                                            <label>Please specify your sports specialization or achievements <span className="required-asterisk">*</span></label>
                                            <textarea 
                                                name="petDetails" 
                                                value={formData.petDetails} 
                                                onChange={handleChange} 
                                                rows="3" 
                                                placeholder="e.g. Athletics Coach, National Level Player, etc."
                                                required
                                            ></textarea>
                                            {errors.petDetails && <span className="error-text">{errors.petDetails}</span>}
                                        </div>
                                    )}
                                    <div className={`input-group full-width ${errors.impact ? 'has-error' : ''}`}>
                                        <label>How have they impacted their students lives? <span className="required-asterisk">*</span></label>
                                        <textarea name="impact" value={formData.impact} onChange={handleChange} rows="3" required></textarea>
                                        {errors.impact && <span className="error-text">{errors.impact}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.vision ? 'has-error' : ''}`}>
                                        <label>Vision for the younger generation <span className="required-asterisk">*</span></label>
                                        <textarea name="vision" value={formData.vision} onChange={handleChange} rows="3" required></textarea>
                                        {errors.vision && <span className="error-text">{errors.vision}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.teacherProfile ? 'has-error' : ''}`}>
                                        <label>Brief profile about your teacher <span className="required-asterisk">*</span></label>
                                        <textarea name="teacherProfile" value={formData.teacherProfile} onChange={handleChange} rows="3" required></textarea>
                                        {errors.teacherProfile && <span className="error-text">{errors.teacherProfile}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.photo ? 'has-error' : ''}`}>
                                        <label>Candidate Photo <span className="required-asterisk">*</span></label>
                                        <div className="upload-choices">
                                            <div 
                                                className={`choice-btn ${uploadMode === 'upload' ? 'active' : ''}`}
                                                onClick={() => { setUploadMode('upload'); stopCamera(); setErrors(p => ({...p, photo: null})); }}
                                            >
                                                <i className="bi bi-upload"></i> Upload Photo
                                            </div>
                                            <div 
                                                className={`choice-btn ${uploadMode === 'camera' ? 'active' : ''}`}
                                                onClick={() => { setUploadMode('camera'); startCamera(); setErrors(p => ({...p, photo: null})); }}
                                            >
                                                <i className="bi bi-camera"></i> Live Capture
                                            </div>
                                        </div>

                                        <div className="file-upload-wrapper" style={{ marginTop: '15px' }}>
                                            {/* ... */}
                                            {uploadMode === 'upload' ? (
                                                <>
                                                    {!uploadPreview ? (
                                                        <div className="file-upload-area">
                                                            <i className="bi bi-image"></i>
                                                            <span>Select photo from device</span>
                                                            <input 
                                                                type="file" 
                                                                ref={fileInputRef}
                                                                name="photo" 
                                                                onChange={(e) => { handleFileChange(e); setErrors(p => ({...p, photo: null})); }} 
                                                                accept="image/*" 
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="photo-preview-wrap">
                                                            <img src={uploadPreview} alt="Selected" />
                                                            <div className="preview-overlay">
                                                                <span className="file-name-tag">{fileName}</span>
                                                                <button type="button" className="retake-btn" style={{ background: '#ff4757' }} onClick={removeImage}>
                                                                    <i className="bi bi-trash"></i> Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="camera-wrap">
                                                    {showCamera && (
                                                        <div className="camera-container">
                                                            <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
                                                            <div className="camera-controls">
                                                                <button type="button" className="capture-btn" onClick={() => { capturePhoto(); setErrors(p => ({...p, photo: null})); }} title="Capture"></button>
                                                            </div>
                                                            <button type="button" className="camera-close-btn" onClick={stopCamera}>×</button>
                                                        </div>
                                                    )}
                                                    
                                                    {capturedImage && (
                                                        <div className="photo-preview-wrap">
                                                            <img src={capturedImage} alt="Captured" />
                                                            <div className="preview-overlay">
                                                                <button type="button" className="retake-btn" onClick={startCamera}>
                                                                    <i className="bi bi-arrow-clockwise"></i> Retake
                                                                </button>
                                                                <button type="button" className="retake-btn" style={{ right: '90px', background: '#ff4757' }} onClick={removeImage}>
                                                                    <i className="bi bi-trash"></i> Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {!showCamera && !capturedImage && (
                                                        <div className="file-upload-area" onClick={startCamera}>
                                                            <i className="bi bi-camera-fill"></i>
                                                            <span>Click to start camera</span>
                                                        </div>
                                                    )}
                                                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                                </div>
                                            )}
                                        </div>
                                        {errors.photo && <span className="error-text">{errors.photo}</span>}
                                    </div>

                                    <div className={`input-group full-width ${errors.experience ? 'has-error' : ''}`}>
                                        <label>How many years of experience do they have? <span className="required-asterisk">*</span></label>
                                        <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Number of years" required />
                                        {errors.experience && <span className="error-text">{errors.experience}</span>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`input-group ${errors.studentName ? 'has-error' : ''}`}>
                                        <label>Student Name <span className="required-asterisk">*</span></label>
                                        <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Name" required />
                                        {errors.studentName && <span className="error-text">{errors.studentName}</span>}
                                    </div>
                                    <div className={`input-group ${errors.grade ? 'has-error' : ''}`}>
                                        <label>Grade/Class <span className="required-asterisk">*</span></label>
                                        <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g., 10th Grade" required />
                                        {errors.grade && <span className="error-text">{errors.grade}</span>}
                                    </div>
                                    
                                    <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                                        <label>Applicant Email <span className="required-asterisk">*</span></label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>
                                    <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
                                        <label>Applicant Mobile No <span className="required-asterisk">*</span></label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" required />
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>

                                    <div className={`input-group full-width ${errors.schoolName ? 'has-error' : ''}`}>
                                        <label>School Name <span className="required-asterisk">*</span></label>
                                        <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="Full School Name" required />
                                        {errors.schoolName && <span className="error-text">{errors.schoolName}</span>}
                                    </div>

                                    <div className={`input-group ${errors.schoolCity ? 'has-error' : ''}`}>
                                        <label>School City <span className="required-asterisk">*</span></label>
                                        <input type="text" name="schoolCity" value={formData.schoolCity} onChange={handleChange} placeholder="City" required />
                                        {errors.schoolCity && <span className="error-text">{errors.schoolCity}</span>}
                                    </div>
                                    <div className={`input-group ${errors.schoolPhone ? 'has-error' : ''}`}>
                                        <label>School Phone no <span className="required-asterisk">*</span></label>
                                        <input type="tel" name="schoolPhone" value={formData.schoolPhone} onChange={handleChange} placeholder="School Contact" required />
                                        {errors.schoolPhone && <span className="error-text">{errors.schoolPhone}</span>}
                                    </div>

                                    <div className={`input-group full-width ${errors.schoolEmail ? 'has-error' : ''}`}>
                                        <label>School email <span className="required-asterisk">*</span></label>
                                        <input type="email" name="schoolEmail" value={formData.schoolEmail} onChange={handleChange} placeholder="school.email@example.com" required />
                                        {errors.schoolEmail && <span className="error-text">{errors.schoolEmail}</span>}
                                    </div>

                                    <div className={`input-group full-width ${errors.businessIdea ? 'has-error' : ''}`}>
                                        <label>Business Idea / Venture Details <span className="required-asterisk">*</span></label>
                                        <textarea name="businessIdea" value={formData.businessIdea} onChange={handleChange} rows="3" placeholder="Describe your innovative idea..." required></textarea>
                                        {errors.businessIdea && <span className="error-text">{errors.businessIdea}</span>}
                                    </div>

                                    <div className={`input-group ${errors.totalMembers ? 'has-error' : ''}`}>
                                        <label>Total members in Team <span className="required-asterisk">*</span></label>
                                        <input type="number" name="totalMembers" value={formData.totalMembers} onChange={handleChange} placeholder="No. of members" required />
                                        {errors.totalMembers && <span className="error-text">{errors.totalMembers}</span>}
                                    </div>

                                    <div className={`input-group ${errors.pitchDeck ? 'has-error' : ''}`}>
                                        <label>Presentation / Pitch Deck (PDF/Image) <span className="required-asterisk">*</span></label>
                                        <input type="file" name="pitchDeck" onChange={(e) => { setFormData(prev => ({ ...prev, pitchDeck: e.target.files[0] })); setErrors(p => ({...p, pitchDeck: null})); }} accept=".pdf,image/*" required />
                                        {errors.pitchDeck && <span className="error-text">{errors.pitchDeck}</span>}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="form-footer">
                            <button className="nav-btn btn-back" onClick={() => handleStepChange(1)}>Back</button>
                            <button className="nav-btn btn-next" onClick={handleNext}>Next Step</button>
                        </div>
                    </div>
                );
            case 3:
                const isGuruAward = mainCategory === 'guru';
                return (
                    <div ref={formRef}>
                        <div className="registration-form">
                            {isGuruAward ? (
                                <>
                                    <div className={`input-group ${errors.nominatorName ? 'has-error' : ''}`}>
                                        <label>Nominator Name <span className="required-asterisk">*</span></label>
                                        <input type="text" name="nominatorName" value={formData.nominatorName} onChange={handleChange} placeholder="Your Name" required />
                                        {errors.nominatorName && <span className="error-text">{errors.nominatorName}</span>}
                                    </div>
                                    <div className={`input-group ${errors.nominatorPhone ? 'has-error' : ''}`}>
                                        <label>Nominator Mobile Number <span className="required-asterisk">*</span></label>
                                        <input type="tel" name="nominatorPhone" value={formData.nominatorPhone} onChange={handleChange} placeholder="Your Phone" required />
                                        {errors.nominatorPhone && <span className="error-text">{errors.nominatorPhone}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.nominatorEmail ? 'has-error' : ''}`}>
                                        <label>Nominator Email <span className="required-asterisk">*</span></label>
                                        <input type="email" name="nominatorEmail" value={formData.nominatorEmail} onChange={handleChange} placeholder="your.email@example.com" required />
                                        {errors.nominatorEmail && <span className="error-text">{errors.nominatorEmail}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.nominatorAddress ? 'has-error' : ''}`}>
                                        <label>Nominator Address <span className="required-asterisk">*</span></label>
                                        <textarea name="nominatorAddress" value={formData.nominatorAddress} onChange={handleChange} rows="2" placeholder="Your Address" required></textarea>
                                        {errors.nominatorAddress && <span className="error-text">{errors.nominatorAddress}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.references ? 'has-error' : ''}`}>
                                        <label>Are there any more reference for the nominated teacher? <span className="required-asterisk">*</span></label>
                                        <textarea name="references" value={formData.references} onChange={handleChange} rows="2" placeholder="List other references..." required></textarea>
                                        {errors.references && <span className="error-text">{errors.references}</span>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`input-group full-width ${errors.achievements ? 'has-error' : ''}`}>
                                        <label>Key Achievements (Medals, Honors, Awards) <span className="required-asterisk">*</span></label>
                                        <textarea name="achievements" value={formData.achievements} onChange={handleChange} rows="3" placeholder="Describe your biggest wins..." required></textarea>
                                        {errors.achievements && <span className="error-text">{errors.achievements}</span>}
                                    </div>
                                    <div className={`input-group full-width ${errors.whyJoin ? 'has-error' : ''}`}>
                                        <label>Why do you want to join SSVM Excellence? <span className="required-asterisk">*</span></label>
                                        <textarea name="whyJoin" value={formData.whyJoin} onChange={handleChange} rows="3" placeholder="Tell us about your aspirations..." required></textarea>
                                        {errors.whyJoin && <span className="error-text">{errors.whyJoin}</span>}
                                    </div>
                                </>
                            )}
                            
                            <div className="input-group full-width" style={{ marginTop: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', textTransform: 'none', color: 'var(--text-dark)' }}>
                                    <input 
                                        type="checkbox" 
                                        name="termsAccepted" 
                                        checked={formData.termsAccepted} 
                                        onChange={(e) => { setFormData(prev => ({ ...prev, termsAccepted: e.target.checked })); setErrors(p => ({...p, termsAccepted: null})); }} 
                                        style={{ marginTop: '4px' }}
                                        required
                                    />
                                    <span>Terms and conditions <span className="required-asterisk">*</span><br />
                                    <small style={{ color: 'var(--text-muted)' }}>Eligibility: School teachers, only Nominations. Self nomination or nomination by others Verification: Teaching credentials will be verified Final: Shortlisted teachers must attend the event</small></span>
                                </label>
                                {errors.termsAccepted && <div className="error-text" style={{ marginTop: '10px' }}>{errors.termsAccepted}</div>}
                            </div>
                        </div>
                        <div className="form-footer">
                            <button className="nav-btn btn-back" onClick={() => handleStepChange(2)}>Back</button>
                            <button 
                                className="nav-btn btn-next" 
                                onClick={handleSubmit} 
                                disabled={!formData.termsAccepted || submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="registration-section">
            <div className="registration-container">
                {renderFormBanner()}
                {!submitted && renderStepper()}
                
                <div className="form-content-area" style={{ background: '#f8f9fa' }}>
                    {submitted ? (
                        <div className="success-card">
                            <div className="success-icon">✓</div>
                            <h2 style={{ fontFamily: 'Sneaker', fontSize: '48px', color: 'var(--primary)' }}>Application Received!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '18px', margin: '15px 0' }}>
                                Confirmation emails have been successfully sent to both you and the institution. 
                                Please check your inbox for your registration summary and reference number.
                            </p>
                            
                            <div className="reg-number-display" style={{ 
                                margin: '25px auto', 
                                padding: '15px 30px', 
                                background: 'rgba(59, 130, 246, 0.1)', 
                                border: '1px dashed var(--primary)', 
                                borderRadius: '12px',
                                display: 'inline-block'
                            }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Registration Number</span>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', marginTop: '5px' }}>{regNumber}</div>
                            </div>

                            <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '500px', margin: '20px auto' }}>
                                Thank you for applying to the SSVM Sports Excellence Academy. Our verification team will review your application and get back to you soon.
                            </p>
                            <button className="nav-btn btn-next" onClick={() => window.location.href = '/'}>Return Home</button>
                        </div>
                    ) : (
                        renderStepContent()
                    )}
                </div>
            </div>
        </section>
    );
};

export default RegistrationForm;
