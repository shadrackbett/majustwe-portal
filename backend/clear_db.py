import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from welfare.models import Case, Contribution

users_to_delete = User.objects.exclude(username='37469219')
deleted_users = users_to_delete.delete()
print(f"Deleted users: {deleted_users}")

cases_to_delete = Case.objects.all()
deleted_cases = cases_to_delete.delete()
print(f"Deleted cases: {deleted_cases}")

print("Database cleared!")
