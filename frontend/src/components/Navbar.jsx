import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import leoLogo from '../assets/leo.png';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem clamp(1rem, 5vw, 2rem)',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
    };

    const brandContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        cursor: 'pointer',
    };

    const brandStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'var(--gold)',
        letterSpacing: '1px',
    };

    const iconStyle = {
        width: '36px',
        height: '36px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.3))',
    };

    const rightSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    };

    const themeButtonStyle = {
        padding: '8px',
        borderRadius: '50%',
        border: '1px solid var(--border)',
        backgroundColor: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
    };

    const logoutButtonStyle = {
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid var(--gold)',
        backgroundColor: 'transparent',
        color: 'var(--gold)',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
    };

    return (
        <nav style={navStyle}>
            <div style={brandContainerStyle} onClick={() => navigate('/')}>
                <img src={leoLogo} alt="LeoAi Logo" style={iconStyle} />
                <div style={brandStyle}>LeoAi</div>
            </div>
            <div style={rightSectionStyle}>
                <button
                    style={themeButtonStyle}
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                {user && (
                    <button
                        style={logoutButtonStyle}
                        onClick={handleLogout}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'var(--gold)';
                            e.target.style.color = 'black';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'var(--gold)';
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
