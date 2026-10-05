import json
import urllib.request

# Login as Secretary to check profiles
url_login = "https://majustwe-backend.onrender.com/api/auth/token/"
payload_login = json.dumps({"username": "37469219", "password": "password123"}).encode('utf-8')
req_login = urllib.request.Request(url_login, data=payload_login, headers={'Content-Type': 'application/json'})

with urllib.request.urlopen(req_login) as response:
    tokens = json.loads(response.read().decode('utf-8'))
    access = tokens['access']

url_profiles = "https://majustwe-backend.onrender.com/api/welfare/profiles/"
req_profiles = urllib.request.Request(url_profiles, headers={'Authorization': f'Bearer {access}'})

with urllib.request.urlopen(req_profiles) as response:
    profiles = json.loads(response.read().decode('utf-8'))
    
    print(f"Total Profiles in Database: {len(profiles)}")
    for p in profiles:
        user = p.get('user', {})
        print(f" - {user.get('first_name')} {user.get('last_name')} (TSC: {user.get('username')}) | Status: {p.get('status')}")
