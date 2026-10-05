import urllib.request
import re

url = "https://majustwe-portal-mu.vercel.app/"
print(f"Fetching {url}")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    js_files = re.findall(r'src="(/static/js/main\.[a-z0-9]+\.js)"', html)
    if not js_files:
        print("No main JS bundle found.")
    else:
        js_url = url.rstrip('/') + js_files[0]
        print(f"Fetching JS bundle: {js_url}")
        req_js = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_js) as res_js:
            js_content = res_js.read().decode('utf-8')
            
        if "api.qrserver.com" in js_content:
            print("QR Code found in live JS bundle!")
        else:
            print("QR Code NOT found in live JS bundle.")
            
except Exception as e:
    print(f"Error: {e}")
