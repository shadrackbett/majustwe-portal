import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

try:
    u = User.objects.get(username='37469219')
    u.role = 'SECRETARY'
    u.save()
    print("Repromoted 37469219 to SECRETARY")
except Exception as e:
    print(f"Failed to promote: {e}")
