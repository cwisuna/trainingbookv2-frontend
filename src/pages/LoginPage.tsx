import React, { useState } from 'react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:44342/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Login failed');
            }

            const data = await response.json();
            console.log('JWT Token:', data.token);
            console.log('Expires:', data.expiration);

            // TODO: Store token securely (e.g., keytar or Electron's secure storage)
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '300px',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 style={{ textAlign: 'center' }}>Login</h2>

                {error && (
                    <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <label htmlFor="username" style={{ marginBottom: '8px' }}>
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        padding: '10px',
                        marginBottom: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                    required
                />
                <label htmlFor="password" style={{ marginBottom: '8px' }}>
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: '10px',
                        marginBottom: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                    required
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
