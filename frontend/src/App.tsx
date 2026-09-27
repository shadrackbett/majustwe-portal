import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';

// Import Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Constitution from './pages/Constitution';
import FAQ from './pages/FAQ';
import Brochure from './pages/Brochure';
import MembershipForm from './pages/MembershipForm';
import CompleteProfile from './pages/CompleteProfile';
import PaymentGateway from './pages/PaymentGateway';
import MemberDashboard from './pages/MemberDashboard';
import TreasurerDashboard from './pages/TreasurerDashboard';
import SecretaryDashboard from './pages/SecretaryDashboard';

// Custom CSS for animations
import './App.css';

function AppContent() {
  const { user, loading, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-majustwe-blue"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-50 relative overflow-x-hidden">
      {/* Decorative background blobs for glassmorphism contrast */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-majustwe-lightBlue rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-majustwe-lime rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-majustwe-sun rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="print:hidden bg-white/40 backdrop-blur-md border-b border-white/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src="/logo.png" alt="MAJUSTWE Logo" className="h-14 w-14 object-contain mr-3 drop-shadow-md" />
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-majustwe-blue drop-shadow-sm">MAJUSTWE</h1>
                  <p className="hidden md:block text-xs font-bold text-majustwe-blue/80 uppercase tracking-wider">Matuga Junior Schools Teachers Welfare</p>
                </div>
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
                  <Link to="/" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">Home</Link>
                  <Link to="/faq" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">FAQ</Link>
                  {user && (
                    <Link to="/constitution" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">Constitution</Link>
                  )}
                  {user ? (
                  <>
                    <span className="text-sm font-medium text-gray-700 mr-2">Welcome, {user.username}</span>
                    {user.role === 'MEMBER' ? (
                      <Link to="/member" className="text-sm font-bold text-majustwe-blue hover:text-majustwe-lime transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/60 shadow-sm hover:shadow">My Dashboard</Link>
                    ) : (
                      <div className="flex space-x-2">
                        <Link to="/member" className="text-sm font-bold text-gray-600 hover:text-majustwe-blue transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow">Personal View</Link>
                        <Link to={`/${user.role.toLowerCase()}`} className="text-sm font-bold text-white bg-majustwe-blue hover:bg-blue-800 transition-colors px-4 py-2 rounded-full shadow-md hover:shadow-lg">Official Operations</Link>
                      </div>
                    )}
                    <button onClick={logout} className="text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 transition-colors bg-red-50/50 px-4 py-2 rounded-full backdrop-blur-sm border border-red-100 ml-2">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-bold text-majustwe-blue hover:text-blue-900 transition-colors bg-white/50 px-5 py-2 rounded-full backdrop-blur-sm border border-white/60 shadow-sm hover:shadow">Sign In</Link>
                    <Link to="/register" className="text-sm font-bold bg-majustwe-lime/90 text-white px-5 py-2 rounded-full backdrop-blur-md hover:bg-majustwe-darkLime transition-all shadow-md hover:shadow-lg border border-white/20">Join Now</Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-majustwe-blue hover:text-majustwe-lime focus:outline-none p-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/60"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-white/60 px-4 pt-2 pb-4 space-y-2 shadow-lg">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-100">Home</Link>
                <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-100">FAQ</Link>
                {user && (
                  <Link to="/constitution" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-100">Constitution</Link>
                )}
                {user ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-gray-700 border-t border-b border-gray-200 my-2">Welcome, {user.username}</div>
                  
                  {user.role === 'MEMBER' ? (
                    <Link to="/member" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-majustwe-blue hover:bg-majustwe-lime/20">My Dashboard</Link>
                  ) : (
                    <>
                      <Link to="/member" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-100">Personal View</Link>
                      <Link to={`/${user.role.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-white bg-majustwe-blue hover:bg-blue-800 my-1">Official Operations</Link>
                    </>
                  )}

                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-red-600 hover:bg-red-50 border-t border-gray-100 mt-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-majustwe-blue hover:bg-majustwe-lime/20">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-majustwe-lime hover:bg-majustwe-lime/20">Join Now</Link>
                </>
              )}
            </div>
          )}
        </nav>
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:max-w-none">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                <Route path="/constitution" element={user ? <Constitution /> : <Navigate to="/login" replace />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/join-us" element={<Brochure />} />
                <Route path="/membership-form" element={<MembershipForm />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/pay/:caseId" element={user ? <div className="p-6"><PaymentGateway /></div> : <Navigate to="/login" replace />} />
              
              {/* Protected Routes */}
              <Route path="/member" element={user ? <div className="p-6"><MemberDashboard /></div> : <Navigate to="/login" replace />} />
              <Route path="/treasurer" element={user ? <div className="p-6"><TreasurerDashboard /></div> : <Navigate to="/login" replace />} />
              <Route path="/secretary" element={user ? <div className="p-6"><SecretaryDashboard /></div> : <Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <Router>
          <AppContent />
        </Router>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
