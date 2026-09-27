import json
import urllib.request

url = "https://majustwe-backend.onrender.com/api/auth/token/"
payload = json.dumps({
    "username": "37469219",
    "password": "password123"
}).encode('utf-8')

req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.getcode())
        print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
