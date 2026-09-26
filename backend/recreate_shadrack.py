import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from welfare.models import MemberProfile, Case, Contribution, MinuteRecord, Dependent, Guardian

User = get_user_model()

print("Wiping all non-superuser data...")
Case.objects.all().delete()
Contribution.objects.all().delete()
MinuteRecord.objects.all().delete()
User.objects.filter(is_superuser=False).delete()

print("Creating Shadrack Bett...")

user = User.objects.create_user(
    username="37469219",
    password="password123",
    first_name="Shadrack",
    last_name="Bett",
    email="shadrack@example.com",
    role="SECRETARY"
)

profile = MemberProfile.objects.create(
    user=user,
    id_number="37469219",
    phone="0723410985",
    current_workstation="Magombani JS",
    zone="TSIMBA_TIWI",
    home_subcounty="Aldai",
    member_type="FULL",
    status="ACTIVE",
    member_id=13,
    registration_fee_paid=True,
    emergency_kitty_paid=True
)

Guardian.objects.create(
    profile=profile,
    name="Isaac Sang",
    relationship="Father",
    phone="0723410985"
)

print("Database reset complete!")
