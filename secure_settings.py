import codecs

content = codecs.open(r'C:\majustwe_portal\backend\config\settings.py', 'r', 'utf-8').read()

target1 = """SECRET_KEY = 'django-insecure-dummy-key-for-dev'

DEBUG = True

ALLOWED_HOSTS = ['*']"""

replace1 = """SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-dummy-key-for-dev')

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'majustwe-portal-api.onrender.com,localhost,127.0.0.1').split(',')"""

content = content.replace(target1, replace1)

target2 = """CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True"""

replace2 = """CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://majustwe-portal-mu.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
]
CORS_ALLOW_CREDENTIALS = True"""

content = content.replace(target2, replace2)

codecs.open(r'C:\majustwe_portal\backend\config\settings.py', 'w', 'utf-8').write(content)
print("Updated settings.py for production security")
