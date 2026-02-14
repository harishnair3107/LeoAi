import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
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
    color: 'var(--gold)', // gold
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
  };

  const passwordContainerStyle = {
    position: 'relative',
    width: '100%',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
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
    marginTop: '-8px', // offset for margin-bottom of input
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor: 'var(--gold)', // gold
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
      <form onSubmit={handleLogin} style={formStyle}>
        <h1 style={headingStyle}>Welcome Back</h1>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={passwordContainerStyle}>
          <input
            style={{ ...inputStyle, paddingRight: '45px' }}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <button style={buttonStyle} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={textStyle}>
          New? <Link to="/register" style={linkStyle}>Create account</Link>
        </p>
      </form>
    </div>
  );
}
