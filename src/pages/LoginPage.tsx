import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import { LoginForm } from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      const data = await loginUser(username, password);
      login(data.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <LoginForm onLogin={handleLogin} error={error} />
    </div>
  );
};

export default LoginPage;
