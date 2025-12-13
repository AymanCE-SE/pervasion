from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import UserViewSet, LoginView, RegisterView, verify_email  # Add verify_email import
from projects.views import ProjectViewSet, CategoryViewSet
from contact.views import ContactViewSet
from comments.views import CommentViewSet
from jobapplicant.views import JobApplicationViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'job-applications', JobApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/verify-email/', verify_email, name='verify-email'), 
]
