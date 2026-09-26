import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from welfare.models import MemberProfile

User = get_user_model()
user = User.objects.get(username="shadrack")

MemberProfile.objects.create(
    user=user,
    phone="0700000000",
    member_type="FULL",
    zone="TSIMBA_TIWI",
    status="ACTIVE",
    member_id=13,
    registration_fee_paid=True,
    emergency_kitty_paid=True
)

print("Profile created successfully!")
