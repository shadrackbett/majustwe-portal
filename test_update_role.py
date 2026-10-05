import json
import urllib.request

# 1. Login as Secretary
url_login = "https://majustwe-backend.onrender.com/api/auth/token/"
payload_login = json.dumps({"username": "37469219", "password": "password123"}).encode('utf-8')
req_login = urllib.request.Request(url_login, data=payload_login, headers={'Content-Type': 'application/json'})

with urllib.request.urlopen(req_login) as response:
    tokens = json.loads(response.read().decode('utf-8'))
    access = tokens['access']

# 2. Get the test user's profile ID
url_profiles = "https://majustwe-backend.onrender.com/api/welfare/profiles/"
req_profiles = urllib.request.Request(url_profiles, headers={'Authorization': f'Bearer {access}'})

with urllib.request.urlopen(req_profiles) as response:
    profiles = json.loads(response.read().decode('utf-8'))
    test_user_profile_id = None
    for p in profiles:
        if p.get('user', {}).get('username') == '90501543':
            test_user_profile_id = p.get('id')

print(f"Test user profile ID: {test_user_profile_id}")

# 3. Attempt to change role to TREASURER
if test_user_profile_id:
    url_update = f"https://majustwe-backend.onrender.com/api/welfare/profiles/{test_user_profile_id}/update_status_and_role/"
    payload_update = json.dumps({
        "status": "ACTIVE",
        "member_type": "FULL",
        "role": "TREASURER"
    }).encode('utf-8')
    req_update = urllib.request.Request(url_update, data=payload_update, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access}'
    })
    
    try:
        with urllib.request.urlopen(req_update) as response:
            print("Status Code:", response.getcode())
            print("Response:", response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
        print("Response:", e.read().decode('utf-8'))
    except Exception as e:
        print("Error:", e)
