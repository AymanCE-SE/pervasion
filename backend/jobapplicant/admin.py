from django.contrib import admin
from .models import JobApplication

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'position', 'email', 'submitted_at')
    search_fields = ('full_name', 'email', 'position')
    list_filter = ('position', 'worked_in_agency_before')
    readonly_fields = ('submitted_at',)
