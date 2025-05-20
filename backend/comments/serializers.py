from rest_framework import serializers
from .models import Comment
from users.models import User
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Comment
        fields = ['id', 'project', 'user', 'user_details', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        # Remove user from attrs to prevent it from being set directly
        attrs.pop('user', None)
        return attrs
    
    def create(self, validated_data):
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
