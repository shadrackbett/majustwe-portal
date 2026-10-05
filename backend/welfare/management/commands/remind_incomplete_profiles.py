from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from welfare.models import MemberProfile
import threading

class Command(BaseCommand):
    help = 'Sends automated email reminders to users with ACTIVE_INCOMPLETE profiles.'

    def handle(self, *args, **kwargs):
        incomplete_profiles = MemberProfile.objects.filter(status=MemberProfile.Status.ACTIVE_INCOMPLETE)
        
        count = 0
        for profile in incomplete_profiles:
            if not profile.user or not profile.user.email:
                continue
                
            subject = "MAJUSTWE - Action Required: Complete Your Profile"
            message = f"Hello {profile.user.first_name},\\n\\nYour MAJUSTWE profile is currently incomplete (missing Dependents or Guardians).\\n\\nYou cannot receive welfare benefits or view active cases until this is completed.\\n\\nPlease log in to the portal and submit your details in the Profile tab as soon as possible.\\n\\nRegards,\\nMAJUSTWE Executive Committee"
            
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [profile.user.email])
                count += 1
            except Exception as e:
                self.stderr.write(f"Failed to send email to {profile.user.email}: {e}")
                
        self.stdout.write(self.style.SUCCESS(f'Successfully sent {count} reminder emails.'))
