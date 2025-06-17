import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '0.95rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '0.75rem 1rem',
    backgroundColor: loading ? '#9ca3af' : '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s ease',
    marginTop: '0.5rem'
  };

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: '1px solid #fecaca',
    marginBottom: '1rem'
  };

  const successStyle = {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: '1px solid #bbf7d0',
    marginBottom: '1rem'
  };

  const loginLinkStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#6b7280',
    fontSize: '0.9rem'
  };

  const linkStyle = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#059669';
    e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  const handleButtonHover = (e) => {
    if (!loading) {
      e.target.style.backgroundColor = '#047857';
    }
  };

  const handleButtonLeave = (e) => {
    if (!loading) {
      e.target.style.backgroundColor = '#059669';
    }
  };

  const handleLinkHover = (e) => {
    e.target.style.textDecoration = 'underline';
  };

  const handleLinkLeave = (e) => {
    e.target.style.textDecoration = 'none';
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Create Account</h2>
          <p style={subtitleStyle}>Please fill in your information to get started</p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {success && (
          <div style={successStyle}>
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSignup} style={formStyle}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            style={inputStyle}
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            style={inputStyle}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            style={inputStyle}
            required
          />
          
          <button
            type="submit"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            style={buttonStyle}
            disabled={loading || success}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={loginLinkStyle}>
          Already have an account?{' '}
          <Link 
            to="/" 
            style={linkStyle}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;