import codecs
content = codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'r', 'utf-8').read()

panel_html = """
      <div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="font-bold text-xl text-majustwe-blue mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Recruitment & Documentation Materials
        </h3>
        <p className="text-gray-700 mb-6 font-medium">Access and print official documents for recruiting new members or providing physical copies to schools.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => window.open('/join-us', '_blank')} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📰</span>
            <span>View Brochure</span>
          </button>
          
          <button onClick={() => window.open('/faq', '_blank')} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">❓</span>
            <span>View FAQs</span>
          </button>
          
          <button onClick={() => window.open('/membership-form', '_blank')} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📝</span>
            <span>Print Membership Form</span>
          </button>
        </div>
      </div>
"""

target_str = '<h3 className="font-bold text-xl text-majustwe-blue">Official Member Roster</h3>'
# We want to replace the whole div of "border border-white/60..." containing this string, so we'll just insert before it.
# Find the start of the div
idx = content.find(target_str)
if idx != -1:
    div_start = content.rfind('<div className="border border-white/60 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8">', 0, idx)
    if div_start != -1:
        content = content[:div_start] + panel_html + '\n      ' + content[div_start:]
        codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'w', 'utf-8').write(content)
        print("Success")
    else:
        print("Could not find div start")
else:
    print("Could not find target str")
