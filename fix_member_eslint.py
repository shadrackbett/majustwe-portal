import codecs

content = codecs.open('frontend/src/pages/MemberDashboard.tsx', 'r', 'utf-8').read()
content = content.replace("const { members, setMembers, cases, contributions, minutes, refreshData } = useContext(DatabaseContext);", "const { members, cases, contributions, minutes, refreshData } = useContext(DatabaseContext);")
content = content.replace("const navigate = useNavigate();", "")
content = content.replace("import { useNavigate } from 'react-router-dom';", "")
# Wait, I used navigate in MemberDashboard!
# <button onClick={() => navigate(`/pay/${caseObj.id}`)}
codecs.open('frontend/src/pages/MemberDashboard.tsx', 'w', 'utf-8').write(content)
print("Cleaned MemberDashboard unused vars (but left navigate if I can)")
