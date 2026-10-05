from django.urls import path
from .views import RegisterView, CleanupOrphansView, CleanupTestUsersView, ChangePasswordView, PasswordResetRequestView, PasswordResetConfirmView, TestTokenView, UpdateAdminView

urlpatterns = [
    path('cleanup-orphans/', CleanupOrphansView.as_view(), name='cleanup_orphans'),
    path('cleanup-test-users/', CleanupTestUsersView.as_view(), name='cleanup_test_users'),
    path('test-token/', TestTokenView.as_view(), name='test_token'),
    path('update-admin/', UpdateAdminView.as_view(), name='update_admin'),
    path('register/', RegisterView.as_view(), name='register'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
