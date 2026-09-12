import React, { useState, useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';

const SecretaryDashboard: React.FC = () => {
  const { members, setMembers, minutes, setMinutes } = useContext(DatabaseContext);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordExcerpt, setNewRecordExcerpt] = useState('');

  // The Secretary now reviews members who are ACTIVE_INCOMPLETE to assign them a Member No.
  const pendingDetailsMembers = members.filter(m => m.status === 'ACTIVE_INCOMPLETE');
  
  // Replace the old roster state variable with direct database context
  const roster = members;

  const handleEditClick = (member: any) => {
    setEditingMember({ ...member });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    let updatedRoster = [...members];
    
    if (editingMember.role === 'SECRETARY' || editingMember.role === 'TREASURER') {
      updatedRoster = updatedRoster.map(m => {
        if (m.role === editingMember.role && m.id !== editingMember.id) {
          return { ...m, role: 'MEMBER' };
        }
        return m;
      });
    }

    updatedRoster = updatedRoster.map(m => m.id === editingMember.id ? editingMember : m);
    setMembers(updatedRoster);
    setEditModalOpen(false);
  };

  const handlePublishRecord = () => {
    if(!newRecordTitle || !newRecordExcerpt) return;
    setMinutes([
      { id: Date.now(), title: newRecordTitle, excerpt: newRecordExcerpt, date: new Date().toISOString().split('T')[0] },
      ...minutes
    ]);
    setNewRecordTitle('');
    setNewRecordExcerpt('');
    alert('Record published to all member dashboards!');
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl shadow-2xl border border-white/60 rounded-3xl p-8 relative">
      <h2 className="text-3xl font-extrabold text-majustwe-blue mb-6 drop-shadow-sm flex items-center"><span className="text-3xl mr-3">📝</span> Secretary Operations</h2>
      
      {/* Edit Member Modal */}
      {editModalOpen && editingMember && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
            <h3 className="text-xl font-bold text-majustwe-blue mb-4">Edit Member Profile</h3>
            <p className="text-sm font-bold text-gray-800 mb-4">{editingMember.name} ({editingMember.memberNo})</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select value={editingMember.status} onChange={e => setEditingMember({...editingMember, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Member Type</label>
                <select value={editingMember.type} onChange={e => setEditingMember({...editingMember, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <option value="FULL">Full Member</option>
                  <option value="ASSOCIATE">Associate Member</option>
                  <option value="HONORARY">Honorary Member</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">System Role</label>
                <select value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value})} className="w-full bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-2 font-bold">
                  <option value="MEMBER">MEMBER</option>
                  <option value="SECRETARY">SECRETARY</option>
                  <option value="TREASURER">TREASURER</option>
                </select>
                <p className="text-xs text-blue-600 mt-1">Assigning Secretary/Treasurer will demote the current official.</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-majustwe-lime text-white font-bold rounded-lg hover:bg-majustwe-darkLime shadow">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
            <h3 className="text-xl font-bold text-red-600 mb-2">Reject Registration</h3>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this member's Phase 2 details. This will be sent to the user.</p>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 focus:ring-red-500 focus:border-red-500" 
              rows={3} 
              placeholder="e.g., Incomplete Guardian details, or invalid dependents."
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={() => { alert('Rejected with reason: ' + rejectReason); setRejectModalOpen(false); }} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 shadow">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-majustwe-blue mb-4">Review Phase 2 Details</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-majustwe-blue mb-2">Spouse Information</h4>
                <p className="text-sm text-gray-700">Name: Jane Doe<br/>Phone: 0712345678</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-majustwe-blue mb-2">Guardians (2)</h4>
                <ul className="text-sm text-gray-700 list-disc pl-5">
                  <li>Mark Smith (Brother) - 0722000111</li>
                  <li>Mary Smith (Sister) - 0733000111</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-bold text-majustwe-blue mb-2">Dependents (3)</h4>
                <ul className="text-sm text-gray-700 list-disc pl-5">
                  <li>Alice Doe (Daughter)</li>
                  <li>Bob Doe (Son)</li>
                  <li>Charlie Doe (Adopted Son)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setDetailsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <h3 className="font-bold text-xl text-majustwe-blue mb-2">Generate Member Numbers</h3>
        <p className="text-gray-700 mb-6 font-medium">Review Active members who recently completed Phase 2 (dependents/guardians). Approving generates their official Member No.</p>
        
        {pendingDetailsMembers.length === 0 ? (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 font-bold">No pending members await your approval!</div>
        ) : (
          <div className="overflow-x-auto bg-white/30 rounded-lg border border-white/40">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Zone</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Details</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white/40 backdrop-blur-sm">
                {pendingDetailsMembers.map(m => (
                  <tr key={m.id} className="hover:bg-white/50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-800">{m.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">{m.zone}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-center">
                      <button onClick={() => setDetailsModalOpen(true)} className="text-majustwe-blue hover:underline font-semibold">View Forms</button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm flex space-x-2">
                      <button onClick={() => {
                        const maxM = Math.max(0, ...members.map(x => parseInt(x.memberNo?.replace('M','') || '0')));
                        const memberNo = `M${String(maxM + 1).padStart(3, '0')}`;
                        setMembers(members.map(x => x.id === m.id ? { ...x, status: 'ACTIVE', memberNo } : x));
                      }} className="bg-majustwe-lime text-white px-3 py-1.5 rounded-md hover:bg-majustwe-darkLime font-bold shadow-sm transition-transform hover:scale-105">Approve</button>
                      <button className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 font-bold shadow-sm transition-transform hover:scale-105" onClick={() => setRejectModalOpen(true)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-majustwe-blue">Official Member Roster</h3>
          <div className="flex space-x-2">
            <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-majustwe-lime">
              <option value="ALL">All Zones</option>
              <option value="TSIMBA_TIWI">Tsimba-Tiwi</option>
              <option value="NGOMBENI_WAA">Ngombeni-Waa</option>
            </select>
            <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-majustwe-lime">
              <option value="ALL">All Types</option>
              <option value="FULL">Full</option>
              <option value="ASSOCIATE">Associate</option>
              <option value="HONORARY">Honorary</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto bg-white/30 rounded-lg border border-white/40">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Member No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white/40 backdrop-blur-sm">
              {roster.map((member) => (
                <tr key={member.id} className="hover:bg-white/50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-800">{member.memberNo || '-'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-800">{member.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${member.role === 'SECRETARY' ? 'bg-indigo-100 text-indigo-800' : member.role === 'TREASURER' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${member.type === 'FULL' ? 'bg-blue-100 text-blue-800' : member.type === 'ASSOCIATE' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'}`}>
                      {member.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : member.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : member.status.includes('PENDING') ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                      {member.status.replace('PENDING_TREASURER', 'P: Phase 1').replace('PENDING_SECRETARY', 'P: Phase 2')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <button onClick={() => handleEditClick(member)} className="text-blue-600 hover:text-blue-800 font-bold underline text-xs">Edit Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="font-bold text-xl text-majustwe-blue mb-2">Publish Minutes & Records</h3>
        <p className="text-gray-700 mb-4 font-medium">Post official meeting minutes or welfare records. These will be visible to all members on their dashboard.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Record Title</label>
            <input type="text" value={newRecordTitle} onChange={e => setNewRecordTitle(e.target.value)} className="w-full p-2 bg-white/60 border border-white/80 rounded-lg focus:ring-majustwe-lime focus:border-majustwe-lime outline-none shadow-inner" placeholder="e.g. Annual General Meeting 2026" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Summary / Excerpt</label>
            <textarea value={newRecordExcerpt} onChange={e => setNewRecordExcerpt(e.target.value)} className="w-full bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-3 focus:ring-2 focus:ring-majustwe-lime focus:border-majustwe-lime outline-none shadow-inner" rows={2} placeholder="Brief summary of the meeting..."></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              Attach PDF File
            </button>
            <button onClick={handlePublishRecord} className="bg-majustwe-blue text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-900 transition-colors">Publish to Members</button>
          </div>
        </div>
      </div>

      <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <h3 className="font-bold text-xl text-majustwe-blue mb-2">Communications Hub</h3>
        <p className="text-gray-700 mb-4 font-medium">Send bulk SMS or WhatsApp notifications to filtered members.</p>
        <textarea className="w-full bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-majustwe-lime focus:border-majustwe-lime outline-none transition-all shadow-inner" rows={3} placeholder="Type your broadcast message here..."></textarea>
        <button className="bg-gradient-to-r from-majustwe-lime to-majustwe-darkLime text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5 border border-white/20">Send Broadcast</button>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
