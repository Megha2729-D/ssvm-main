import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RegistrationForm from '../Component/RegistrationForm';

const RegistrationPage = () => {
    const location = useLocation();
    const hasCategory = new URLSearchParams(location.search).get('category');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!hasCategory) {
            window.location.href = '/';
        }
    }, [hasCategory]);

    if (!hasCategory) {
        return null; // Redirecting...
    }

    return (
        <div className="registration-page-wrapper">
            {/* Professional Mesh Background */}
            <div className="page-hero-bg" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(at 0% 0%, rgba(99, 21, 66, 0.03) 0%, transparent 50%), radial-gradient(at 100% 0%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>
 
            <div className="registration-content-wrapper" style={{ 
                position: 'relative', 
                zIndex: 1,
                flex: 1
            }}>
                <div className="registration-form-container">
                    <RegistrationForm />
                </div>
            </div>
            
        </div>
    );
};

export default RegistrationPage;
