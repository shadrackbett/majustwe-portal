import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-12">
      {/* Hero Section */}
      <div className="w-full max-w-5xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-16 text-center transform transition-all hover:scale-[1.01]">
        <img src="/logo.png" alt="MAJUSTWE Logo" className="h-40 w-auto mx-auto mb-8 drop-shadow-xl animate-pulse-slow" />
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-majustwe-blue to-majustwe-darkLime mb-6 drop-shadow-sm">
          Welcome to MAJUSTWE
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
          Empowering educators across Matuga Subcounty through transparent financial assistance, community solidarity, and mutual support.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/register" className="bg-gradient-to-r from-majustwe-lime to-majustwe-darkLime text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl border border-white/20">
            Join the Welfare Today
          </Link>
          <Link to="/login" className="bg-white/60 backdrop-blur-md text-majustwe-blue font-bold text-lg py-4 px-10 rounded-full shadow border border-white/80 transition-all transform hover:-translate-y-1 hover:bg-white hover:shadow-md">
            Member Login
          </Link>
        </div>
      </div>

      {/* About Us Section */}
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-majustwe-blue mb-4">About MAJUSTWE</h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-lg">
            The Matuga Junior Schools Teachers Welfare Association (MAJUSTWE) unites educators across the nearly 50 schools in Matuga Subcounty. We foster unity, financial security, and mutual support, acting as a reliable safety net during unforeseen emergencies and bereavements.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Our members are drawn from the Tsimba-Tiwi and Ngombeni-Waa zones. By pooling our resources, we ensure that no educator stands alone.
          </p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-majustwe-blue/10 to-majustwe-lime/10 p-6 rounded-2xl border border-white/50 text-center shadow-inner">
           <h3 className="text-xl font-bold text-majustwe-blue mb-4">Membership Types</h3>
           <ul className="text-gray-700 text-left space-y-4 font-medium">
             <li className="flex items-start">
                <span className="text-majustwe-lime text-2xl mr-3 leading-none">✓</span> 
                <div><strong>Full Member:</strong> Active teachers within Matuga Subcounty.</div>
             </li>
             <li className="flex items-start">
                <span className="text-majustwe-lime text-2xl mr-3 leading-none">✓</span> 
                <div><strong>Associate Member:</strong> Former full members now working elsewhere or in allied welfares.</div>
             </li>
             <li className="flex items-start">
                <span className="text-majustwe-lime text-2xl mr-3 leading-none">✓</span> 
                <div><strong>Honorary Member:</strong> Conferred by vote of the welfare.</div>
             </li>
           </ul>
        </div>
      </div>

      {/* Public Info Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="p-8 bg-white/40 backdrop-blur-lg rounded-2xl border border-white/60 shadow-xl text-center group hover:bg-white/60 transition-all">
          <div className="w-16 h-16 bg-gradient-to-br from-majustwe-blue to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md transform group-hover:rotate-12 transition-transform">1</div>
          <h3 className="text-2xl font-bold text-majustwe-blue mb-4">Registration</h3>
          <p className="text-gray-700 leading-relaxed">A one-time registration fee of Ksh 100 and a baseline Emergency Kitty deposit of Ksh 500 makes you a fully recognized active member.</p>
        </div>
        <div className="p-8 bg-white/40 backdrop-blur-lg rounded-2xl border border-white/60 shadow-xl text-center group hover:bg-white/60 transition-all">
          <div className="w-16 h-16 bg-gradient-to-br from-majustwe-lime to-majustwe-darkLime text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md transform group-hover:rotate-12 transition-transform">2</div>
          <h3 className="text-2xl font-bold text-majustwe-blue mb-4">Contributions</h3>
          <p className="text-gray-700 leading-relaxed">Members contribute securely to active welfare cases. Your personalized dashboard tracks all your historical payments transparently.</p>
        </div>
        <div className="p-8 bg-white/40 backdrop-blur-lg rounded-2xl border border-white/60 shadow-xl text-center group hover:bg-white/60 transition-all">
          <div className="w-16 h-16 bg-gradient-to-br from-majustwe-sun to-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md transform group-hover:rotate-12 transition-transform">3</div>
          <h3 className="text-2xl font-bold text-majustwe-blue mb-4">Benefits</h3>
          <p className="text-gray-700 leading-relaxed">Access immediate, unbureaucratic financial support during bereavements or emergencies as stipulated by the MAJUSTWE constitution.</p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full text-center py-8 text-gray-500 border-t border-gray-200 mt-auto bg-white/30 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Matuga Junior School Teachers Welfare Association. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
