import codecs
content = codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'r', 'utf-8').read()

new_handleSaveEdit = """  const handleSaveEdit = async () => {
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
      refreshData();
      setEditModalOpen(false);
      alert('Member updated successfully.');
    } catch (e) {
      console.error(e);
      alert('Failed to update member.');
    }
  };"""

import re
content = re.sub(r'  const handleSaveEdit = async \(\) => \{.*?\n  \};', new_handleSaveEdit, content, flags=re.DOTALL)


# Now adding new fields to the modal
# Look for: <div className="space-y-4"> inside the Edit Member Modal
fields_to_add = """
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
"""

# We'll inject this inside <div className="space-y-4">
content = content.replace('<div className="space-y-4">\n                <div>', '<div className="space-y-4">\n' + fields_to_add + '                <div>')

codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'w', 'utf-8').write(content)
