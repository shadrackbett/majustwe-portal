from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from users.models import User
from welfare.models import MemberProfile, Case, Contribution, Guardian, Dependent
from .serializers import UserSerializer, MemberProfileSerializer, CaseSerializer, ContributionSerializer
from .permissions import IsTreasurer, IsSecretary, IsExecutive, IsGenericOfficial, IsOwnerOrExecutive

class MemberProfileViewSet(viewsets.ModelViewSet):
    queryset = MemberProfile.objects.all()
    serializer_class = MemberProfileSerializer
    
    def get_permissions(self):
        if self.action in ['secretary_approve', 'secretary_reject']:
            permission_classes = [IsSecretary]
        elif self.action in ['treasurer_approve']:
            permission_classes = [IsTreasurer]
        elif self.action in ['list']:
            permission_classes = [IsExecutive | IsGenericOfficial]
        else:
            permission_classes = [IsOwnerOrExecutive]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[IsTreasurer])
    def treasurer_approve(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.PENDING_TREASURER:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        profile.registration_fee_paid = request.data.get('registration_fee_paid', True)
        profile.emergency_kitty_paid = request.data.get('emergency_kitty_paid', True)
        profile.status = MemberProfile.Status.PENDING_DETAILS
        profile.save()
        
        # Here we would send an email with a link for Step 3
        # generate_and_email_pdf.delay(profile.id, profile.user.email) or similar link task
        
        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrExecutive])
    def submit_details(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.PENDING_DETAILS:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Parse extra details
        profile.spouse_name = request.data.get('spouse_name', profile.spouse_name)
        profile.spouse_phone = request.data.get('spouse_phone', profile.spouse_phone)
        
        # Save Guardians
        guardians = request.data.get('guardians', [])
        if len(guardians) > 2: return Response({'error': 'Max 2 guardians'}, status=400)
        Guardian.objects.filter(profile=profile).delete()
        for g in guardians:
            Guardian.objects.create(profile=profile, **g)
            
        # Save Dependents
        dependents = request.data.get('dependents', [])
        if len(dependents) > 4: return Response({'error': 'Max 4 dependents'}, status=400)
        Dependent.objects.filter(profile=profile).delete()
        for d in dependents:
            Dependent.objects.create(profile=profile, **d)
            
        profile.status = MemberProfile.Status.PENDING_SECRETARY
        profile.save()
        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def secretary_approve(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.PENDING_SECRETARY:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        profile.status = MemberProfile.Status.ACTIVE
        profile.save()
        profile.assign_member_id()
        return Response(MemberProfileSerializer(profile).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSecretary])
    def secretary_reject(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.PENDING_SECRETARY:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)
            
        profile.status = MemberProfile.Status.REJECTED
        profile.rejection_reason = request.data.get('rejection_reason', 'Rejected by Secretary')
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

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_profile(self, request):
        profile, created = MemberProfile.objects.get_or_create(user=request.user)
        return Response(MemberProfileSerializer(profile).data)

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    
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

    @action(detail=True, methods=['post'], permission_classes=[IsTreasurer])
    def mark_paid(self, request, pk=None):
        contribution = self.get_object()
        contribution.is_fully_paid = True
        contribution.amount_paid = contribution.welfare_case.required_amount
        contribution.mpesa_reference = request.data.get('mpesa_reference', '')
        contribution.date_paid = timezone.now()
        contribution.save()
        return Response(ContributionSerializer(contribution).data)
