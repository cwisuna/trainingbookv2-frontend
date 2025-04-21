export async function LoginUser(username: string, password: string): Promise<{ token: string }> {
    const res = await fetch('https://localhost:44342/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Login failed.');
    }
  
    return await res.json();
  }
  