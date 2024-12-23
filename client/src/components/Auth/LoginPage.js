import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogin, fetchFacebookAuth, fetchGoogleAuth, fetchGithubAuth } from '../../services/api';
import facebookLogo from './assets/facebook-logo.png';
import googleLogo from './assets/google-logo.png';
import githubLogo from './assets/github-logo.png';

import './Auth.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchLogin({ userId: username, password });
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        navigate('/add-product');
      } else {
        setError('Invalid user ID or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid user ID or password');
    }
  };

  const handleRegisterNavigation = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button type="submit" className="auth-button">Login</button>
          <button type="button" onClick={handleRegisterNavigation} className="auth-button">Register</button>
        </div>
      </form>
      <hr />
      <div className="social-login">
        <button onClick={fetchFacebookAuth} className="social-button">
          <img src={facebookLogo} alt="Facebook Logo" className="social-logo" />
          Login with Facebook
        </button>
        <button onClick={fetchGoogleAuth} className="social-button">
          <img src={googleLogo} alt="Google Logo" className="social-logo" />
          Login with Google
        </button>
        <button onClick={fetchGithubAuth} className="social-button">
          <img src={githubLogo} alt="GitHub Logo" className="social-logo" />
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginPage;