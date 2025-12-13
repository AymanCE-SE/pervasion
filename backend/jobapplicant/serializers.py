from rest_framework import serializers
from .models import JobApplication

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'city_country',
            'position',
            'work_type',
            'years_of_experience',
            'portfolio_link',
            'tools',
            'worked_in_agency_before',
            'about_you',
            'submitted_at',
        ]
        read_only_fields = ('id', 'submitted_at')