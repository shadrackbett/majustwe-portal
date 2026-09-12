from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api.views import MemberProfileViewSet, CaseViewSet, ContributionViewSet

router = DefaultRouter()
router.register(r'profiles', MemberProfileViewSet)
router.register(r'cases', CaseViewSet)
router.register(r'contributions', ContributionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
