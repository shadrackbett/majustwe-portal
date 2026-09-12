from celery import shared_task
from .services.pdf_generator import generate_membership_pdf

@shared_task
def generate_and_email_pdf(profile_id, email):
    """
    Background task to generate a PDF and email it to the user.
    """
    pdf_path = generate_membership_pdf(profile_id)
    # Email logic would go here
    return f"PDF generated at {pdf_path}"

@shared_task
def send_bulk_notification(message, role=None):
    """
    Background task to send bulk SMS or WhatsApp messages.
    """
    # Integration with Africa's Talking / Twilio would go here
    return f"Sent message: {message}"
