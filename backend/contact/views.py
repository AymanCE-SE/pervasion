from rest_framework import viewsets, permissions, filters
from users.permissions import IsAdminOrStaff
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Create permissions require no auth
        Other actions require admin/staff permissions
        """
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminOrStaff]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Your message has been sent successfully. We will contact you soon."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        contact = self.get_object()
        contact.is_read = True
        contact.save()
        serializer = self.get_serializer(contact)
        return Response(serializer.data)
