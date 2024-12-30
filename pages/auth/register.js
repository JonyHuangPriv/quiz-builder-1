import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Registration successful! Please check your email to confirm your sign up.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleRegister}>
        <h2 className="text-xl mb-4">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Register</button>
        <p className="mt-4 text-sm">
          Already have an account? <a href="/auth/login" className="text-blue-500">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
