import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [dependents, setDependents] = useState([{ name: '', relationship: '' }]);
  const [guardians, setGuardians] = useState([{ name: '', relationship: '', phone: '' }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to submit details and move status to PENDING_SECRETARY
    alert("Details submitted! Waiting for Secretary approval.");
    navigate('/login');
  };

  const addDependent = () => {
    if (dependents.length < 4) {
      setDependents([...dependents, { name: '', relationship: '' }]);
    }
  };

  const addGuardian = () => {
    if (guardians.length < 2) {
      setGuardians([...guardians, { name: '', relationship: '', phone: '' }]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-extrabold text-majustwe-blue mb-2">Complete Membership Details</h2>
        <p className="text-gray-600 mb-8">Phase 2: Your registration fee has been approved! Please provide your beneficiary details.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Spouse Details */}
          <div className="bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm">
            <h3 className="text-xl font-bold text-majustwe-blue mb-4">Spouse Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Spouse Full Name" />
              <input type="text" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Spouse Phone Number" />
            </div>
          </div>

          {/* Guardian Details */}
          <div className="bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-majustwe-blue">Guardians (Max 2)</h3>
              {guardians.length < 2 && (
                <button type="button" onClick={addGuardian} className="text-sm bg-majustwe-blue text-white px-3 py-1 rounded-lg hover:bg-blue-900">+ Add Guardian</button>
              )}
            </div>
            {guardians.map((g, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input type="text" required className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Full Name" />
                <input type="text" required className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Relationship" />
                <input type="text" required className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Phone Number" />
              </div>
            ))}
          </div>

          {/* Dependents */}
          <div className="bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-majustwe-blue">Dependents (Max 4)</h3>
              {dependents.length < 4 && (
                <button type="button" onClick={addDependent} className="text-sm bg-majustwe-blue text-white px-3 py-1 rounded-lg hover:bg-blue-900">+ Add Dependent</button>
              )}
            </div>
            {dependents.map((d, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" required className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder={`Dependent ${index + 1} Name`} />
                <input type="text" required className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime sm:text-sm bg-white/80" placeholder="Relationship" />
              </div>
            ))}
          </div>

          {/* Declaration */}
          <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-200">
            <label className="flex items-start space-x-3">
              <input type="checkbox" required className="mt-1 h-5 w-5 text-majustwe-lime focus:ring-majustwe-lime border-gray-300 rounded" />
              <span className="text-sm text-gray-700 italic">"I hereby declare that the above information is true to the best of my knowledge and I agree to abide by the constitution, rules, and regulations of MAJUSTWE."</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-majustwe-lime to-majustwe-darkLime text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20">
            Submit Final Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
