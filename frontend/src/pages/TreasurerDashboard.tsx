import React, { useContext, useState } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';

const TreasurerDashboard: React.FC = () => {
  const { members, setMembers, cases, setCases, contributions, setContributions } = useContext(DatabaseContext);
  
  // Case Creation Form State
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseAmount, setNewCaseAmount] = useState('');
  
  // Contribution Tracking State
  const [selectedCaseId, setSelectedCaseId] = useState<number>(cases[0]?.id || 0);

  const pendingMembers = members.filter(m => m.status === 'PENDING_TREASURER');

  const handleApproveMember = (id: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: 'ACTIVE_INCOMPLETE' } : m));
    alert('Member approved! They now have portal access but must complete their profile.');
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle || !newCaseAmount) return;
    
    const newCase = {
      id: Date.now(),
      title: newCaseTitle,
      requiredAmount: Number(newCaseAmount),
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCases([newCase, ...cases]);
    
    // Automatically create pending contributions for all FULL/ASSOCIATE members
    const newContributions = members
      .filter(m => ['FULL', 'ASSOCIATE'].includes(m.type) && m.status === 'ACTIVE')
      .map(m => ({
        id: Math.random(),
        memberId: m.id,
        caseId: newCase.id,
        paid: 0,
        status: 'PENDING'
      }));
      
    setContributions([...newContributions, ...contributions]);
    setNewCaseTitle('');
    setNewCaseAmount('');
    alert('Welfare Case created and applied to all active members!');
  };

  const handleMarkPaid = (contributionId: number, required: number) => {
    setContributions(contributions.map(c => 
      c.id === contributionId ? { ...c, paid: required, status: 'CLEARED' } : c
    ));
  };

  // Filter contributions for the selected case to display in the ledger
  const activeCaseContributions = contributions.filter(c => c.caseId === selectedCaseId);

  return (
    <div className="bg-white/40 backdrop-blur-xl shadow-2xl border border-white/60 rounded-3xl p-4 md:p-8">
      <h2 className="text-3xl font-extrabold text-majustwe-blue mb-6 drop-shadow-sm flex items-center"><span className="text-3xl mr-3">💼</span> Financial Command Center</h2>
      
      {/* Pending Approvals */}
      <div className="mb-8 border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <h3 className="font-bold text-xl text-majustwe-blue mb-2">Phase 1 Approvals (Registration & Emergency Kitty)</h3>
        <p className="text-gray-700 mb-6 font-medium">Click "Confirm Payment" for members who have cleared the Ksh 100 registration and Ksh 500 Emergency Kitty.</p>
        
        {pendingMembers.length === 0 ? (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 font-bold">No pending members!</div>
        ) : (
          <div className="overflow-x-auto bg-white/30 rounded-lg border border-white/40">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Zone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingMembers.map(m => (
                  <tr key={m.id} className="hover:bg-white/50">
                    <td className="px-4 py-3 font-bold text-gray-800">{m.name}</td>
                    <td className="px-4 py-3 text-gray-700">{m.zone}</td>
                    <td className="px-4 py-3 text-gray-700">{m.phone}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleApproveMember(m.id)} className="bg-majustwe-lime text-white px-3 py-1.5 rounded hover:bg-majustwe-darkLime font-bold shadow-sm transition-transform hover:scale-105">Confirm Payment</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Case Template */}
        <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg lg:col-span-1">
          <h3 className="font-bold text-xl text-majustwe-blue mb-2">Create New Case</h3>
          <p className="text-gray-700 mb-6 font-medium text-sm">Launch a new welfare collection (e.g., Bereavement). This automatically bills all active members.</p>
          
          <form onSubmit={handleCreateCase} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Case Title</label>
              <input type="text" value={newCaseTitle} onChange={e=>setNewCaseTitle(e.target.value)} required className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none" placeholder="e.g. Bereavement: John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Required Amount per Member (Ksh)</label>
              <input type="number" value={newCaseAmount} onChange={e=>setNewCaseAmount(e.target.value)} required min="1" className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none" placeholder="500" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-majustwe-blue to-blue-800 text-white font-bold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">Launch Case</button>
          </form>
        </div>

        {/* Contribution Tracking */}
        <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-bold text-xl text-majustwe-blue">Contribution Ledger</h3>
            <select value={selectedCaseId} onChange={e => setSelectedCaseId(Number(e.target.value))} className="bg-white border border-gray-300 rounded-lg p-2 font-bold text-gray-700 shadow-sm focus:ring-majustwe-lime">
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.title} (Ksh {c.requiredAmount})</option>
              ))}
            </select>
          </div>
          
          {cases.length === 0 ? (
            <p className="text-gray-500 italic">No cases created yet.</p>
          ) : (
            <div className="overflow-x-auto bg-white/30 rounded-lg border border-white/40 max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Member</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeCaseContributions.map(c => {
                    const member = members.find(m => m.id === c.memberId);
                    const caseObj = cases.find(caseItem => caseItem.id === c.caseId);
                    if (!member || !caseObj) return null;
                    
                    return (
                      <tr key={c.id} className="hover:bg-white/50">
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-800">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.memberNo} • {member.zone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${c.status === 'CLEARED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.status === 'PENDING' ? (
                            <button onClick={() => handleMarkPaid(c.id, caseObj.requiredAmount)} className="bg-majustwe-lime text-white px-3 py-1 rounded font-bold shadow-sm hover:bg-majustwe-darkLime transition-colors text-xs">Mark Fully Paid</button>
                          ) : (
                            <span className="text-gray-500 text-sm font-bold flex items-center">
                              <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {activeCaseContributions.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-3 text-center text-gray-500 italic">No contributions tracked for this case yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default TreasurerDashboard;
