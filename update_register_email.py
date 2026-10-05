import codecs
import re

content = codecs.open(r'C:\majustwe_portal\backend\users\views.py', 'r', 'utf-8').read()

target = """        return Response({
            'user': UserSerializer(user).data,
            'profile': MemberProfileSerializer(profile).data
        }, status=status.HTTP_201_CREATED)"""

replace = """        
        # Send Welcome Email
        import threading
        from django.core.mail import send_mail
        from django.conf import settings
        
        def send_welcome_email(user_email, first_name):
            subject = "Welcome to MAJUSTWE - Registration Received"
            message = f"Hello {first_name},\\n\\nThank you for registering with the Matuga Junior Schools Teachers' Welfare (MAJUSTWE).\\n\\nYour profile has been received and is currently Pending Treasurer Approval.\\n\\nNext Steps:\\n1. Pay the non-refundable registration fee of Ksh 100.\\n2. Pay the refundable Emergency Kitty fee of Ksh 500.\\n\\nPlease make your payments and await the Treasurer's confirmation on the portal.\\n\\nRegards,\\nMAJUSTWE Executive Committee"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                print(f"Failed to send email: {e}")
                
        if email:
            threading.Thread(target=send_welcome_email, args=(email, first_name)).start()

        return Response({
            'user': UserSerializer(user).data,
            'profile': MemberProfileSerializer(profile).data
        }, status=status.HTTP_201_CREATED)"""

content = content.replace(target, replace)
codecs.open(r'C:\majustwe_portal\backend\users\views.py', 'w', 'utf-8').write(content)
print("Updated RegisterView with Welcome Email")
