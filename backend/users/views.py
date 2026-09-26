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

        return Response({'success': True, 'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
