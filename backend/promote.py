import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from welfare.models import MemberProfile

try:
    u = User.objects.get(username='37469219')
    u.role = 'SECRETARY'
    u.save()
    
    p = MemberProfile.objects.get(user=u)
    p.status = 'ACTIVE'
    p.save()
    print("Promoted 37469219 to SECRETARY and ACTIVE")
except Exception as e:
    print(f"Failed to promote: {e}")
