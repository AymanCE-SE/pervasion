from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'username', 
            'name', 
            'role', 
            'is_active',
            'email_verified',
            'created_at'
        ]
        read_only_fields = ['created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'name', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(**validated_data)

# users/serializers.py
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email_verified'] = user.email_verified
        return token

    def validate(self, attrs):
        # First check if user exists and credentials are correct
        data = super().validate(attrs)
        
        # Check if user's email is verified
        if not self.user.email_verified:
            raise serializers.ValidationError({
                'detail': 'Please verify your email before logging in.',
                'email_unverified': True,
                'email': self.user.email
            })
        
        # Check if user is active
        if not self.user.is_active:
            raise serializers.ValidationError({
                'detail': 'Account is not active.',
                'inactive': True
            })
            
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        
        # Add user data to response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'name': self.user.name,
            'role': self.user.role,
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser,
            'email_verified': self.user.email_verified
        }
        return data

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate_token(self, value):
        try:
            # Verify token and get user
            from rest_framework_simplejwt.tokens import AccessToken
            token = AccessToken(value)
            user_id = token['user_id']
            user = User.objects.get(id=user_id)
            
            if user.email_verified:
                raise serializers.ValidationError('Email is already verified.')
                
            return value
        except Exception as e:
            raise serializers.ValidationError('Invalid or expired verification token.')

class UpdateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,  # Not required for updates
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,  # Not required for updates
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'name', 'password', 'password_confirm', 'role', 'is_active', 'email_verified']
        extra_kwargs = {
            'email': {
                'required': False,  # Not required for updates
            },
            'username': {
                'required': False,  # Not required for updates
            }
        }

    def validate(self, data):
        # Only validate passwords if they're provided
        if 'password' in data or 'password_confirm' in data:
            password = data.get('password')
            password_confirm = data.get('password_confirm')
            
            if bool(password) != bool(password_confirm):
                raise serializers.ValidationError({
                    'password': 'Both password fields must be provided together'
                })
            
            if password and password != password_confirm:
                raise serializers.ValidationError({
                    'password_confirm': 'Passwords do not match'
                })

        return data

    def validate_email(self, value):
        # Only check uniqueness if email is being changed
        instance = getattr(self, 'instance', None)
        if instance and value != instance.email:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError(
                    'An account with this email already exists'
                )
        return value

    def update(self, instance, validated_data):
        # Handle password update separately
        password = validated_data.pop('password', None)
        password_confirm = validated_data.pop('password_confirm', None)
        
        if password:
            instance.set_password(password)

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
