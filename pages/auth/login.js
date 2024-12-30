// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
// export const supabase = createClient(supabaseUrl, supabaseKey);

// Corrected pages/auth/login.js
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Ensure this is the only import for supabase

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-xl mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-4 p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
        <p className="mt-4 text-sm">
          Don't have an account? <a href="/auth/register" className="text-blue-500">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;