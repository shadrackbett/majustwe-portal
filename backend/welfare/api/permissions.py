from rest_framework import permissions

class IsTreasurer(permissions.BasePermission):
    """
    Allows access only to users with the Treasurer role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_treasurer())

class IsSecretary(permissions.BasePermission):
    """
    Allows access only to users with the Secretary role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_secretary())

class IsExecutive(permissions.BasePermission):
    """
    Allows access to Secretary or Treasurer.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_secretary() or request.user.is_treasurer())
        )

class IsGenericOfficial(permissions.BasePermission):
    """
    Allows access to Generic Officials (Zonal Reps, etc.).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_generic_official())

class IsOwnerOrExecutive(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to view it,
    unless they are an executive.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_secretary() or request.user.is_treasurer() or request.user.is_generic_official():
            return True
        # Assumes obj has a user attribute or is a user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
