import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register, sendOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation: 1 uppercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least one uppercase letter, one number, and one special character');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    }
    setLoading(false);
  }

  // Step 2: Verify and Register
  async function handleRegister(e) {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the 4-digit code');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, otp);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Failed to register');
    }
    setLoading(false);
  }

  // Inline styles
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'var(--bg)',
    color: 'var(--text)',
  };

  const formStyle = {
    width: '90%',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: 'var(--surface)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px var(--border)',
    border: '1px solid var(--border)',
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: 'var(--gold)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    backgroundColor: 'var(--surface-secondary)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    fontSize: '1rem',
    textAlign: step === 2 ? 'center' : 'left',
    letterSpacing: step === 2 ? '10px' : 'normal',
  };

  const passwordContainerStyle = {
    position: 'relative',
    width: '100%',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '12px',
    top: '37%', // adjusted for margin-bottom
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    zIndex: 2,
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor: 'var(--gold)',
    color: 'black',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '15px',
    fontSize: '0.9rem',
  };

  const linkStyle = {
    color: 'var(--gold)',
    textDecoration: 'underline',
  };

  const textStyle = {
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '0.9rem',
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={step === 1 ? handleSendOtp : handleRegister} style={formStyle}>
        <h1 style={headingStyle}>{step === 1 ? 'Create Account' : 'Verify Email'}</h1>

        {step === 2 && (
          <p style={{ ...textStyle, marginBottom: '20px', color: 'var(--text-muted)' }}>
            We've sent a 4-digit code to <b>{email}</b>
          </p>
        )}

        {error && <p style={errorStyle}>{error}</p>}

        {step === 1 ? (
          <>
            <input
              style={inputStyle}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div style={passwordContainerStyle}>
              <input
                style={{ ...inputStyle, paddingRight: '45px' }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={toggleButtonStyle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </>
        ) : (
          <input
            style={inputStyle}
            placeholder="0000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            required
          />
        )}

        <button style={buttonStyle} disabled={loading}>
          {loading ? 'Processing...' : step === 1 ? 'Send Code' : 'Verify & Register'}
        </button>

        {step === 2 && (
          <p style={textStyle}>
            Didn't get a code? <button type="button" onClick={handleSendOtp} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Resend</button>
          </p>
        )}

        <p style={textStyle}>
          {step === 1 ? (
            <>Already have an account? <Link to="/login" style={linkStyle}>Login</Link></>
          ) : (
            <button type="button" onClick={() => setStep(1)} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Go Back</button>
          )}
        </p>
      </form>
    </div>
  );
}
