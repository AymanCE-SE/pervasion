from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Comment
from .serializers import CommentSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['project', 'user']
    search_fields = ['content', 'user__username']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']  # Default ordering
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """
        Save the comment with the current user as the author.
        """
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        Create a new comment with proper error handling.
        """
        print("Received data:", request.data)  # Debug log
        print("Request user:", request.user)    # Debug log
        
        if not request.user or not request.user.is_authenticated:
            print("User not authenticated")  # Debug log
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        # Create a copy of the request data and ensure project is an integer
        data = request.data.copy()
        if 'project' in data:
            try:
                data['project'] = int(data['project'])
            except (ValueError, TypeError):
                return Response(
                    {"detail": "Project ID must be an integer"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Pass the request to the serializer context
        serializer = self.get_serializer(data=data, context={'request': request})
        
        # Print validation errors for debugging
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)  # Debug log
            return Response(
                {"detail": "Invalid data", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
        except Exception as e:
            print("Error creating comment:", str(e))  # Debug log
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
