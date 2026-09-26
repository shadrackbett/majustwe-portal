import codecs
content = codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'r', 'utf-8').read()

content = content.replace(
    '<div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">',
    '<div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 max-h-[90vh] overflow-y-auto">'
)

codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'w', 'utf-8').write(content)
