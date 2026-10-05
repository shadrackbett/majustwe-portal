import React, { useState, useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const SecretaryDashboard: React.FC = () => {
  const { members, refreshData } = useContext(DatabaseContext);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [rejectingMemberId, setRejectingMemberId] = useState<number | null>(null);
  const [viewingDetailsId, setViewingDetailsId] = useState<number | null>(null);

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

  const { user, login } = useContext(AuthContext); // Make sure login is imported

  const handleSaveEdit = async () => {
    try {
      await api.patch(`/welfare/profiles/${editingMember.id}/`, {
        id_number: editingMember.id_number,
        phone: editingMember.phone,
        current_workstation: editingMember.current_workstation,
        home_subcounty: editingMember.home_subcounty,
        zone: editingMember.zone,
      });
      await api.post(`/welfare/profiles/${editingMember.id}/update_status_and_role/`, {
        status: editingMember.status,
        member_type: editingMember.member_type,
        role: editingMember.user?.role
      });
      await api.post(`/welfare/profiles/${editingMember.id}/submit_details/`, {
        dependents: editingMember.dependents || [],
        guardians: editingMember.guardians || []
      });
      
      // If the user changed their own role, update local context so UI reflects it immediately!
      if (user && Number(editingMember.user?.id) === Number(user.id) && editingMember.user?.role !== user.role) {
         login(localStorage.getItem('token') || '', user.id, editingMember.user.role, user.username);
      }

      refreshData();
      setEditModalOpen(false);
      alert('Member updated successfully.');
    } catch (e: any) {
      console.error(e);
      let errorMsg = 'Failed to update member.';
      if (e.response && e.response.data) {
        if (typeof e.response.data === 'string') {
           errorMsg = e.response.data;
        } else if (e.response.data.id_number) {
           errorMsg = 'ID Number Error: ' + (Array.isArray(e.response.data.id_number) ? e.response.data.id_number[0] : e.response.data.id_number);
        } else if (e.response.data.detail) {
           errorMsg = e.response.data.detail;
        } else {
           errorMsg = JSON.stringify(e.response.data);
        }
      }
      alert(errorMsg);
    }
  };

  const handleForcePassword = async () => {
    const cleanPassword = newPassword.trim();
    if (!cleanPassword || cleanPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    if (!window.confirm('Are you sure you want to force change this user\'s password?')) return;
    try {
      await api.post(`/welfare/profiles/${editingMember.id}/force_password/`, { new_password: cleanPassword });
      alert('Password updated successfully. Please securely share this new password with the user.');
      setNewPassword('');
    } catch (e: any) {
      console.error(e);
      alert('Failed to update password: ' + (e.response?.data?.error || e.response?.data?.detail || e.message || 'Server Error'));
    }
  };

  const _oldHandleForcePassword_ = async () => {
    if (!newPassword || newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    if (!window.confirm('Are you sure you want to force change this user\'s password?')) return;
    try {
      await api.post(`/welfare/profiles/${editingMember.id}/force_password/`, { new_password: newPassword });
      alert('Password updated successfully. Please securely share this new password with the user.');
      setNewPassword('');
    } catch (e: any) {
      console.error(e);
      alert('Failed to update password: ' + (e.response?.data?.error || e.response?.data?.detail || e.message || 'Server Error'));
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('CRITICAL WARNING: Are you absolutely sure you want to completely delete this user and all their records? This cannot be undone!')) return;
    try {
      await api.delete(`/welfare/profiles/${editingMember.id}/delete_account/`);
      alert('Account deleted permanently.');
      setEditModalOpen(false);
      refreshData();
    } catch (e: any) {
      console.error(e);
      alert('Failed to delete account.');
    }
  };

  const handlePublishRecord = async () => {
    if(!newRecordTitle || !newRecordExcerpt) return;
    try {
      await api.post('/welfare/minutes/', {
        title: newRecordTitle,
        excerpt: newRecordExcerpt
      });
      setNewRecordTitle('');
      setNewRecordExcerpt('');
      refreshData();
      alert('Record published to all member dashboards!');
    } catch (e) {
      console.error(e);
      alert('Error publishing record.');
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl shadow-2xl border border-white/60 rounded-3xl p-8 relative">
      <h2 className="text-3xl font-extrabold text-majustwe-blue mb-6 drop-shadow-sm flex items-center"><span className="text-3xl mr-3">📝</span> Secretary Operations</h2>
      
      {/* Edit Member Modal */}
      {editModalOpen && editingMember && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-majustwe-blue mb-4">Edit Member Profile</h3>
            <p className="text-sm font-bold text-gray-800 mb-4">{editingMember.user?.first_name} {editingMember.user?.last_name} ({editingMember.member_id ? `M${String(editingMember.member_id).padStart(3,'0')}` : 'PENDING'})</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">ID Number</label>
                  <input type="text" value={editingMember.id_number || ''} onChange={e => setEditingMember({...editingMember, id_number: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <input type="text" value={editingMember.phone || ''} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Current Workstation</label>
                  <input type="text" value={editingMember.current_workstation || ''} onChange={e => setEditingMember({...editingMember, current_workstation: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Zone</label>
                  <input type="text" value={editingMember.zone || ''} onChange={e => setEditingMember({...editingMember, zone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Home Subcounty</label>
                <input type="text" value={editingMember.home_subcounty || ''} onChange={e => setEditingMember({...editingMember, home_subcounty: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select value={editingMember.status} onChange={e => setEditingMember({...editingMember, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <option value="ACTIVE_INCOMPLETE">ACTIVE (Missing Details)</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Member Type</label>
                <select value={editingMember.member_type} onChange={e => setEditingMember({...editingMember, member_type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <option value="FULL">Full Member</option>
                  <option value="ASSOCIATE">Associate Member</option>
                  <option value="HONORARY">Honorary Member</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">System Role</label>
                <select value={editingMember.user?.role} onChange={e => setEditingMember({...editingMember, user: {...editingMember.user, role: e.target.value}})} className="w-full bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-2 font-bold">
                  <option value="MEMBER">MEMBER</option>
                  <option value="SECRETARY">SECRETARY</option>
                  <option value="TREASURER">TREASURER</option>
                </select>
                <p className="text-xs text-blue-600 mt-1">Assigning Secretary/Treasurer will demote the current official.</p>
              </div>
            </div>

            
              <div className="mt-4 border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-2">Dependents (Max 4)</h4>
                {(editingMember.dependents || []).map((dep: any, index: number) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input type="text" placeholder="Name" value={dep.name} onChange={e => {
                      const newDeps = [...(editingMember.dependents || [])];
                      newDeps[index].name = e.target.value;
                      setEditingMember({...editingMember, dependents: newDeps});
                    }} className="flex-1 bg-gray-50 border border-gray-200 rounded p-1 text-sm" />
                    <input type="text" placeholder="Relationship" value={dep.relationship} onChange={e => {
                      const newDeps = [...(editingMember.dependents || [])];
                      newDeps[index].relationship = e.target.value;
                      setEditingMember({...editingMember, dependents: newDeps});
                    }} className="flex-1 bg-gray-50 border border-gray-200 rounded p-1 text-sm" />
                    <button onClick={() => {
                      const newDeps = (editingMember.dependents || []).filter((_: any, i: number) => i !== index);
                      setEditingMember({...editingMember, dependents: newDeps});
                    }} className="bg-red-500 text-white px-2 rounded text-sm">X</button>
                  </div>
                ))}
                {(!editingMember.dependents || editingMember.dependents.length < 4) && (
                  <button onClick={() => setEditingMember({...editingMember, dependents: [...(editingMember.dependents || []), {name: '', relationship: ''}]})} className="text-xs bg-majustwe-blue text-white px-2 py-1 rounded">Add Dependent</button>
                )}
              </div>

              <div className="mt-4 border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-2">Guardians (Max 2)</h4>
                {(editingMember.guardians || []).map((gd: any, index: number) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input type="text" placeholder="Name" value={gd.name} onChange={e => {
                      const newGds = [...(editingMember.guardians || [])];
                      newGds[index].name = e.target.value;
                      setEditingMember({...editingMember, guardians: newGds});
                    }} className="flex-1 bg-gray-50 border border-gray-200 rounded p-1 text-sm" />
                    <input type="text" placeholder="Relationship" value={gd.relationship} onChange={e => {
                      const newGds = [...(editingMember.guardians || [])];
                      newGds[index].relationship = e.target.value;
                      setEditingMember({...editingMember, guardians: newGds});
                    }} className="w-24 bg-gray-50 border border-gray-200 rounded p-1 text-sm" />
                    <input type="text" placeholder="Phone" value={gd.phone} onChange={e => {
                      const newGds = [...(editingMember.guardians || [])];
                      newGds[index].phone = e.target.value;
                      setEditingMember({...editingMember, guardians: newGds});
                    }} className="w-28 bg-gray-50 border border-gray-200 rounded p-1 text-sm" />
                    <button onClick={() => {
                      const newGds = (editingMember.guardians || []).filter((_: any, i: number) => i !== index);
                      setEditingMember({...editingMember, guardians: newGds});
                    }} className="bg-red-500 text-white px-2 rounded text-sm">X</button>
                  </div>
                ))}
                {(!editingMember.guardians || editingMember.guardians.length < 2) && (
                  <button onClick={() => setEditingMember({...editingMember, guardians: [...(editingMember.guardians || []), {name: '', relationship: '', phone: ''}]})} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Add Guardian</button>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-red-200">
                <h4 className="text-lg font-bold text-red-700 mb-4">Security Operations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-red-800 mb-1">Force Password Reset</h5>
                      <p className="text-xs text-gray-600 mb-3">Manually set a new password for this user. (Min 8 chars)</p>
                      <input type="text" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white border border-red-200 rounded-lg p-2 mb-3 text-sm focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <button onClick={handleForcePassword} className="w-full px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-sm text-sm">Update Password</button>
                  </div>
                  
                  <div className="bg-red-100 p-4 rounded-lg border border-red-300 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-red-900 mb-1">Delete Account</h5>
                      <p className="text-xs text-red-800 mb-3">Permanently delete this user, their dependents, and wipe all their history from the database.</p>
                    </div>
                    <button onClick={handleDeleteAccount} className="w-full px-4 py-2 border-2 border-red-600 text-red-700 font-bold rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm mt-auto text-sm">PERMANENTLY DELETE</button>
                  </div>
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
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 max-h-[90vh] overflow-y-auto">
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
              <button onClick={async () => { 
                if (rejectingMemberId) {
                  try {
                    await api.post(`/welfare/profiles/${rejectingMemberId}/secretary_reject/`, { rejection_reason: rejectReason });
                    refreshData();
                    alert('Rejected with reason: ' + rejectReason);
                  } catch(e) {
                    alert('Error rejecting');
                  }
                }
                setRejectModalOpen(false); 
              }} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 shadow">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && viewingDetailsId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-majustwe-blue mb-4">Review Phase 2 Details</h3>
            
            {(() => {
              const m = members.find(x => x.id === viewingDetailsId);
              if (!m) return null;
              return (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-majustwe-blue mb-2">Spouse Information</h4>
                    <p className="text-sm text-gray-700">Name: {m.spouse_name || 'N/A'}<br/>Phone: {m.spouse_phone || 'N/A'}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-majustwe-blue mb-2">Guardians ({m.guardians?.length || 0})</h4>
                    <ul className="text-sm text-gray-700 list-disc pl-5">
                      {m.guardians?.map((g: any, i: number) => (
                        <li key={i}>{g.name} ({g.relationship}) - {g.phone}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-majustwe-blue mb-2">Dependents ({m.dependents?.length || 0})</h4>
                    <ul className="text-sm text-gray-700 list-disc pl-5">
                      {m.dependents?.map((d: any, i: number) => (
                        <li key={i}>{d.name} ({d.relationship})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

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
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-800">{m.user?.first_name} {m.user?.last_name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">{m.zone}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-center">
                      <button onClick={() => { setViewingDetailsId(m.id); setDetailsModalOpen(true); }} className="text-majustwe-blue hover:underline font-semibold">View Forms</button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm flex space-x-2">
                      <button onClick={async () => {
                        try {
                          await api.post(`/welfare/profiles/${m.id}/secretary_approve/`);
                          refreshData();
                        } catch (e) {
                          alert('Error approving member');
                        }
                      }} className="bg-majustwe-lime text-white px-3 py-1.5 rounded-md hover:bg-majustwe-darkLime font-bold shadow-sm transition-transform hover:scale-105">Approve</button>
                      <button className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 font-bold shadow-sm transition-transform hover:scale-105" onClick={() => { setRejectingMemberId(m.id); setRejectModalOpen(true); }}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      
      <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="font-bold text-xl text-majustwe-blue mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Recruitment & Documentation Materials
        </h3>
        <p className="text-gray-700 mb-6 font-medium">Access and print official documents for recruiting new members or providing physical copies to schools.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => window.location.href = '/join-us'} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📰</span>
            <span>View Brochure</span>
          </button>
          
          <button onClick={() => window.location.href = '/faq'} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">❓</span>
            <span>View FAQs</span>
          </button>
          
          <button onClick={() => window.location.href = '/membership-form?blank=true'} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📝</span>
            <span>Print Membership Form</span>
          </button>
        </div>
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
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-800">{member.member_id ? `M${String(member.member_id).padStart(3, '0')}` : '-'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-800">{member.user?.first_name} {member.user?.last_name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${member.user?.role === 'SECRETARY' ? 'bg-indigo-100 text-indigo-800' : member.user?.role === 'TREASURER' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}>
                      {member.user?.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${member.member_type === 'FULL' ? 'bg-blue-100 text-blue-800' : member.member_type === 'ASSOCIATE' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'}`}>
                      {member.member_type}
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
