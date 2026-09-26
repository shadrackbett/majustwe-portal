import React, { useContext, useState } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import api from '../api';

const TreasurerDashboard: React.FC = () => {
  const { members, cases, contributions, refreshData } = useContext(DatabaseContext);
  
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseAmount, setNewCaseAmount] = useState('');
  const [newCaseIntro, setNewCaseIntro] = useState('');
  const [newCasePhone, setNewCasePhone] = useState('0704532706');
  const [newCaseBeneficiary, setNewCaseBeneficiary] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedCaseId, setSelectedCaseId] = useState<number>(cases.length > 0 ? cases[0].id : 0);
  
  // WhatsApp Ledger Modal State
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [ledgerHeader, setLedgerHeader] = useState('HELLO MEMBERS. FOLLOWING THE DEMISE OF...');
  const [ledgerDeadline, setLedgerDeadline] = useState('14th July 2026');

  const pendingMembers = members.filter(m => m.status === 'PENDING_TREASURER' || m.status === 'PENDING_REGISTRATION');

  const handleApproveMember = async (id: number) => {
    try {
      await api.post(`/welfare/profiles/${id}/treasurer_approve/`);
      refreshData();
      alert('Member approved! They now have portal access but must complete their profile.');
    } catch (e) {
      console.error(e);
      alert('Failed to approve member.');
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle || !newCaseAmount) return;
    
    try {
      
      const fullDescription = `${newCaseIntro}\n\nSEND CONTRIBUTIONS TO TREASURER MPESA NO: ${newCasePhone}`;
      
      const caseRes = await api.post('/welfare/cases/', {
        title: newCaseTitle,
        description: fullDescription,
        required_amount: Number(newCaseAmount),
        is_active: true,
        beneficiary: newCaseBeneficiary ? Number(newCaseBeneficiary) : null
      });
      
      const activeMembers = members.filter(m => ['FULL', 'ASSOCIATE'].includes(m.member_type) && ['ACTIVE', 'ACTIVE_INCOMPLETE'].includes(m.status));
      
      await Promise.all(activeMembers.map(m => 
        api.post('/welfare/contributions/', {
          member: m.id,
          welfare_case: caseRes.data.id,
          amount_paid: 0,
          is_fully_paid: false
        }).catch(err => console.error("Failed contribution", err))
      ));
      
      refreshData();
      setNewCaseTitle('');
      setNewCaseAmount('');
      setNewCaseIntro('');
      alert('Welfare Case created and applied to all active members!');
    } catch (e) {
      console.error(e);
      alert('Failed to create case.');
    }
  };

  const handleExportCSV = () => {
    const caseObj = cases.find(c => c.id === selectedCaseId);
    if (!caseObj) return;

    const activeCaseContributions = contributions.filter(c => c.welfare_case === selectedCaseId);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Member ID,Name,Zone,Phone,Amount Paid,Status,M-Pesa Ref\n";
    
    const paidContribs = activeCaseContributions.filter(c => c.is_fully_paid);
    const unpaidContribs = activeCaseContributions.filter(c => !c.is_fully_paid);
    
    const sortById = (a: any, b: any) => {
      const mA = members.find(m => m.id === a.member);
      const mB = members.find(m => m.id === b.member);
      return (mA?.member_id || 9999) - (mB?.member_id || 9999);
    };

    paidContribs.sort(sortById);
    unpaidContribs.sort(sortById);
    
    const allSorted = [...paidContribs, ...unpaidContribs];
    
    allSorted.forEach(c => {
      const member = members.find(m => m.id === c.member);
      if (!member) return;
      
      const memberNo = member.member_id || '-';
      const name = `${member.user?.first_name || ''} ${member.user?.last_name || ''}`;
      const zone = member.zone || '';
      const phone = member.phone || '';
      const amount = c.is_fully_paid ? caseObj.required_amount : 0;
      const status = c.is_fully_paid ? 'CLEARED' : (c.mpesa_reference ? 'VERIFYING' : 'PENDING');
      const ref = c.mpesa_reference || '';
      
      const row = `${memberNo},"${name}","${zone}","${phone}",${amount},${status},${ref}`;
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Case_${caseObj.id}_Ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateLedgerText = () => {
    const caseObj = cases.find(c => c.id === selectedCaseId);
    if (!caseObj) return '';

    const activeCaseContributions = contributions.filter(c => c.welfare_case === selectedCaseId);
    
    const paidContribs = activeCaseContributions.filter(c => c.is_fully_paid);
    const unpaidContribs = activeCaseContributions.filter(c => !c.is_fully_paid);
    
    const sortById = (a: any, b: any) => {
      const mA = members.find(m => m.id === a.member);
      const mB = members.find(m => m.id === b.member);
      return (mA?.member_id || 9999) - (mB?.member_id || 9999);
    };

    paidContribs.sort(sortById);
    unpaidContribs.sort(sortById);

    let totalPaid = 0;
    
    const formatLine = (c: any, isPaid: boolean) => {
      const member = members.find(m => m.id === c.member);
      if (!member) return null;
      
      const memberNo = member.member_id || '-';
      const name = `${member.user?.first_name || ''} ${member.user?.last_name || ''}`;
      const zone = member.zone || '';
      
      if (isPaid) {
        totalPaid += Number(caseObj.required_amount);
        return `${memberNo} ${name} - ${caseObj.required_amount}/= ✅`;
      } else {
        return `${memberNo} ${name} -`;
      }
    };

    const paidLines = paidContribs.map(c => formatLine(c, true)).filter(Boolean);
    const unpaidLines = unpaidContribs.map(c => formatLine(c, false)).filter(Boolean);

    const dateAnnounced = new Date(caseObj.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return `${ledgerHeader}
    
*DATE OF ANNOUNCEMENT* *${dateAnnounced}* 
*DEADLINE* *${ledgerDeadline}* 

*CASE NO. ${caseObj.id}*

*ACTIVE MEMBERS*

${paidLines.join('\n')}
${unpaidLines.join('\n')}

*TOTAL KSH ${totalPaid.toLocaleString()}/=*`;
  };

  const handleOpenLedgerModal = () => {
    const caseObj = cases.find(c => c.id === selectedCaseId);
    if (caseObj && caseObj.description) {
      setLedgerHeader(caseObj.description);
    }
    setLedgerModalOpen(true);
  };

  const sendLedgerToWhatsApp = () => {
    const message = generateLedgerText();
    navigator.clipboard.writeText(message).then(() => {
      alert("Ledger copied to clipboard! You can now paste it into WhatsApp.");
      setLedgerModalOpen(false);
    }).catch(err => {
      alert("Failed to copy. Please manually select and copy the text.");
    });
  };

  const generateWhatsAppDefaulters = () => {
    const caseObj = cases.find(c => c.id === selectedCaseId);
    if (!caseObj) return;

    const activeCaseContributions = contributions.filter(c => c.welfare_case === selectedCaseId);
    const defaulters = activeCaseContributions
      .filter(c => !c.is_fully_paid)
      .map(c => {
        const member = members.find(m => m.id === c.member);
        return member ? `- ${member.user?.first_name || ''} ${member.user?.last_name || ''} (${member.zone || ''})` : null;
      })
      .filter(Boolean);

    if (defaulters.length === 0) {
      alert("All members have cleared this case!");
      return;
    }

    const message = `*MAJUSTWE WELFARE UPDATE* 📢\n\nFriendly reminder regarding the case: *${caseObj.title}* (Ksh ${caseObj.required_amount}).\n\nThe following members are yet to clear their balances:\n${defaulters.join('\n')}\n\n*CLICK HERE TO AUTO-PAY VIA M-PESA:*\nhttp://localhost:3000/pay/${caseObj.id}`; // In production, replace localhost with majustwe.com
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCloseCase = async (id: number) => {
    if (!window.confirm("Are you sure you want to close this case? Unpaid members might be suspended!")) return;
    try {
      await api.post(`/welfare/cases/${id}/close_case/`);
      refreshData();
      alert("Case closed successfully.");
    } catch(e) {
      alert("Failed to close case.");
    }
  };

  const handleMarkPaid = async (contributionId: number) => {
    try {
      await api.post(`/welfare/contributions/${contributionId}/mark_paid/`);
      refreshData();
    } catch (e) {
      console.error(e);
      alert('Failed to mark paid.');
    }
  };

  const handleMarkUnpaid = async (contributionId: number) => {
    if (!window.confirm("Are you sure you want to reverse this payment?")) return;
    try {
      await api.post(`/welfare/contributions/${contributionId}/mark_unpaid/`);
      refreshData();
    } catch (e) {
      console.error(e);
      alert('Failed to reverse payment.');
    }
  };

  const activeCaseContributions = contributions.filter(c => c.welfare_case === selectedCaseId);

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-majustwe-blue mb-6 drop-shadow-sm flex items-center"><span className="text-3xl mr-3">💰</span> Financial Command Center</h2>
      
      {/* WhatsApp Ledger Modal */}
      {ledgerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold text-majustwe-blue mb-1">Generate WhatsApp Ledger</h3>
            <p className="text-sm text-gray-500 mb-4">Currently generating for: <span className="font-bold text-gray-800">{cases.find(c => c.id === selectedCaseId)?.title}</span></p>
            
            <div className="space-y-4 mb-4 flex-shrink-0">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Announcement Header Text</label>
                <textarea 
                  value={ledgerHeader} 
                  onChange={e => setLedgerHeader(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-lg h-24 text-sm font-medium"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Deadline</label>
                <input 
                  type="text" 
                  value={ledgerDeadline} 
                  onChange={e => setLedgerDeadline(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 font-mono text-xs whitespace-pre-wrap">
              {generateLedgerText()}
            </div>

            <div className="flex justify-end space-x-3 flex-shrink-0">
              <button onClick={() => setLedgerModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={sendLedgerToWhatsApp} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 shadow-md flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <td className="px-4 py-3 font-bold text-gray-800">{m.user?.first_name} {m.user?.last_name}</td>
                    <td className="px-4 py-3 text-gray-700">{m.zone}</td>
                    <td className="px-4 py-3 text-gray-700">{m.phone}</td>
                    <td className="px-2 py-3 sm:px-4">
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
          
          <form onSubmit={handleCreateCase} className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Case Title</label>
              <input type="text" value={newCaseTitle} onChange={e=>setNewCaseTitle(e.target.value)} required className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none text-sm" placeholder="e.g. Bereavement: John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Required Amount per Member (Ksh)</label>
              <input type="number" value={newCaseAmount} onChange={e=>setNewCaseAmount(e.target.value)} required min="1" className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none text-sm" placeholder="200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Introductory Text</label>
              <textarea value={newCaseIntro} onChange={e=>setNewCaseIntro(e.target.value)} required className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none text-xs h-20" placeholder="HELLO MEMBERS. FOLLOWING THE DEMISE OF..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Treasurer M-PESA Phone No.</label>
              <input type="text" value={newCasePhone} onChange={e=>setNewCasePhone(e.target.value)} required className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none text-sm" placeholder="0704532706" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Beneficiary (Optional)</label>
              <select value={newCaseBeneficiary} onChange={e=>setNewCaseBeneficiary(e.target.value)} className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none text-sm">
                <option value="">-- None --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.user?.first_name} {m.user?.last_name} (M{m.member_id})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-majustwe-blue to-blue-800 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">Launch Case</button>
          </form>
        </div>

        {/* Contribution Tracking */}
        <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg lg:col-span-2">
          
          <div className="mb-6">
            <h3 className="font-bold text-xl text-majustwe-blue mb-3">Welfare Cases History</h3>
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x">
              {cases.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`snap-center shrink-0 w-72 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedCaseId === c.id ? 'border-majustwe-blue bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 truncate pr-2">{c.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {c.is_active ? 'ACTIVE' : 'CLOSED'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">Ksh {c.required_amount}</span>
                    {c.is_active && (
                      <button onClick={(e) => { e.stopPropagation(); handleCloseCase(c.id); }} className="text-[10px] bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded font-bold">
                        Close Case
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {cases.find(c => c.id === selectedCaseId) && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
              <h4 className="font-bold text-lg text-majustwe-blue">Viewing Case: {cases.find(c => c.id === selectedCaseId)?.title}</h4>
              <p className="text-sm text-gray-600">Total Collected: <span className="font-bold text-green-600">Ksh {contributions.filter(c => c.welfare_case === selectedCaseId && c.is_fully_paid).length * (cases.find(c => c.id === selectedCaseId)?.required_amount || 0)}</span> / Ksh {contributions.filter(c => c.welfare_case === selectedCaseId).length * (cases.find(c => c.id === selectedCaseId)?.required_amount || 0)}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="font-bold text-xl text-majustwe-blue">Contribution Ledger</h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button onClick={handleExportCSV} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow flex items-center justify-center">
                <span className="mr-2">📊</span> Export CSV
              </button>
              <button onClick={handleOpenLedgerModal} className="w-full sm:w-auto bg-majustwe-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold shadow flex items-center justify-center">
                <span className="mr-2">📋</span> WhatsApp Ledger
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input 
              type="text" 
              placeholder="🔍 Search M-Pesa Name, Phone, or Zone..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-majustwe-blue focus:border-majustwe-blue outline-none font-medium"
            />
          </div>
          
          {cases.length === 0 ? (
            <p className="text-gray-500 italic">No cases created yet.</p>
          ) : (
            <div className="overflow-x-auto bg-white/30 rounded-lg border border-white/40 max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Member</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeCaseContributions.filter(c => {
                    const m = members.find(mx => mx.id === c.member);
                    if (!m) return false;
                    const s = `${m.user?.first_name || ''} ${m.user?.last_name || ''} ${m.phone || ''} ${m.zone || ''}`.toLowerCase();
                    return s.includes(searchQuery.toLowerCase());
                  }).map(c => {
                    const member = members.find(m => m.id === c.member);
                    const caseObj = cases.find(caseItem => caseItem.id === c.welfare_case);
                    if (!member || !caseObj) return null;
                    
                    return (
                      <tr key={c.id} className="hover:bg-white/50">
                        <td className="px-2 py-3 sm:px-4">
                          <p className="font-bold text-gray-800 text-sm sm:text-base">{member.user?.first_name} {member.user?.last_name}</p>
                          <p className="text-xs text-gray-500">{member.member_id ? `M${String(member.member_id).padStart(3, '0')}` : 'PENDING'} • {member.zone}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">{member.phone}</p>
                        </td>
                        <td className="px-2 py-3 sm:px-4">
                          <span className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-full ${c.is_fully_paid ? 'bg-green-100 text-green-800' : c.mpesa_reference ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {c.is_fully_paid ? 'CLEARED' : c.mpesa_reference ? 'VERIFYING' : 'PENDING'}
                          </span>
                          {c.mpesa_reference && !c.is_fully_paid && (
                            <div className="mt-1 text-[10px] font-mono font-bold text-gray-600 bg-gray-100 px-1 py-0.5 rounded inline-block border border-gray-200">
                              {c.mpesa_reference}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3 sm:px-4">
                          {!c.is_fully_paid ? (
                            <button onClick={() => handleMarkPaid(c.id)} className={`${c.mpesa_reference ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-majustwe-lime hover:bg-majustwe-darkLime'} text-white px-2 py-1.5 sm:px-3 sm:py-1 rounded font-bold shadow-sm transition-colors text-[10px] sm:text-xs w-full sm:w-auto`}>
                              {c.mpesa_reference ? 'Verify Payment' : 'Mark Paid'}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-xs sm:text-sm font-bold flex items-center">✅ Settled</span>
                              <button onClick={() => handleMarkUnpaid(c.id)} className="text-[10px] text-red-500 hover:text-red-700 font-bold underline">Undo</button>
                            </div>
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
