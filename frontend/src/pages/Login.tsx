import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import jwt_decode from 'jwt-decode';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  
  useEffect(() => {
    if (user) {
      if (user.role === 'MEMBER') navigate('/member');
      else if (user.role === 'TREASURER') navigate('/treasurer');
      else if (user.role === 'SECRETARY') navigate('/secretary');
    }
  }, [user, navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/auth/token/', { username: username.trim(), password: password.trim() });
      const token = response.data.access;
      const decoded: any = jwt_decode(token);
      
      login(token, decoded.user_id, decoded.role, decoded.username);
      
      if (decoded.role === 'MEMBER') navigate('/member');
      else if (decoded.role === 'TREASURER') navigate('/treasurer');
      else if (decoded.role === 'SECRETARY') navigate('/secretary');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="max-w-md w-full space-y-8 bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/80">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-majustwe-blue">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          
          {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm text-center">{error}</div>}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime focus:z-10 sm:text-sm" placeholder="Username or ID Number" />
            </div>
            <div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div className="flex items-center justify-end mt-2">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-bold text-majustwe-blue hover:text-blue-900">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-majustwe-blue hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-majustwe-blue transition-colors">
              Sign In
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Not a member yet?{' '}
              <Link to="/register" className="font-medium text-majustwe-lime hover:text-majustwe-darkLime">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
