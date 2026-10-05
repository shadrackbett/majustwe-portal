import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.post('/auth/password-reset/', { username });
      setMessage(res.data.detail || 'If an account with this ID Number exists and has a registered email, a reset link has been sent.');
      setStatus('success');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'An error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60">
        <div>
          <img className="mx-auto h-20 w-auto drop-shadow-md" src="/logo.png" alt="MAJUSTWE Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-majustwe-blue drop-shadow-sm">
            Recover Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your ID Number and we will send a password reset link to your registered email address.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {status === 'success' ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{message}</span>
                </div>
              )}
              <div>
                <label htmlFor="id-number" className="sr-only">ID Number</label>
                <input
                  id="id-number"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime focus:z-10 sm:text-sm bg-white/70 backdrop-blur-sm"
                  placeholder="ID Number"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-majustwe-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-majustwe-lime transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </>
          )}
          <div className="text-center mt-4">
            <Link to="/login" className="font-medium text-majustwe-lime hover:text-majustwe-darkLime transition-colors">
              Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
