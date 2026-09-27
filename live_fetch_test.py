import json
import urllib.request

url_login = "https://majustwe-backend.onrender.com/api/auth/token/"
payload_login = json.dumps({"username": "37469219", "password": "password123"}).encode('utf-8')
req_login = urllib.request.Request(url_login, data=payload_login, headers={'Content-Type': 'application/json'})

with urllib.request.urlopen(req_login) as response:
    tokens = json.loads(response.read().decode('utf-8'))
    access = tokens['access']

urls = [
    '/welfare/profiles/',
    '/welfare/cases/',
    '/welfare/contributions/',
    '/welfare/minutes/'
]

for u in urls:
    full_url = f"https://majustwe-backend.onrender.com/api{u}"
    req = urllib.request.Request(full_url, headers={'Authorization': f'Bearer {access}'})
    try:
        with urllib.request.urlopen(req) as response:
            print(f"GET {u}: {response.getcode()}")
    except urllib.error.HTTPError as e:
        print(f"GET {u} failed: {e.code}")
        print(e.read().decode('utf-8'))
