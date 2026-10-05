import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DatabaseContext } from '../context/DatabaseContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { members } = useContext(DatabaseContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      if (user.role === 'MEMBER') navigate('/member');
      else if (user.role === 'TREASURER') navigate('/treasurer');
      else if (user.role === 'SECRETARY') navigate('/secretary');
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // We get the form elements directly
    const form = e.target as HTMLFormElement;
    const name = (form.elements[0] as HTMLInputElement).value;
    const idNumber = (form.elements[2] as HTMLInputElement).value;
    const phone = (form.elements[3] as HTMLInputElement).value;
    const email = (form.elements[4] as HTMLInputElement).value;
    const member_type = (form.elements[6] as HTMLSelectElement).value;
    const zone = (form.elements[7] as HTMLSelectElement).value;
    const password = (form.elements[8] as HTMLInputElement).value;
    const confirmPassword = (form.elements[9] as HTMLInputElement).value;
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    const nameParts = name.split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ');
    // Use the ID Number as their unique username for logging in
    const username = idNumber;

    try {
      await api.post('/auth/register/', {
        username,
        password,
        first_name,
        last_name,
        email,
        phone,
        member_type,
        zone
      });
      alert('Registration Submitted! Please sign in using your ID Number (' + username + ') as your username.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      const serverMsg = err.response?.data?.error || err.response?.data?.detail || 'Username or email might be taken.';
      alert('Registration failed: ' + serverMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] py-12">
      <div className="max-w-md w-full space-y-8 bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/80">
        <div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src="/logo.png" alt="MAJUSTWE Logo" className="h-20 w-auto drop-shadow-md rounded-full" />
            <h2 className="text-center text-3xl font-extrabold text-majustwe-blue">
              Join MAJUSTWE
            </h2>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill in your details to apply for membership.
          </p>
          <div className="mt-4 flex justify-center hidden sm:flex flex-col items-center">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="Scan QR Code" className="rounded-lg shadow-sm mb-1" />
             <p className="text-xs text-gray-500">Scan to view on mobile</p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Full Name" />
              <select required defaultValue="" className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80">
                <option value="" disabled>Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="ID Number" />
              <input type="text" required className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Phone Number" />
            </div>

            <input type="email" required className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Email Address" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Current School / Workstation" />
              <select required defaultValue="" className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80">
                <option value="" disabled>Member Type</option>
                <option value="FULL">Full Member</option>
                <option value="ASSOCIATE">Associate Member</option>
                <option value="HONORARY">Honorary Member</option>
              </select>
            </div>

            <select required defaultValue="" className="appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80">
              <option value="" disabled>Zone</option>
              <option value="TSIMBA_TIWI">Tsimba-Tiwi</option>
              <option value="NGOMBENI_WAA">Ngombeni-Waa</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <input type="password" required className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Password" />
              <input type="password" required className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Confirm Password" />
            </div>
          </div>

          <div className="text-sm text-gray-700 bg-blue-50/80 backdrop-blur-sm p-4 rounded-lg border border-blue-200 shadow-sm">
            <strong>Next Step:</strong> After submitting Phase 1, you must pay Ksh 100 registration and Ksh 500 Emergency Kitty. Once the Treasurer confirms, you will receive a link to complete Phase 2 (Guardians, Spouse, Dependents).
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-majustwe-lime hover:bg-majustwe-darkLime focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-majustwe-lime transition-colors">
              Submit Application
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-majustwe-blue hover:text-blue-900">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
