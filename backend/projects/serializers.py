from rest_framework import serializers
from django.db import models
from .models import Project, Category, ProjectImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'name_ar', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'order']

class ProjectSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_name_ar = serializers.CharField(source='category.name_ar', read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    # Field for handling additional images from the frontend
    additional_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'title_ar', 'description', 'description_ar',
            'category', 'category_name', 'category_name_ar', 'image',
            'client', 'date', 'featured', 'created_at', 'updated_at',
            'images', 'additional_images'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        additional_images = validated_data.pop('additional_images', [])
        project = Project.objects.create(**validated_data)

        for order, image in enumerate(additional_images):
            ProjectImage.objects.create(project=project, image=image, order=order)

        return project

    def update(self, instance, validated_data):
        additional_images = validated_data.pop('additional_images', [])
        
        # Update the project instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Add new images if provided
        if additional_images:
            # Get the current highest order
            current_max_order = instance.images.aggregate(models.Max('order'))['order__max'] or -1
            
            for i, image in enumerate(additional_images):
                ProjectImage.objects.create(
                    project=instance, 
                    image=image, 
                    order=current_max_order + i + 1
                )

        return instance
