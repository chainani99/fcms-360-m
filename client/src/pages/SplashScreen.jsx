import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SplashScreen.css';

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        navigate(isAuthenticated ? '/dashboard' : '/login');
                    }, 300);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);
        return () => clearInterval(timer);
    }, [navigate, isAuthenticated]);

    return (
        <div className="splash">
            <div className="splash-content">
                <div className="splash-logo">
                    <img src="/logo-blue.svg" alt="FCMS 360" className="splash-logo-img" />
                </div>
                <h1 className="splash-title">FACADE CONSTRUCTION</h1>
                <p className="splash-subtitle">
                    <span className="splash-line"></span>
                    Management System
                    <span className="splash-line"></span>
                </p>
                <div className="splash-progress-container">
                    <div className="splash-progress">
                        <div className="splash-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="splash-loading">LOADING</span>
                </div>
            </div>
            <p className="splash-footer">© 2025 Copyrights Reserved FCMS 360</p>
        </div>
    );
}
