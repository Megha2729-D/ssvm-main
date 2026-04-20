import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import '../assets/registration/LoginPage.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if already logged in
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
            return;
        }

        // Entrance animation
        gsap.fromTo(cardRef.current, 
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }
        );
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('https://new.ssvmtransformingindia.com/public/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Store token and user info
                localStorage.setItem('token', result.access_token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                alert(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-section">
            <div className="login-card" ref={cardRef}>
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="name@company.com" 
                            value={credentials.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <div className="input-container">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                id="password" 
                                name="password" 
                                placeholder="••••••••" 
                                value={credentials.password}
                                onChange={handleChange}
                                required 
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    
                    <div className="login-options">
                        <label className="remember-me">
                            <input 
                                type="checkbox" 
                                name="remember" 
                                checked={credentials.remember}
                                onChange={handleChange}
                            />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" title="Forgot Password" className="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="login-footer">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
