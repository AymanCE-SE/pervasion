from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import JobApplication
from .serializers import JobApplicationSerializer
from users.permissions import IsAdminOrStaff  # adjust import if different

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by('-submitted_at')
    serializer_class = JobApplicationSerializer

    def get_permissions(self):
        # public submission
        if self.action == 'create':
            return [permissions.AllowAny()]
        # only admin/staff can list/retrieve/update/delete
        return [IsAdminOrStaff()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Application submitted successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
