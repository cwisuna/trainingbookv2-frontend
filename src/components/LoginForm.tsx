import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  error: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={titleStyle}>Login</h2>

      {error && <div style={errorStyle}>{error}</div>}

      <label htmlFor="username" style={labelStyle}>
        Username
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />

      <label htmlFor="password" style={labelStyle}>
        Password
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <button type="submit" style={buttonStyle}>
        Login
      </button>
    </form>
  );
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  marginBottom: '10px',
  textAlign: 'center',
};

const labelStyle: React.CSSProperties = {
  marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  marginBottom: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
