import codecs

# Fix App.tsx
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()
content = content.replace("const location = useLocation();", "")
content = content.replace("const handleLogout = () => {\n    logout();\n    navigate('/');\n    setMobileMenuOpen(false);\n  };", "")
codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)

# Fix AuthContext.tsx
content = codecs.open('frontend/src/context/AuthContext.tsx', 'r', 'utf-8').read()
content = content.replace("import jwt_decode from 'jwt-decode';", "")
codecs.open('frontend/src/context/AuthContext.tsx', 'w', 'utf-8').write(content)

# Fix Register.tsx
content = codecs.open('frontend/src/pages/Register.tsx', 'r', 'utf-8').read()
content = content.replace("const { members, setMembers } = useContext(DatabaseContext);", "const { members } = useContext(DatabaseContext);")
codecs.open('frontend/src/pages/Register.tsx', 'w', 'utf-8').write(content)

# Fix SecretaryDashboard.tsx
content = codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'r', 'utf-8').read()
content = content.replace("const { members, setMembers, minutes, setMinutes, refreshData } = useContext(DatabaseContext);", "const { members, refreshData } = useContext(DatabaseContext);")
codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'w', 'utf-8').write(content)

# Fix TreasurerDashboard.tsx
content = codecs.open('frontend/src/pages/TreasurerDashboard.tsx', 'r', 'utf-8').read()
content = content.replace("const { members, cases, setCases, contributions, setContributions, refreshData } = useContext(DatabaseContext);", "const { members, cases, contributions, refreshData } = useContext(DatabaseContext);")
content = content.replace("const zone = members.find(m => m.id === c.member)?.zone || '';", "")
content = content.replace("const generateWhatsAppDefaulters = () => {\n    if (!caseObj) return;\n    const unpaidContribs = contributions.filter(c => c.welfare_case === selectedCaseId && !c.is_fully_paid);\n    let text = `*DEFAULTERS LIST - ${caseObj.title}*\\n\\n`;\n    unpaidContribs.forEach((c, index) => {\n      const member = members.find(m => m.id === c.member);\n      const name = `${member?.user?.first_name || ''} ${member?.user?.last_name || ''}`;\n      const memberNo = member?.member_id ? `M${String(member.member_id).padStart(3, '0')}` : 'PENDING';\n      text += `${index + 1}. ${name} (${memberNo}) - Ksh ${caseObj.required_amount}\\n`;\n    });\n    text += `\\n*Total Defaulters:* ${unpaidContribs.length}\\n`;\n    text += `*Total Amount Defaulted:* Ksh ${unpaidContribs.length * caseObj.required_amount}\\n`;\n    navigator.clipboard.writeText(text);\n    alert('Defaulters list copied to clipboard!');\n  };", "")
codecs.open('frontend/src/pages/TreasurerDashboard.tsx', 'w', 'utf-8').write(content)

# Fix package.json (remove CI=false)
content = codecs.open('frontend/package.json', 'r', 'utf-8').read()
content = content.replace('"build": "CI=false react-scripts build",', '"build": "react-scripts build",')
codecs.open('frontend/package.json', 'w', 'utf-8').write(content)

print("Fixed all ESLint warnings")
