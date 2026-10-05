import codecs

content = codecs.open(r'C:\majustwe_portal\backend\welfare\api\views.py', 'r', 'utf-8').read()

target_case = """class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    
    def get_permissions(self):"""

replace_case = """class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    
    def perform_create(self, serializer):
        instance = serializer.save()
        
        # Send Case Announcement Email
        import threading
        from django.core.mail import send_mail
        from django.conf import settings
        from django.contrib.auth import get_user_model
        
        def send_case_email(case_title, case_desc, required_amount, deadline):
            User = get_user_model()
            # Send to all users who have an active profile
            emails = list(User.objects.filter(memberprofile__status='ACTIVE', email__isnull=False).exclude(email='').values_list('email', flat=True))
            if not emails: return
            
            subject = f"MAJUSTWE NEW CASE: {case_title}"
            message = f"Hello Member,\\n\\nA new welfare case has been announced by the Treasurer:\\n\\n{case_title}\\n\\nDetails: {case_desc}\\n\\nRequired Contribution: Kshs. {required_amount}\\nDeadline: {deadline}\\n\\nPlease log in to the portal to view details and make your contribution within 7 days.\\n\\nRegards,\\nMAJUSTWE Executive Committee"
            try:
                # We use recipient_list as the bcc (fail_silently=True) to avoid leaking emails
                from django.core.mail import EmailMessage
                email = EmailMessage(subject, message, settings.DEFAULT_FROM_EMAIL, bcc=emails)
                email.send(fail_silently=True)
            except Exception as e:
                pass
                
        threading.Thread(target=send_case_email, args=(instance.title, instance.description, instance.required_amount, instance.deadline)).start()
        
    def get_permissions(self):"""

content = content.replace(target_case, replace_case)

codecs.open(r'C:\majustwe_portal\backend\welfare\api\views.py', 'w', 'utf-8').write(content)
print("Updated CaseViewSet")
