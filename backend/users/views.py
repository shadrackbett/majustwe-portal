from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from welfare.models import MemberProfile
from rest_framework.permissions import AllowAny

User = get_user_model()

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        email = data.get('email', '')
        zone = data.get('zone', 'TSIMBA_TIWI')
        member_type = data.get('member_type', 'FULL')
        phone = data.get('phone', '')

        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        # Create profile (pending treasurer approval)
        MemberProfile.objects.create(
            user=user,
            zone=zone,
            member_type=member_type,
            phone=phone,
            status='PENDING_TREASURER'
        )

        
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
            message = f"Hello {first_name},\n\nThank you for registering with the Matuga Junior Schools Teachers' Welfare (MAJUSTWE).\n\nYour profile has been received and is currently Pending Treasurer Approval.\n\nNext Steps:\n1. Pay the non-refundable registration fee of Ksh 100.\n2. Pay the refundable Emergency Kitty fee of Ksh 500.\n\nPlease make your payment via M-Pesa to {treasurer_phone} and await confirmation on the portal.\n\nRegards,\nMAJUSTWE Executive Committee"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                print(f"Failed to send email: {e}")
                
        if email:
            threading.Thread(target=send_welcome_email, args=(email, first_name)).start()

        return Response({'success': True, 'message': 'Registration successful'}, status=status.HTTP_201_CREATED)

from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'detail': 'Invalid old password.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password updated successfully.'})

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Return success even if not found to prevent email enumeration
            return Response({'detail': 'If an account with this email exists, a reset link has been sent.'})
            
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Hardcoding the frontend URL for now, could be an env var
        reset_link = f"https://majustwe-portal-mu.vercel.app/reset-password?uid={uid}&token={token}"
        
        subject = "MAJUSTWE Portal - Password Reset"
        message = f"Hello {user.first_name},\\n\\nYou requested a password reset for your MAJUSTWE account.\\n\\nClick the link below to set a new password:\\n{reset_link}\\n\\nIf you did not request this, please ignore this email.\\n\\nRegards,\\nMAJUSTWE Secretary"
        
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
        except Exception as e:
            print(f"Failed to send email: {e}")
            
        return Response({'detail': 'If an account with this email exists, a reset link has been sent.'})

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return Response({'detail': 'Missing parameters.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password has been reset successfully.'})
