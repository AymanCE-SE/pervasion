from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
import logging

from .serializers import UserSerializer, UserCreateSerializer, CustomTokenObtainPairSerializer, UpdateUserSerializer
from .permissions import IsAdminOrStaff

logger = logging.getLogger(__name__)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    permission_classes = [IsAdminOrStaff]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UpdateUserSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Log the received data for debugging
        print(f"Update data received: {request.data}")

        serializer = self.get_serializer(
            instance, 
            data=request.data, 
            partial=partial
        )

        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print(f"Update error: {str(e)}")
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'next': None,
            'previous': None,
            'results': serializer.data
        })

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Get username/email from request
        email = request.data.get('email') or request.data.get('username')
        try:
            user = User.objects.get(email=email)
            if not user.email_verified:
                return Response({
                    'error': 'Please verify your email first',
                    'email_unverified': True
                }, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            pass
            
        return super().post(request, *args, **kwargs)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Create inactive user
                user = serializer.save(is_active=False, email_verified=False)
                
                # Generate token
                token = RefreshToken.for_user(user)
                token['email'] = user.email
                token['type'] = 'email_verification'
                
                # Create verification URL
                verification_url = f"{settings.FRONTEND_URL}/verify-email?token={str(token.access_token)}"
                
                # Log for debugging
                logger.info(f"Generated verification URL: {verification_url}")
                
                try:
                    # Render email template
                    email_context = {
                        'username': user.username,
                        'verify_url': verification_url
                    }
                    html_message = render_to_string('emails/verify_email.html', email_context)
                    plain_message = strip_tags(html_message)
                    
                    # Send email
                    send_mail(
                        subject='Verify your email address',
                        message=plain_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        html_message=html_message,
                        fail_silently=False
                    )
                    
                    return Response({
                        "message": "Registration successful! Please check your email for verification.",
                        "email": user.email
                    }, status=status.HTTP_201_CREATED)
                
                except Exception as e:
                    # Log the error and cleanup
                    logger.error(f"Failed to send verification email: {str(e)}")
                    user.delete()
                    return Response({
                        'detail': 'Registration failed due to email sending error.'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            except Exception as e:
                logger.error(f"Registration error: {str(e)}")
                return Response({
                    'detail': 'Registration failed. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    token = request.query_params.get('token')
    if not token:
        return Response({
            'detail': 'Verification token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        decoded_token = AccessToken(token)
        user_id = decoded_token['user_id']
        user = User.objects.get(id=user_id)
        
        if user.email_verified:
            return Response({
                'detail': 'Email is already verified'
            })
        
        user.email_verified = True
        user.is_active = True
        user.save()
        
        return Response({
            'detail': 'Email verified successfully'
        })
        
    except User.DoesNotExist:
        return Response({
            'detail': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        return Response({
            'detail': 'Invalid or expired verification token'
        }, status=status.HTTP_400_BAD_REQUEST)
