import codecs
content = codecs.open('frontend/src/pages/MemberDashboard.tsx', 'r', 'utf-8').read()

old_state = '''  const [formData, setFormData] = useState({
    phone: '',
    spouse_name: '',
    spouse_phone: '',
    dependents_text: '',
    guardians_text: ''
  });'''

new_state = '''  const [formData, setFormData] = useState<{
    phone: string;
    spouse_name: string;
    spouse_phone: string;
    dependents: { name: string; relationship: string }[];
    guardians: { name: string; relationship: string; phone: string }[];
  }>({
    phone: '',
    spouse_name: '',
    spouse_phone: '',
    dependents: [],
    guardians: []
  });'''

content = content.replace(old_state, new_state)

old_startEditing = '''  const startEditing = () => {
    setFormData({
      phone: profile?.phone || '',
      spouse_name: profile?.spouse_name || '',
      spouse_phone: profile?.spouse_phone || '',
      dependents_text: profile?.dependents?.map((d: any) => `${d.name} (${d.relationship})`).join(', ') || '',
      guardians_text: profile?.guardians?.map((g: any) => `${g.name} (${g.relationship}) - ${g.phone}`).join(', ') || ''
    });
    setEditMode(true);
  };'''

new_startEditing = '''  const startEditing = () => {
    setFormData({
      phone: profile?.phone || '',
      spouse_name: profile?.spouse_name || '',
      spouse_phone: profile?.spouse_phone || '',
      dependents: profile?.dependents || [],
      guardians: profile?.guardians || []
    });
    setEditMode(true);
  };'''

content = content.replace(old_startEditing, new_startEditing)

old_handleUpdate = '''    const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Parse dependents
      const deps = formData.dependents_text.split(',').map(d => d.trim()).filter(d => d).map(d => {
        const match = d.match(/(.*)\s+\((.*)\)/);
        return match ? { name: match[1].trim(), relationship: match[2].trim() } : { name: d, relationship: 'Dependent' };
      });
      
      // Parse guardians
      const guards = formData.guardians_text.split(',').map(g => g.trim()).filter(g => g).map(g => {
        const match = g.match(/(.*)\s+\((.*)\)\s+-\s+(.*)/);
        return match ? { name: match[1].trim(), relationship: match[2].trim(), phone: match[3].trim() } : { name: g, relationship: 'Guardian', phone: '000' };
      });
  
      try {
        await api.post(`/welfare/profiles/${profile.id}/submit_details/`, {
          spouse_name: formData.spouse_name,
          spouse_phone: formData.spouse_phone,
          dependents: deps,
          guardians: guards
        });'''

new_handleUpdate = '''    const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await api.post(`/welfare/profiles/${profile.id}/submit_details/`, {
          spouse_name: formData.spouse_name,
          spouse_phone: formData.spouse_phone,
          dependents: formData.dependents,
          guardians: formData.guardians
        });'''

content = content.replace(old_handleUpdate, new_handleUpdate)


old_ui = '''                  {needsDetails && editMode ? (
                    <div className="space-y-6">
                      <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <p className="text-sm text-red-800 font-bold mb-4">Please input your dependents and guardians below. You can separate multiple entries with a comma.</p>
                        
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dependents (Names & Relationship)</label>
                        <textarea className="w-full p-2 border rounded-lg bg-white border-majustwe-lime focus:ring-majustwe-lime mb-4" rows={2} placeholder="e.g. Alice Doe (Daughter), Bob Doe (Son)"
                          value={formData.dependents_text}
                          onChange={e => setFormData({...formData, dependents_text: e.target.value})}
                        ></textarea>
  
                        <label className="block text-sm font-bold text-gray-700 mb-1">Guardians (Name, Relationship, Phone)</label>
                        <textarea className="w-full p-2 border rounded-lg bg-white border-majustwe-lime focus:ring-majustwe-lime" rows={2} placeholder="e.g. Mark Smith (Brother) - 0722000111"
                          value={formData.guardians_text}
                          onChange={e => setFormData({...formData, guardians_text: e.target.value})}
                        ></textarea>
                      </div>
                    </div>'''

