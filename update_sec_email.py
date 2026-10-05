import codecs

content = codecs.open(r'C:\majustwe_portal\backend\welfare\api\views.py', 'r', 'utf-8').read()

target_sec = """        profile.status = MemberProfile.Status.ACTIVE
        profile.save()
        profile.assign_member_id()
        return Response(MemberProfileSerializer(profile).data)"""

replace_sec = """        profile.status = MemberProfile.Status.ACTIVE
        profile.save()
        profile.assign_member_id()
        
        # Send Approval Email
        import threading
        from django.core.mail import send_mail
        from django.conf import settings
        
        def send_approval_email(user_email, first_name, member_id):
            subject = "MAJUSTWE - Account Fully Activated!"
            message = f"Hello {first_name},\\n\\nCongratulations! Your MAJUSTWE profile has been reviewed and officially activated by the Secretary.\\n\\nYour official Member ID is: {member_id}\\n\\nYou are now a fully covered member of the welfare.\\n\\nRegards,\\nMAJUSTWE Secretary"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                pass
                
        if profile.user and profile.user.email:
            threading.Thread(target=send_approval_email, args=(profile.user.email, profile.user.first_name, profile.member_id)).start()

        return Response(MemberProfileSerializer(profile).data)"""

content = content.replace(target_sec, replace_sec)

# Now let's add email to Case creation (which is in `CaseViewSet.create` or `CaseViewSet.perform_create`?)
# Let's check if CaseViewSet exists and if it has perform_create.
codecs.open(r'C:\majustwe_portal\backend\welfare\api\views.py', 'w', 'utf-8').write(content)
print("Updated secretary_approve")
