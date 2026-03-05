import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginScreen.css';

export default function LoginScreen() {
    const [step, setStep] = useState('email'); // email | otp | success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(59);
    const { login } = useAuth();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:5000/api';

    const handleGetOTP = async (e) => {
        e.preventDefault();
        if (!email) { setError('Please enter your email'); return; }
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'User not found'); return; }

            setStep('otp');
            // Start countdown
            let t = 59;
            const interval = setInterval(() => {
                t--;
                setTimer(t);
                if (t <= 0) clearInterval(interval);
            }, 1000);
        } catch (err) {
            setError('Server unavailable. Please try again.');
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Auto-focus next
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 4) { setError('Please enter 4-digit OTP'); return; }

        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: code })
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Invalid OTP'); return; }

            login(data.user, data.token);
            setStep('success');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setError('Server unavailable. Please try again.');
        }
    };

    if (step === 'success') {
        return (
            <div className="login-page">
                <div className="success-modal fade-in">
                    <div className="success-check">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                            <circle cx="30" cy="30" r="28" fill="#28a745" stroke="#28a745" strokeWidth="2" />
                            <path d="M18 30l8 8 16-16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2>Logged in Successfully!</h2>
                    <button className="btn btn-primary btn-full" onClick={() => navigate('/dashboard')}>Ok</button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-content fade-in">
                <div className="login-logo">
                    <img src="/logo-blue.svg" alt="FCMS 360" className="login-logo-img" />
                </div>
                <h2 className="login-brand">FACADE CONSTRUCTION</h2>
                <p className="login-brand-sub">
                    <span className="login-line"></span>
                    Management System
                    <span className="login-line"></span>
                </p>

                <div className="login-card">
                    {step === 'email' ? (
                        <>
                            <h3 className="login-heading">SIGN IN</h3>
                            <p className="login-desc">Login to check the latest</p>
                            <form onSubmit={handleGetOTP}>
                                <label className="login-label">Email ID</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="ex. rajesh@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className="login-forgot">Forgot Password?</p>
                                {error && <p className="login-error">{error}</p>}
                                <button type="submit" className="btn btn-primary btn-full mt-lg">Get OTP</button>
                            </form>
                            <div className="login-secure">
                                <svg width="14" height="14" fill="none" stroke="#28a745" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <span>100% Secure</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="login-heading">SIGN IN</h3>
                            <p className="login-desc">Login to check the latest</p>
                            <p className="login-otp-sent">OTP sent to <strong>{email}</strong></p>
                            <label className="login-label">Enter OTP</label>
                            <form onSubmit={handleVerifyOTP}>
                                <div className="otp-boxes">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            className="otp-input"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        />
                                    ))}
                                </div>
                                <div className="otp-footer">
                                    <span className="otp-resend">Didn't received code?</span>
                                    <span className="otp-timer">Resend in <strong>00:{String(timer).padStart(2, '0')}</strong></span>
                                </div>
                                {error && <p className="login-error">{error}</p>}
                                <button type="submit" className="btn btn-primary btn-full mt-lg">Continue</button>
                            </form>
                            <button className="login-back" onClick={() => setStep('email')}>← Go Back</button>
                        </>
                    )}
                </div>
            </div>
            <p className="login-footer">© 2025 Copyrights Reserved FCMS 360</p>
        </div>
    );
}
