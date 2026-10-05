import codecs
import re

content = codecs.open('backend/welfare/api/views.py', 'r', 'utf-8').read()

target = """        profile.status = MemberProfile.Status.PENDING_SECRETARY
        profile.save()
        return Response(MemberProfileSerializer(profile).data)"""

replacement = """        if not request.user.is_executive():
            profile.status = MemberProfile.Status.PENDING_SECRETARY
        profile.save()
        return Response(MemberProfileSerializer(profile).data)"""

content = content.replace(target, replacement)
codecs.open('backend/welfare/api/views.py', 'w', 'utf-8').write(content)
print("Fixed submit_details status override for executives")
