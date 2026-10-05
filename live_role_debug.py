import json
import urllib.request
import base64

url_login = "https://majustwe-backend.onrender.com/api/auth/token/"
payload_login = json.dumps({"username": "37469219", "password": "password123"}).encode('utf-8')
req_login = urllib.request.Request(url_login, data=payload_login, headers={'Content-Type': 'application/json'})

with urllib.request.urlopen(req_login) as response:
    tokens = json.loads(response.read().decode('utf-8'))
    access = tokens['access']
    
    # decode JWT
    parts = access.split('.')
    payload = base64.urlsafe_b64decode(parts[1] + '==').decode('utf-8')
    data = json.loads(payload)
    role = data.get('role')
    
    print(f"Role string: '{role}'")
    print(f"Role length: {len(role)}")
    for c in role:
        print(f"{c}: {ord(c)}")
