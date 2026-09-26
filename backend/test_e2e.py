
import urllib.request
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def post(url, data, token=None):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'))
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    try:
        res = urllib.request.urlopen(req)
        return res.status, json.loads(res.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def get(url, token=None):
    req = urllib.request.Request(url)
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    try:
        res = urllib.request.urlopen(req)
        return res.status, json.loads(res.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def run_test():
    print('1. Registering new member...')
    status, data = post(f'{BASE_URL}/auth/register/', {
        'username': '99887766',
        'password': 'password123',
        'first_name': 'Test',
        'last_name': 'Member',
        'email': 'test@example.com',
        'phone': '0700000000',
        'member_type': 'FULL',
        'zone': 'TSIMBA_TIWI'
    })
    print(status, data)
    
    print('2. Treasurer logs in (jane)...')
    status, data = post(f'{BASE_URL}/auth/token/', {'username': 'jane', 'password': 'password'})
    treasurer_token = data['access']
    
    print('3. Get new member profile ID...')
    status, data = get(f'{BASE_URL}/welfare/profiles/', treasurer_token)
    new_profile = next(p for p in data if p['user']['username'] == '99887766')
    profile_id = new_profile['id']
    print(f'New member profile ID: {profile_id}')
    
    print('4. Treasurer approves payment...')
    status, data = post(f'{BASE_URL}/welfare/profiles/{profile_id}/treasurer_approve/', {}, treasurer_token)
    print(status, data)
    
    print('5. New member logs in...')
    status, data = post(f'{BASE_URL}/auth/token/', {'username': '99887766', 'password': 'password123'})
    member_token = data['access']
    
    print('6. Member submits Phase 2 details...')
    status, data = post(f'{BASE_URL}/welfare/profiles/{profile_id}/submit_details/', {
            'spouse_name': 'Jane Doe',
            'spouse_phone': '0799999999',
            'dependents': [{'name': 'Kid 1', 'relationship': 'CHILD'}],
            'guardians': [{'name': 'Guardian 1', 'relationship': 'PARENT', 'phone': '0711111111'}]
        }, member_token)
    print(status, data)
    
    print('7. Secretary logs in (sarah)...')
    status, data = post(f'{BASE_URL}/auth/token/', {'username': 'sarah', 'password': 'password'})
    sec_token = data['access']
    
    print('8. Secretary approves member...')
    status, data = post(f'{BASE_URL}/welfare/profiles/{profile_id}/secretary_approve/', {}, sec_token)
    print(status, data)
    
    print('9. Check member final status...')
    status, data = get(f'{BASE_URL}/welfare/profiles/{profile_id}/', member_token)
    print(status, data)
    
    print('ALL DONE! MEMBER IS FULLY REGISTERED!')

if __name__ == '__main__':
    run_test()

