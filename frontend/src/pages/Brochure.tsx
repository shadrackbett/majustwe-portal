import React from 'react';
import { Link } from 'react-router-dom';

const Brochure: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden max-w-5xl mx-auto my-8 border border-white/60">
      
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <img src="/images/photo2.jpg" alt="MAJUSTWE Community" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-majustwe-blue/90 via-majustwe-blue/40 to-transparent flex flex-col justify-end p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg">🌟 Join MAJUSTWE! 🌟</h1>
          <h2 className="text-xl md:text-2xl text-majustwe-lime font-bold drop-shadow-md">Matuga Junior Schools Teachers' Welfare</h2>
          <p className="mt-4 text-lg md:text-xl font-medium text-white max-w-2xl drop-shadow-md">
            "Empowering Teachers, Building a Stronger Community"
          </p>
        </div>
      </div>

      <div className="p-6 md:p-12">
        <div className="prose prose-lg max-w-none text-gray-800">
          
          <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-majustwe-blue mb-4">What is MAJUSTWE?</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                We are a dedicated collective of teachers from Matuga Junior Schools, brought together by our shared responsibilities and the deep need to promote unity, mutual support, and professional well-being. Whether it's supporting each other in times of difficulty or celebrating together in moments of joy at our beach retreats, <strong>MAJUSTWE</strong> ensures no teacher walks alone.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <img src="/images/photo1.jpg" alt="Welfare Gathering" className="rounded-2xl shadow-md w-full h-48 object-cover transform hover:scale-105 transition-transform" />
              <img src="/images/photo5.jpg" alt="Meeting" className="rounded-2xl shadow-md w-full h-48 object-cover mt-8 transform hover:scale-105 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-blue-50 p-8 rounded-3xl shadow-sm border border-blue-100">
              <h4 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">🛡️</span> Financial Protection
              </h4>
              <ul className="space-y-4 text-gray-700 text-lg">
                <li className="flex items-start"><span className="text-majustwe-lime mr-2">✔</span> <strong>Bereavement:</strong> Up to Kshs. 500 for the loss of a principal member or spouse.</li>
                <li className="flex items-start"><span className="text-majustwe-lime mr-2">✔</span> <strong>Health & Safety:</strong> Kshs. 400 support during prolonged chronic diseases or severe accidents.</li>
                <li className="flex items-start"><span className="text-majustwe-lime mr-2">✔</span> <strong>Calamity Relief:</strong> Kshs. 400 support during natural disasters like fires or floods.</li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-3xl shadow-sm border border-green-100">
              <h4 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <span className="text-3xl mr-3">💻</span> Modern Digital Portal
              </h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                Say goodbye to lost records and manual paperwork! Our state-of-the-art web portal allows you to easily track your contributions, view real-time welfare minutes, and manage your official dependents and beneficiaries at the click of a button. Transparency has never been this easy!
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-12 items-center mb-12">
            <div className="flex-1">
               <img src="/images/photo4.jpg" alt="Food & Fun" className="rounded-3xl shadow-lg w-full h-80 object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-majustwe-blue mb-4">📋 Who Can Join?</h3>
              <p className="text-gray-700 text-lg mb-6">Membership is open to <strong>all willing teachers</strong> teaching in junior schools within the Matuga sub-county!</p>
              <ul className="grid grid-cols-1 gap-4 font-bold text-lg text-majustwe-blue">
                <li className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex items-center"><span className="w-3 h-3 rounded-full bg-majustwe-lime mr-4"></span>Permanent & Pensionable (PnP)</li>
                <li className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex items-center"><span className="w-3 h-3 rounded-full bg-majustwe-lime mr-4"></span>Intern Teachers</li>
                <li className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex items-center"><span className="w-3 h-3 rounded-full bg-majustwe-lime mr-4"></span>B.O.M. Teachers</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-majustwe-blue text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden mt-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32 pointer-events-none"></div>
            
            <h3 className="text-4xl font-extrabold mb-4 relative z-10">🚀 Ready to Join Us?</h3>
            <p className="mb-10 relative z-10 text-blue-100 text-xl max-w-2xl mx-auto">Joining is simple, affordable, and transparent. Become a part of the family today!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-10 relative z-10">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
                <span className="block text-3xl font-bold mb-2">Kshs. 100</span>
                <span className="text-lg text-blue-200">One-time registration fee</span>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
                <span className="block text-3xl font-bold mb-2">Kshs. 500</span>
                <span className="text-lg text-blue-200">Emergency Kitty deposit (Refundable!)</span>
              </div>
            </div>

            <Link to="/register" className="inline-block bg-majustwe-lime hover:bg-majustwe-darkLime text-white font-extrabold text-xl px-12 py-5 rounded-full shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl relative z-10">
              Create Your Account Now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Brochure;
