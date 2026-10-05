import codecs

content = codecs.open(r'C:\majustwe_portal\backend\welfare\api\views.py', 'r', 'utf-8').read()

target = """    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def secretary_approve(self, request, pk=None):"""

replace = """    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def send_reminder(self, request, pk=None):
        profile = self.get_object()
        
        if profile.status != MemberProfile.Status.ACTIVE_INCOMPLETE:
            return Response({'error': 'Can only send reminders to ACTIVE_INCOMPLETE profiles.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not profile.user or not profile.user.email:
            return Response({'error': 'User has no email address.'}, status=status.HTTP_400_BAD_REQUEST)
            
        import threading
        from django.core.mail import send_mail
        from django.conf import settings
        
        def send_reminder_email(user_email, first_name):
            subject = "MAJUSTWE - ACTION REQUIRED: Complete Your Profile"
            message = f"Hello {first_name},\\n\\nThis is a manual reminder from the Secretary.\\n\\nYour MAJUSTWE profile is still INCOMPLETE. You must declare your Dependents and Guardians to be fully covered.\\n\\nPlease log in to the portal immediately and submit your details in the Profile tab.\\n\\nRegards,\\nMAJUSTWE Secretary"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                pass
                
        threading.Thread(target=send_reminder_email, args=(profile.user.email, profile.user.first_name)).start()
        
        return Response({'success': True, 'message': 'Reminder email sent.'})

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def secretary_approve(self, request, pk=None):"""

content = content.replace(target, replace)
codecs.open(r'C:\majustwe_portal\backend\welfare\api\views.py', 'w', 'utf-8').write(content)
print("Added send_reminder to MemberProfileViewSet")
