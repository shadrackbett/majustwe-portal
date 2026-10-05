import codecs

content = codecs.open(r'C:\majustwe_portal\backend\users\views.py', 'r', 'utf-8').read()

target = """        return Response({'success': True, 'message': 'Registration successful'}, status=status.HTTP_201_CREATED)"""

replace = """        
        # Send Welcome Email
        import threading
        from django.core.mail import send_mail
        from django.conf import settings
        from welfare.models import MemberProfile
        
        def send_welcome_email(user_email, first_name):
            try:
                treasurer_profile = MemberProfile.objects.filter(user__role='TREASURER').first()
                treasurer_phone = treasurer_profile.phone if treasurer_profile else 'the Treasurer via official channels'
            except Exception:
                treasurer_phone = 'the Treasurer via official channels'
                
            subject = "Welcome to MAJUSTWE - Registration Received"
            message = f"Hello {first_name},\\n\\nThank you for registering with the Matuga Junior Schools Teachers' Welfare (MAJUSTWE).\\n\\nYour profile has been received and is currently Pending Treasurer Approval.\\n\\nNext Steps:\\n1. Pay the non-refundable registration fee of Ksh 100.\\n2. Pay the refundable Emergency Kitty fee of Ksh 500.\\n\\nPlease make your payment via M-Pesa to {treasurer_phone} and await confirmation on the portal.\\n\\nRegards,\\nMAJUSTWE Executive Committee"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                print(f"Failed to send email: {e}")
                
        if email:
            threading.Thread(target=send_welcome_email, args=(email, first_name)).start()

        return Response({'success': True, 'message': 'Registration successful'}, status=status.HTTP_201_CREATED)"""

content = content.replace(target, replace)
codecs.open(r'C:\majustwe_portal\backend\users\views.py', 'w', 'utf-8').write(content)
print("Fixed RegisterView Welcome Email with Treasurer phone")
