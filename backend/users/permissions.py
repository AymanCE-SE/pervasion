from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            (request.user.is_authenticated and 
             (hasattr(request.user, 'is_admin') and request.user.is_admin)
            )
        )

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named 'user' or 'owner'
        if hasattr(obj, 'user'):
            return obj.user == request.user or getattr(request.user, 'is_admin', False)
        elif hasattr(obj, 'owner'):
            return obj.owner == request.user or getattr(request.user, 'is_admin', False)
        
        return getattr(request.user, 'is_admin', False)

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated as an admin, or is a read-only request.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and 
            (request.user.is_authenticated and 
             (hasattr(request.user, 'is_admin') and request.user.is_admin)
            )
        )

class IsAdminOrStaff(permissions.BasePermission):
    """
    Allows access only to users with role='admin' or is_staff=True.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (
                getattr(request.user, 'role', None) == 'admin'
                or getattr(request.user, 'is_staff', False)
            )
        )