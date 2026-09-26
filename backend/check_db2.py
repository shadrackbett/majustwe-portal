import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
print("Users:")
for u in User.objects.all():
    print(f"ID: {u.id}, Username: {u.username}, Role: {u.role}")

from welfare.models import MemberProfile
print("\nProfiles:")
for p in MemberProfile.objects.all():
    print(f"ID: {p.id}, User ID: {p.user.id}, Status: {p.status}, Member Type: {p.member_type}")
