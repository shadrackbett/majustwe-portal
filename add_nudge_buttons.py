import codecs

content = codecs.open(r'C:\majustwe_portal\frontend\src\pages\SecretaryDashboard.tsx', 'r', 'utf-8').read()

target = """                      <td className="whitespace-nowrap px-4 py-3 text-sm flex space-x-2">
                        <button onClick={async () => {
                          try {
                            await api.post(`/welfare/profiles/${m.id}/secretary_approve/`);
                            refreshData();
                          } catch (e) {
                            alert('Error approving member');
                          }
                        }} className="bg-majustwe-lime text-white px-3 py-1.5 rounded-md hover:bg-majustwe-darkLime font-bold shadow-sm transition-transform hover:scale-105">Approve</button>
                        <button className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 font-bold shadow-sm transition-transform hover:scale-105" onClick={() => { setRejectingMemberId(m.id); setRejectModalOpen(true); }}>Reject</button>
                      </td>"""

replace = """                      <td className="whitespace-nowrap px-4 py-3 text-sm flex space-x-2">
                        <button onClick={async () => {
                          try {
                            await api.post(`/welfare/profiles/${m.id}/secretary_approve/`);
                            refreshData();
                          } catch (e) {
                            alert('Error approving member');
                          }
                        }} className="bg-majustwe-lime text-white px-3 py-1.5 rounded-md hover:bg-majustwe-darkLime font-bold shadow-sm transition-transform hover:scale-105">Approve</button>
                        <button className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 font-bold shadow-sm transition-transform hover:scale-105" onClick={() => { setRejectingMemberId(m.id); setRejectModalOpen(true); }}>Reject</button>
                        
                        <button onClick={async () => {
                          try {
                            await api.post(`/welfare/profiles/${m.id}/send_reminder/`);
                            alert('Reminder email sent!');
                          } catch (e) {
                            alert('Error sending reminder email');
                          }
                        }} className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 font-bold shadow-sm transition-transform hover:scale-105" title="Send Email Reminder">Nudge</button>
                        
                        <a href={`https://wa.me/${m.phone?.replace(/^0/, '254')}?text=${encodeURIComponent('Hello ' + m.user?.first_name + ', this is a reminder from the MAJUSTWE Secretary. Your profile is incomplete. Please log into the portal and submit your Dependents and Guardians so you can be fully covered.')}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 font-bold shadow-sm transition-transform hover:scale-105">WhatsApp</a>
                      </td>"""

content = content.replace(target, replace)
codecs.open(r'C:\majustwe_portal\frontend\src\pages\SecretaryDashboard.tsx', 'w', 'utf-8').write(content)
print("Added nudge buttons")
