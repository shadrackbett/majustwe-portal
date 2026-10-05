import codecs

content = codecs.open('backend/welfare/api/views.py', 'r', 'utf-8').read()

target = """    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrExecutive])
    def submit_details(self, request, pk=None):
        profile = self.get_object()
        # Allows submitting details if ACTIVE_INCOMPLETE or ACTIVE
        if profile.status not in [MemberProfile.Status.ACTIVE_INCOMPLETE, MemberProfile.Status.ACTIVE]:
            return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)"""

replacement = """    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrExecutive])
    def submit_details(self, request, pk=None):
        profile = self.get_object()
        # Allows submitting details if ACTIVE_INCOMPLETE or ACTIVE
        if not request.user.is_executive():
            if profile.status not in [MemberProfile.Status.ACTIVE_INCOMPLETE, MemberProfile.Status.ACTIVE]:
                return Response({'error': 'Profile not in correct state'}, status=status.HTTP_400_BAD_REQUEST)"""

content = content.replace(target, replacement)
codecs.open('backend/welfare/api/views.py', 'w', 'utf-8').write(content)
print("Fixed submit_details")
