from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'name', 'role', 'created_at']
        read_only_fields = ['created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'name', 'password', 'password_confirm', 'role']
        extra_kwargs = {
            'role': {'required': False}
        }

    def validate(self, data):
        # Only require password fields if creating or if password is being changed
        if self.instance is None or data.get('password') or data.get('password_confirm'):
            if not data.get('password'):
                raise serializers.ValidationError({'password': 'This field is required.'})
            if not data.get('password_confirm'):
                raise serializers.ValidationError({'password_confirm': 'This field is required.'})
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        role = validated_data.get('role', 'user')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        user.name = validated_data.get('name', '')
        user.role = role
        # Set staff/superuser flags based on role
        if role == 'admin':
            user.is_staff = True
            # Optionally:
            user.is_superuser = True
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('password_confirm', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance
# users/serializers.py
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        
        # Add user data to the response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser
        }
        return data
