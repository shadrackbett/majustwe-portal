from django.urls import path
from .views import RegisterView, CleanupOrphansView, ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('cleanup-orphans/', CleanupOrphansView.as_view(), name='cleanup_orphans'),
    path('register/', RegisterView.as_view(), name='register'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