new_ui = '''                  {editMode ? (
                    <div className="space-y-6">
                      <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <h4 className="text-md font-bold text-red-800 mb-2">Official Dependents (Max 4)</h4>
                        {formData.dependents.map((dep, index) => (
                          <div key={index} className="flex gap-2 mb-2 items-center bg-white p-2 border border-red-200 rounded shadow-sm">
                            <input type="text" placeholder="Name" value={dep.name} onChange={(e) => {
                              const newDeps = [...formData.dependents];
                              newDeps[index].name = e.target.value;
                              setFormData({...formData, dependents: newDeps});
                            }} className="p-1 border rounded w-1/2 text-sm focus:ring-majustwe-lime focus:outline-none" />
                            <input type="text" placeholder="Relationship" value={dep.relationship} onChange={(e) => {
                              const newDeps = [...formData.dependents];
                              newDeps[index].relationship = e.target.value;
                              setFormData({...formData, dependents: newDeps});
                            }} className="p-1 border rounded w-1/3 text-sm focus:ring-majustwe-lime focus:outline-none" />
                            <button type="button" onClick={() => {
                              const newDeps = formData.dependents.filter((_, i) => i !== index);
                              setFormData({...formData, dependents: newDeps});
                            }} className="text-red-500 font-bold px-2 hover:bg-red-100 rounded">X</button>
                          </div>
                        ))}
                        {formData.dependents.length < 4 && (
                          <button type="button" onClick={() => setFormData({...formData, dependents: [...formData.dependents, {name: '', relationship: ''}]})} className="bg-majustwe-lime text-white px-3 py-1 rounded font-bold text-sm mt-2 hover:bg-majustwe-darkLime transition">
                            + Add Dependent
                          </button>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="text-md font-bold text-blue-800 mb-2">Guardians (Max 2)</h4>
                        {(profile.guardians && profile.guardians.length > 0) ? (
                          <div className="text-sm text-blue-800 bg-white p-3 rounded shadow-sm border border-blue-100">
                            <p className="mb-2 italic text-blue-600 font-medium flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                              Guardians are locked and can only be updated by the Secretary.
                            </p>
                            <ul className="list-disc pl-5 space-y-1 mt-3">
                              {profile.guardians.map((g: any, i: number) => <li key={i}><span className="font-bold">{g.name}</span> ({g.relationship}) - {g.phone}</li>)}
                            </ul>
                          </div>
                        ) : (
                          <>
                            {formData.guardians.map((guard, index) => (
                              <div key={index} className="flex gap-2 mb-2 items-center bg-white p-2 border border-blue-200 rounded shadow-sm">
                                <input type="text" placeholder="Name" value={guard.name} onChange={(e) => {
                                  const newGuards = [...formData.guardians];
                                  newGuards[index].name = e.target.value;
                                  setFormData({...formData, guardians: newGuards});
                                }} className="p-1 border rounded w-1/3 text-sm focus:ring-blue-500 focus:outline-none" />
                                <input type="text" placeholder="Relationship" value={guard.relationship} onChange={(e) => {
                                  const newGuards = [...formData.guardians];
                                  newGuards[index].relationship = e.target.value;
                                  setFormData({...formData, guardians: newGuards});
                                }} className="p-1 border rounded w-1/4 text-sm focus:ring-blue-500 focus:outline-none" />
                                <input type="text" placeholder="Phone" value={guard.phone} onChange={(e) => {
                                  const newGuards = [...formData.guardians];
                                  newGuards[index].phone = e.target.value;
                                  setFormData({...formData, guardians: newGuards});
                                }} className="p-1 border rounded w-1/4 text-sm focus:ring-blue-500 focus:outline-none" />
                                <button type="button" onClick={() => {
                                  const newGuards = formData.guardians.filter((_, i) => i !== index);
                                  setFormData({...formData, guardians: newGuards});
                                }} className="text-red-500 font-bold px-2 hover:bg-red-100 rounded">X</button>
                              </div>
                            ))}
                            {formData.guardians.length < 2 && (
                              <button type="button" onClick={() => setFormData({...formData, guardians: [...formData.guardians, {name: '', relationship: '', phone: ''}]})} className="bg-majustwe-blue text-white px-3 py-1 rounded font-bold text-sm mt-2 hover:bg-blue-800 transition">
                                + Add Guardian
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>'''

content = content.replace(old_ui, new_ui)
codecs.open('frontend/src/pages/MemberDashboard.tsx', 'w', 'utf-8').write(content)
