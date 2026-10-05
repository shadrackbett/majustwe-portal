import codecs

content = codecs.open(r'C:\majustwe_portal\frontend\src\pages\MemberDashboard.tsx', 'r', 'utf-8').read()

target = """        {activeTab === 'CONTRIBUTIONS' && ("""

replace = """        {activeTab !== 'PROFILE' && profile?.status === 'ACTIVE_INCOMPLETE' && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Incomplete</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your profile is missing critical details (Dependents and Guardians). You cannot access welfare benefits, records, or make contributions until you declare them.
            </p>
            <button onClick={() => setActiveTab('PROFILE')} className="mt-6 bg-majustwe-blue text-white px-6 py-2 rounded-full font-bold hover:bg-blue-900 transition-colors">
              Go to Profile Tab
            </button>
          </div>
        )}
        
        {activeTab === 'CONTRIBUTIONS' && profile?.status !== 'ACTIVE_INCOMPLETE' && ("""

content = content.replace(target, replace)

target_minutes = """        {activeTab === 'MINUTES' && ("""
replace_minutes = """        {activeTab === 'MINUTES' && profile?.status !== 'ACTIVE_INCOMPLETE' && ("""
content = content.replace(target_minutes, replace_minutes)

target_officials = """        {activeTab === 'OFFICIALS' && ("""
replace_officials = """        {activeTab === 'OFFICIALS' && profile?.status !== 'ACTIVE_INCOMPLETE' && ("""
content = content.replace(target_officials, replace_officials)

codecs.open(r'C:\majustwe_portal\frontend\src\pages\MemberDashboard.tsx', 'w', 'utf-8').write(content)
print("Locked tabs for ACTIVE_INCOMPLETE")
