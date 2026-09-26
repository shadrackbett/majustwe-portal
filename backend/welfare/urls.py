from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api.views import MemberProfileViewSet, CaseViewSet, ContributionViewSet, MinuteRecordViewSet

router = DefaultRouter()
router.register(r'profiles', MemberProfileViewSet)
router.register(r'cases', CaseViewSet)
router.register(r'contributions', ContributionViewSet)
router.register(r'minutes', MinuteRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
