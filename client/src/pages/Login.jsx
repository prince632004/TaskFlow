import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const { login } = useContext(AuthContext); // Bring in the login function from Context

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); // Clear old errors
    
    // Call our backend API via the context
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message); // If it fails, show the error on screen
    }
  };

  return (
    // Centers the card perfectly on the screen
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* We are using the custom .glass-card class we made in index.css */}
      <div className="glass-card w-full max-w-md p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to manage your tasks</p>
        </div>

        {/* Display error message if there is one */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="input-field" // Custom CSS class
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3 mt-4">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
