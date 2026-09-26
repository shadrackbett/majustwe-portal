import os
import django
import codecs

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from welfare.models import Case, Contribution

case = Case.objects.order_by('-id').first()
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
    lines.append(f"{m.member_id} {name} - {case.required_amount}/= \u2705")
    total_paid += case.required_amount

for c in unpaid_contribs:
    m = c.member
    name = f"{m.user.first_name} {m.user.last_name}"
    lines.append(f"{m.member_id} {name} -")

lines.append("")
lines.append(f"*TOTAL KSH {int(total_paid):,}/=*")

codecs.open('final_ledger.txt', 'w', 'utf-8').write('\\n'.join(lines))
print("Ledger generated!")
