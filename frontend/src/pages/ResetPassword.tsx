import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const token = queryParams.get('token');

  useEffect(() => {
    if (!uid || !token) {
      setStatus('error');
      setMessage('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }
    
    setStatus('loading');
    if (status === 'loading') return;
    try {
      const res = await api.post('/auth/password-reset-confirm/', { 
        uid, 
        token, 
        new_password: newPassword 
      });
      setMessage(res.data.detail || 'Password has been reset successfully. Redirecting to login...');
      setStatus('success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2500);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'The reset link is invalid or has expired.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-majustwe-blue drop-shadow-sm">
            Set New Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {status === 'success' ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline mb-4">{message}</span>
              <br/>
              <Link to="/login" className="inline-block mt-2 font-bold text-white bg-majustwe-lime px-4 py-2 rounded-lg hover:bg-majustwe-darkLime transition-colors">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{message}</span>
                </div>
              )}
              {uid && token && (
                <div className="space-y-4">
                  <div>
                    <label className="sr-only">New Password</label>
                    <input
                      type="password"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime focus:z-10 sm:text-sm bg-white/70 backdrop-blur-sm"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="sr-only">Confirm Password</label>
                    <input
                      type="password"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime focus:z-10 sm:text-sm bg-white/70 backdrop-blur-sm"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-majustwe-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-majustwe-lime transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Saving...' : 'Reset Password'}
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
