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
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Create inactive user
                user = serializer.save(is_active=False, email_verified=False)
                
                try:
                    # Generate verification token
                    token = user.get_verification_token()
                    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
                    
                    # Log for debugging
                    if settings.DEBUG:
                        logger.info(f"Generated verification URL: {verify_url}")
                    
                    # Send verification email
                    email_context = {
                        'username': user.username,
                        'verify_url': verify_url
                    }
                    
                    send_mail(
                        subject='Verify your email address',
                        message=strip_tags(render_to_string('emails/verify_email.html', email_context)),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        html_message=render_to_string('emails/verify_email.html', email_context),
                        fail_silently=False
                    )
                    
                    return Response({
                        "message": "Registration successful! Please check your email for verification.",
                        "email": user.email
                    }, status=status.HTTP_201_CREATED)
                    
                except Exception as e:
                    logger.error(f"Email sending error: {str(e)}")
                    user.delete()
                    raise
                    
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
        # Decode token and validate
        token_obj = AccessToken(token)
        
        # Check if token type is correct
        if token_obj.get('type') != 'email_verification':
            raise Exception('Invalid token type')
            
        user_id = token_obj['user_id']
        user = User.objects.get(id=user_id)
        
        # Check if email matches
        if token_obj.get('email') != user.email:
            raise Exception('Token email mismatch')
        
        if user.email_verified:
            return Response({
                'detail': 'Email is already verified'
            }, status=status.HTTP_200_OK)
        
        # Verify user
        user.email_verified = True
        user.is_active = True
        user.save()
        
        return Response({
            'detail': 'Email verified successfully'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'detail': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Email verification error: {str(e)}")
        return Response({
            'detail': str(e) if settings.DEBUG else 'Invalid or expired verification token'
        }, status=status.HTTP_400_BAD_REQUEST)
