import requests

url = "https://majustwe-backend.onrender.com/api/users/register/"
payload = {
    "username": "37469219",
    "password": "password123",
    "first_name": "Shadrack",
    "last_name": "Bett",
    "email": "shadrack@example.com"
}
response = requests.post(url, json=payload)
print("Status Code:", response.status_code)
print("Response:", response.text)
