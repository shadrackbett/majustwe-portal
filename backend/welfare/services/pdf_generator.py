import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.conf import settings
from welfare.models import MemberProfile

def generate_membership_pdf(profile_id):
    try:
        profile = MemberProfile.objects.get(id=profile_id)
    except MemberProfile.DoesNotExist:
        return None

    filename = f"member_{profile.member_id or 'pending'}.pdf"
    
    # Ensure media directory exists
    media_root = os.path.join(settings.BASE_DIR, 'media')
    os.makedirs(media_root, exist_ok=True)
    
    filepath = os.path.join(media_root, filename)
    
    c = canvas.Canvas(filepath, pagesize=letter)
    c.drawString(100, 750, "MAJUSTWE Welfare Association")
    c.drawString(100, 730, "Membership Form")
    
    c.drawString(100, 690, f"Name: {profile.user.get_full_name()}")
    c.drawString(100, 670, f"Member ID: {profile.member_id or 'N/A'}")
    c.drawString(100, 650, f"Status: {profile.status}")
    c.drawString(100, 630, f"Next of Kin: {profile.next_of_kin_name}")
    c.drawString(100, 610, f"Next of Kin Phone: {profile.next_of_kin_phone}")
    c.drawString(100, 590, f"Joined: {profile.joined_at.strftime('%Y-%m-%d')}")
    
    c.save()
    return filepath
