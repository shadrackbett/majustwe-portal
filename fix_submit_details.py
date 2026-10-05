import codecs
import re

content = codecs.open('backend/welfare/api/views.py', 'r', 'utf-8').read()

target = """    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrExecutive])
    def submit_details(self, request, pk=None):
        profile = self.get_object()
        if profile.status != MemberProfile.Status.PENDING_DETAILS:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)"""

replacement = """    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrExecutive])
    def submit_details(self, request, pk=None):
        profile = self.get_object()
        
        # Only enforce state check for the member themselves, allow executives to edit anytime
        if not request.user.is_executive():
            if profile.status != MemberProfile.Status.PENDING_DETAILS:
                return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)"""

content = content.replace(target, replacement)
codecs.open('backend/welfare/api/views.py', 'w', 'utf-8').write(content)
print("Fixed submit_details to allow executives to bypass state check")
