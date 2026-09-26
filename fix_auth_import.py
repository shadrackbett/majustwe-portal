import codecs

content = codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'r', 'utf-8').read()

if "import { AuthContext } from '../context/AuthContext';" not in content:
    content = content.replace(
        "import { DatabaseContext } from '../context/DatabaseContext';", 
        "import { DatabaseContext } from '../context/DatabaseContext';\nimport { AuthContext } from '../context/AuthContext';"
    )
    codecs.open('frontend/src/pages/SecretaryDashboard.tsx', 'w', 'utf-8').write(content)
