import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRegister } from '../../services/api';
import './Auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetchRegister({ userId: username, password });
      if (response.status === 201) {
        localStorage.setItem('registered', 'true');
        navigate('/');
      }else {
        setError('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Registration failed');
    }
  };

  const handleLoginNavigation = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button type="submit" className="auth-button">Register</button>
          <button type="button" onClick={handleLoginNavigation} className="auth-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;