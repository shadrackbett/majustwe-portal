import codecs
import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from welfare.models import MemberProfile, Case, Contribution
from datetime import timedelta
from django.utils import timezone

print(f"Initial profiles: {MemberProfile.objects.count()}")

# 1. Create 150 members
zones = ["Kinarini JS", "Vinuni JS", "Waa JS", "Mwamgunga JS", "Jorori JS", "Tiwi JS", "Chongolo JS", "Mwachema JS"]
names = ["Rama Zuma", "Angela Matsolo", "Abdallah Wesonga", "Nrimo Nderi", "Moses Kimeu", "Hadija Muhamed", "Mesaid Mwakaribu", "Asha Ali", "Alice Mwangi", "Victor Omega"]

if MemberProfile.objects.count() < 150:
    for i in range(150):
        # Create user
        username = f"999{i:04d}"
        first_name = random.choice([n.split()[0] for n in names])
        last_name = random.choice([n.split()[1] for n in names])
        user, _ = User.objects.get_or_create(username=username, defaults={
            'first_name': first_name,
            'last_name': last_name,
            'email': f"{username}@example.com",
            'role': 'MEMBER'
        })
        user.set_password("password123")
        user.save()
        
        # Create profile
        MemberProfile.objects.get_or_create(
            user=user, 
            defaults={
                'member_id': 1000 + i,
                'phone': f"0700{i:06d}",
                'zone': random.choice(zones),
                'status': 'ACTIVE',
                'member_type': 'FULL'
            }
        )

print(f"Created profiles. Total: {MemberProfile.objects.count()}")

# 2. Create Case
case = Case.objects.create(
    title="Bereavement: Test Case 150",
    description="HELLO MEMBERS. FOLLOWING THE DEMISE OF THE BELOVED FATHER OF TEST MEMBER. YOU ARE REQUIRED TO CHANNEL YOUR CONTRIBUTION OF KSH 200 TO THE TREASERER MPESA NO: 0704532706",
    required_amount=200,
    is_active=True
)
print(f"Created Case {case.id}")

# 3. Create Contributions for all ACTIVE FULL members
active_members = MemberProfile.objects.filter(status='ACTIVE', member_type='FULL')
for m in active_members:
    Contribution.objects.create(
        member=m,
        welfare_case=case,
        amount_paid=0,
        is_fully_paid=False
    )
print(f"Created {active_members.count()} contributions.")

# 4. Simulate Random Payments (70% pay)
contributions = Contribution.objects.filter(welfare_case=case)
paid_count = 0
for c in contributions:
    if random.random() < 0.7:
        c.is_fully_paid = True
        c.amount_paid = 200
        c.mpesa_reference = f"QAB{random.randint(1000000, 9999999)}"
        c.save()
        paid_count += 1
print(f"{paid_count} members paid.")

# 5. Generate the Ledger! (Mocking the frontend JS)
paid_contribs = list(Contribution.objects.filter(welfare_case=case, is_fully_paid=True).order_by('member__member_id'))
unpaid_contribs = list(Contribution.objects.filter(welfare_case=case, is_fully_paid=False).order_by('member__member_id'))

lines = []
lines.append(case.description)
lines.append("")
lines.append(f"*DATE OF ANNOUNCEMENT* *{case.created_at.strftime('%d %B %Y')}*")
lines.append(f"*DEADLINE* *14th July 2026*")
lines.append("")
lines.append(f"*CASE NO. {case.id}*")
lines.append("")
lines.append("*ACTIVE MEMBERS*")
lines.append("")

total_paid = 0
for c in paid_contribs:
    m = c.member
    name = f"{m.user.first_name} {m.user.last_name}"
    lines.append(f"{m.member_id} {name} - {case.required_amount}/= ✅")
    total_paid += case.required_amount

for c in unpaid_contribs:
    m = c.member
    name = f"{m.user.first_name} {m.user.last_name}"
    lines.append(f"{m.member_id} {name} -")

lines.append("")
lines.append(f"*TOTAL KSH {int(total_paid):,}/=*")

# 6. Close the case (this triggers suspension engine)
case.is_active = False
case.save()

# Manually trigger suspension engine for this script run since we bypassed the ViewSet
for c in unpaid_contribs:
    m = c.member
    from django.db.models import Sum
    total_default = Contribution.objects.filter(
        member=m,
        is_fully_paid=False,
        welfare_case__is_active=False
    ).aggregate(total=Sum('welfare_case__required_amount'))['total'] or 0
    if total_default > 500 and m.status != 'SUSPENDED':
        m.status = 'SUSPENDED'
        m.save()

print("\\n--- LEDGER OUTPUT ---\\n")
print("\\n".join(lines))
print("\\n-----------------------\\n")
