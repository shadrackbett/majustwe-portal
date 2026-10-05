import json
import urllib.request
import time

url_register = "https://majustwe-backend.onrender.com/api/auth/register/"
test_username = f"999{int(time.time())}"[-8:] # Generate a random 8-digit TSC number

payload = json.dumps({
    "username": test_username,
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User",
    "email": "majustwe@gmail.com",
    "id_number": f"ID{test_username}",
    "current_workstation": "Test Primary School"
}).encode('utf-8')

req = urllib.request.Request(url_register, data=payload, headers={'Content-Type': 'application/json'})

print(f"Attempting to register new user with TSC No: {test_username}...")

try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.getcode())
        print("Response:", response.read().decode('utf-8'))
        print("Registration SUCCESSFUL! The backend properly received and logged the new member.")
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Response:", e.read().decode('utf-8'))
    print("Registration FAILED!")
except Exception as e:
    print("Error:", e)
