from rest_framework import viewsets, permissions
from django.db.models import Sum
from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from users.models import User
from welfare.models import MemberProfile, Case, Contribution, Guardian, Dependent, MinuteRecord
from .serializers import UserSerializer, MemberProfileSerializer, CaseSerializer, ContributionSerializer, MinuteRecordSerializer
from .permissions import IsTreasurer, IsSecretary, IsExecutive, IsGenericOfficial, IsOwnerOrExecutive

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from welfare.models import MemberProfile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from welfare.models import MemberProfile

class MemberProfileViewSet(viewsets.ModelViewSet):
    queryset = MemberProfile.objects.all()
    serializer_class = MemberProfileSerializer
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return MemberProfile.objects.none()
        if user.is_executive():
            return MemberProfile.objects.all()
        return MemberProfile.objects.filter(user=user)
    
    def perform_update(self, serializer):
        profile = serializer.save()
        # If id_number was updated, sync it to the User's username
        if 'id_number' in serializer.validated_data:
            new_id_number = serializer.validated_data['id_number']
            if profile.user.username != new_id_number:
                from django.db import IntegrityError
                from rest_framework.exceptions import ValidationError
                try:
                    profile.user.username = new_id_number
                    profile.user.save()
                except IntegrityError:
                    raise ValidationError({'id_number': 'This ID Number is already registered to another user account.'})

    def get_permissions(self):
        if self.action in ['secretary_approve', 'secretary_reject']:
            permission_classes = [IsSecretary]
        elif self.action in ['treasurer_approve']:
            permission_classes = [IsTreasurer]
        elif self.action in ['list']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerOrExecutive]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_mpesa(self, request, pk=None):
        contribution = self.get_object()
        
        # Only allow if it belongs to them (or they are an admin)
        if not request.user.is_executive() and contribution.member.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)
            
        mpesa_code = request.data.get('mpesa_reference')
        if not mpesa_code:
            return Response({'error': 'M-Pesa code required'}, status=400)
            
        contribution.mpesa_reference = mpesa_code.upper()
        contribution.save()
        
        return Response({'status': 'M-Pesa reference saved'})

    @action(detail=True, methods=['post'], permission_classes=[IsTreasurer])
    def treasurer_approve(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.PENDING_TREASURER:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        profile.registration_fee_paid = request.data.get('registration_fee_paid', True)
        profile.emergency_kitty_paid = request.data.get('emergency_kitty_paid', True)
        profile.status = MemberProfile.Status.ACTIVE_INCOMPLETE
        profile.save()
        
        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrExecutive])
    def submit_details(self, request, pk=None):
        profile = self.get_object()
        # Allows submitting details if ACTIVE_INCOMPLETE or ACTIVE
        if not request.user.is_executive():
            if profile.status not in [MemberProfile.Status.ACTIVE_INCOMPLETE, MemberProfile.Status.ACTIVE]:
                return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Parse extra details
        profile.spouse_name = request.data.get('spouse_name', profile.spouse_name)
        profile.spouse_phone = request.data.get('spouse_phone', profile.spouse_phone)
        profile.phone = request.data.get('phone', profile.phone)
        
        # Update User email if provided
        new_email = request.data.get('email')
        if new_email is not None and new_email != profile.user.email:
            profile.user.email = new_email
            profile.user.save()
        
        # Save Guardians - only if they don't exist yet, or if the user is an Executive
        existing_guardians_count = Guardian.objects.filter(profile=profile).count()
        is_executive = request.user.is_executive()
        if existing_guardians_count == 0 or is_executive:
            guardians = request.data.get('guardians')
            if guardians is not None:
                if len(guardians) > 2: return Response({'error': 'Max 2 guardians'}, status=400)
                Guardian.objects.filter(profile=profile).delete()
                for g in guardians:
                    Guardian.objects.create(profile=profile, **g)
            
        # Save Dependents
        dependents = request.data.get('dependents')
        if dependents is not None:
            if len(dependents) > 4: return Response({'error': 'Max 4 dependents'}, status=400)
            Dependent.objects.filter(profile=profile).delete()
            for d in dependents:
                Dependent.objects.create(profile=profile, **d)
            
        # Stay as ACTIVE_INCOMPLETE until Secretary generates member ID
        profile.save()
        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
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
            message = f"Hello {first_name},\n\nThis is a manual reminder from the Secretary.\n\nYour MAJUSTWE profile is still INCOMPLETE. You must declare your Dependents and Guardians to be fully covered.\n\nPlease log in to the portal immediately and submit your details in the Profile tab.\n\nRegards,\nMAJUSTWE Secretary"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                pass
                
        threading.Thread(target=send_reminder_email, args=(profile.user.email, profile.user.first_name)).start()
        
        return Response({'success': True, 'message': 'Reminder email sent.'})

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def secretary_approve(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.ACTIVE_INCOMPLETE:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        profile.status = MemberProfile.Status.ACTIVE
        profile.save()
        profile.assign_member_id()
        
        # Send Approval Email
        import threading
        from django.core.mail import send_mail
        from django.conf import settings
        
        def send_approval_email(user_email, first_name, member_id):
            subject = "MAJUSTWE - Account Fully Activated!"
            message = f"Hello {first_name},\n\nCongratulations! Your MAJUSTWE profile has been reviewed and officially activated by the Secretary.\n\nYour official Member ID is: {member_id}\n\nYou are now a fully covered member of the welfare.\n\nRegards,\nMAJUSTWE Secretary"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                pass
                
        if profile.user and profile.user.email:
            threading.Thread(target=send_approval_email, args=(profile.user.email, profile.user.first_name, profile.member_id)).start()

        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def secretary_reject(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.ACTIVE_INCOMPLETE:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        profile.status = MemberProfile.Status.REJECTED
        profile.rejection_reason = request.data.get('rejection_reason', 'Details rejected by Secretary')
        profile.save()
        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def update_status_and_role(self, request, pk=None):
        profile = self.get_object()
        
        new_status = request.data.get('status')
        new_type = request.data.get('member_type')
        new_role = request.data.get('role')

        if new_status:
            profile.status = new_status
        if new_type:
            profile.member_type = new_type
            
        profile.save()

        if new_role and new_role in ['MEMBER', 'SECRETARY', 'TREASURER']:
            # If assigning Secretary or Treasurer, demote the current one to ensure only 1 exists
            if new_role in ['SECRETARY', 'TREASURER']:
                User.objects.filter(role=new_role).update(role='MEMBER')
            
            target_user = profile.user
            target_user.role = new_role
            target_user.save()

        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def force_password(self, request, pk=None):
        try:
            profile = self.get_object()
            new_password = request.data.get('new_password')
            if not new_password:
                return Response({'error': 'New password is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = profile.user
            user.set_password(new_password)
            user.save()
            return Response({'success': 'Password updated successfully.'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'], permission_classes=[IsSecretary])
    def delete_account(self, request, pk=None):
        profile = self.get_object()
        user = profile.user
        # Deleting the user will cascade and delete the MemberProfile as well
        user.delete()
        return Response({'success': 'Account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_profile(self, request):
        profile, created = MemberProfile.objects.get_or_create(user=request.user)
        return Response(MemberProfileSerializer(profile).data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from welfare.models import Case, Contribution, MemberProfile

class CaseViewSet(viewsets.ModelViewSet):
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
            message = f"Hello Member,\n\nA new welfare case has been announced by the Treasurer:\n\n{case_title}\n\nDetails: {case_desc}\n\nRequired Contribution: Kshs. {required_amount}\nDeadline: {deadline}\n\nPlease log in to the portal to view details and make your contribution within 7 days.\n\nRegards,\nMAJUSTWE Executive Committee"
            try:
                # We use recipient_list as the bcc (fail_silently=True) to avoid leaking emails
                from django.core.mail import EmailMessage
                email = EmailMessage(subject, message, settings.DEFAULT_FROM_EMAIL, bcc=emails)
                email.send(fail_silently=True)
            except Exception as e:
                pass
                
        threading.Thread(target=send_case_email, args=(instance.title, instance.description, instance.required_amount, instance.deadline)).start()
        

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsExecutive]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class ContributionViewSet(viewsets.ModelViewSet):
    queryset = Contribution.objects.all()
    serializer_class = ContributionSerializer
    

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsTreasurer]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_executive() or user.is_generic_official():
            return Contribution.objects.all()
        return Contribution.objects.filter(member__user=user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_mpesa(self, request, pk=None):
        contribution = self.get_object()
        
        # Only allow if it belongs to them (or they are an admin)
        if not request.user.is_executive() and contribution.member.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)
            
        mpesa_code = request.data.get('mpesa_reference')
        if not mpesa_code:
            return Response({'error': 'M-Pesa code required'}, status=400)
            
        contribution.mpesa_reference = mpesa_code.upper()
        contribution.save()
        
        return Response({'status': 'M-Pesa reference saved'})

    @action(detail=True, methods=['post'], permission_classes=[IsTreasurer])
    def mark_paid(self, request, pk=None):
        contribution = self.get_object()
        contribution.is_fully_paid = True
        contribution.amount_paid = contribution.welfare_case.required_amount
        contribution.mpesa_reference = request.data.get('mpesa_reference', '')
        contribution.date_paid = timezone.now()
        contribution.save()
        return Response(ContributionSerializer(contribution).data)

class MinuteRecordViewSet(viewsets.ModelViewSet):
    queryset = MinuteRecord.objects.all().order_by('-date')
    serializer_class = MinuteRecordSerializer
    

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsSecretary]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
