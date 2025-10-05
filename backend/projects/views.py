from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import logging

from .models import Project, Category
from .serializers import ProjectSerializer, CategorySerializer
from users.permissions import IsAdminOrStaff

logger = logging.getLogger(__name__)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['title', 'title_ar', 'description', 'description_ar', 'client']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminOrStaff]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_projects = Project.objects.filter(featured=True)
        serializer = self.get_serializer(featured_projects, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            # Ensure image paths are updated
            if response.status_code == status.HTTP_201_CREATED:
                instance = self.get_queryset().get(id=response.data['id'])
                instance.save()  # This will trigger the path update
                # Re-serialize to get updated paths
                response.data = self.get_serializer(instance).data
            return response
        except Exception as e:
            logger.error(f"Error creating project: {str(e)}")
            return Response(
                {"detail": "Error creating project", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')  # Explicitly set ordering
    serializer_class = CategorySerializer
    
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name', 'name_ar', 'created_at']
    ordering = ['name']  # Default ordering
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
