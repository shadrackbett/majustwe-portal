import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatabaseContext } from '../context/DatabaseContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const PaymentGateway: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { cases, contributions, members, refreshData } = useContext(DatabaseContext);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const caseObj = cases.find(c => c.id === Number(caseId));
  const memberObj = members.find(m => Number(m.user?.id) === Number(user?.id));
  const contribution = contributions.find(c => c.welfare_case === Number(caseId) && c.member === memberObj?.id);

  // Extract Treasurer Number from Case Description if it exists
  let treasurerPhone = "0704532706"; // Default
  if (caseObj && caseObj.description) {
    const match = caseObj.description.match(/MPESA NO:\s*(\d+)/i);
    if (match && match[1]) {
      treasurerPhone = match[1];
    }
  }

  if (!caseObj || !memberObj) {
    return <div className="p-10 text-center text-xl font-bold">Loading payment details...</div>;
  }

  if (contribution?.is_fully_paid) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Cleared!</h2>
        <p className="text-gray-600 mb-6">You have already paid for the <b>{caseObj.title}</b> case.</p>
        <button onClick={() => navigate('/member')} className="bg-majustwe-blue text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-majustwe-lime transition">Return to Dashboard</button>
      </div>
    );
  }

  const submitMpesaCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaCode) return;
    
    setLoading(true);
    try {
      if (contribution) {
        await api.post(`/welfare/contributions/${contribution.id}/submit_mpesa/`, {
          mpesa_reference: mpesaCode
        });
        await refreshData();
        setStatus('SUCCESS');
      }
    } catch (err) {
      setStatus('ERROR');
      alert("Failed to submit M-Pesa code. Please try again.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(treasurerPhone);
    alert(`Copied Treasurer Number: ${treasurerPhone}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
      
      {/* Decorative M-Pesa green accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Make a Payment</h2>
      
      <div className="bg-gray-50 rounded-xl p-6 text-left mb-6 border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Paying for Case</p>
        <p className="font-bold text-lg text-majustwe-blue mb-4">{caseObj.title}</p>
        
        <p className="text-sm text-gray-500 mb-1">Amount Due</p>
        <p className="font-extrabold text-3xl text-green-600 mb-2">Ksh {caseObj.required_amount}</p>
      </div>

      {status === 'IDLE' && (
        <>
          <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-2">Step 1: Send Money</h3>
            <p className="text-sm text-blue-800 mb-3">Send exactly <b>Ksh {caseObj.required_amount}</b> to the Treasurer's M-Pesa number.</p>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200 mb-3">
              <span className="font-mono font-bold text-lg tracking-wider">{treasurerPhone}</span>
              <button onClick={copyToClipboard} className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded font-bold transition">Copy</button>
            </div>
            
            {/* Mobile-only auto-dial button using USSD */}
            <a href={`tel:*334*1*1*${treasurerPhone}*${caseObj.required_amount}#`} className="block w-full text-center bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Auto-Dial M-PESA USSD
            </a>
            <p className="text-[10px] text-center text-blue-600 mt-1 italic">Tapping this pre-fills your phone dialer!</p>
          </div>

          <form onSubmit={submitMpesaCode} className="p-4 border border-green-100 bg-green-50 rounded-xl">
            <h3 className="font-bold text-green-900 mb-2">Step 2: Submit Confirmation</h3>
            <p className="text-sm text-green-800 mb-3">Paste the 10-character M-Pesa confirmation code (e.g. QAB1234567) from your SMS.</p>
            <input 
              type="text" 
              required
              value={mpesaCode}
              onChange={e => setMpesaCode(e.target.value.toUpperCase())}
              placeholder="e.g. QAB1234567"
              className="w-full p-3 font-mono font-bold tracking-widest uppercase rounded-lg border border-green-300 focus:ring-green-500 focus:border-green-500 mb-4"
            />
            <button type="submit" disabled={loading} className="w-full bg-green-500 text-white font-bold text-lg px-6 py-3 rounded-xl shadow-lg hover:bg-green-600 hover:shadow-xl transition-all flex items-center justify-center">
              Submit Code
            </button>
          </form>
        </>
      )}

      {status === 'SUCCESS' && (
        <div className="py-6 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="font-bold text-xl text-green-600 mb-2">Submission Received!</h3>
          <p className="text-gray-600 text-sm mb-6">Your M-Pesa code <b>{mpesaCode}</b> has been sent to the Treasurer for verification.</p>
          <button onClick={() => navigate('/member')} className="bg-majustwe-blue text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-majustwe-lime transition">Return to Dashboard</button>
        </div>
      )}

    </div>
  );
};

export default PaymentGateway;
