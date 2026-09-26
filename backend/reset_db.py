import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from welfare.models import MemberProfile, Case, Contribution, MinuteRecord, Dependent, Guardian

User = get_user_model()

print("Clearing all non-superuser data...")
# Delete all welfare related records
Case.objects.all().delete()
Contribution.objects.all().delete()
MinuteRecord.objects.all().delete()

# Delete non-superusers (which will cascade to MemberProfiles, Dependents, Guardians)
User.objects.filter(is_superuser=False).delete()

print("Creating Shadrack Bett as Member 13 and Secretary...")

# Create user
user = User.objects.create_user(
    username="shadrack",
    password="password123",
    first_name="Shadrack",
    last_name="Bett",
    email="shadrack@example.com",
    role="SECRETARY"
)

# Create Member Profile
profile = MemberProfile.objects.create(
    user=user,
    phone="0700000000",
    member_type="FULL",
    zone="TSIMBA_TIWI",
    status="ACTIVE",
    member_id="M0013",
    registration_fee_paid=True,
    emergency_kitty_paid=True
)

print("Database reset complete!")
print("Login credentials:")
print("Username: shadrack")
print("Password: password123")
