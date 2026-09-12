import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DatabaseContext } from '../context/DatabaseContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { members } = useContext(DatabaseContext);
  
  // Default to the first member in the DB
  const [selectedUserId, setSelectedUserId] = useState<number>(members[0]?.id || 1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = members.find(m => m.id === selectedUserId);
    if(!user) return;

    login(user.name, user.id, user.role);
    
    if (user.role === 'MEMBER') navigate('/member');
    else if (user.role === 'TREASURER') navigate('/treasurer');
    else if (user.role === 'SECRETARY') navigate('/secretary');
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
          
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="text-sm font-bold text-yellow-800 mb-2">Simulate Login (Dev Mode)</p>
            <p className="text-xs text-yellow-700 mb-4">Select an existing account from the database to log in as.</p>
            <select 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(Number(e.target.value))} 
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm rounded-md border"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role}) - {m.status}</option>
              ))}
            </select>
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
