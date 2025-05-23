from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

User = get_user_model()

class UserAdmin(BaseUserAdmin):
    list_display = (
        'email', 
        'username', 
        'name', 
        'role', 
        'email_verification_status',
        'is_active',
        'is_staff', 
        'created_at'
    )
    list_filter = (
        'email_verified',
        'is_active',
        'role',
        'is_staff',
        'created_at'
    )
    search_fields = ('email', 'username', 'name')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Personal info', {
            'fields': ('username', 'name')
        }),
        ('Verification & Status', {
            'fields': ('email_verified', 'is_active'),
            'classes': ('wide',)
        }),
        ('Roles & Permissions', {
            'fields': (
                'role',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions'
            ),
        }),
        ('Important dates', {
            'fields': (
                'last_login',
                'date_joined',
                'created_at',
                'updated_at'
            )
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'date_joined', 'last_login')
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'username',
                'name',
                'password1',
                'password2',
                'role',
                'email_verified',
                'is_active'
            ),
        }),
    )

    def email_verification_status(self, obj):
        if obj.email_verified:
            return format_html(
                '<span style="color: green;">✓ Verified</span>'
            )
        return format_html(
            '<span style="color: red;">✗ Not Verified</span>'
        )
    email_verification_status.short_description = 'Email Status'

    def save_model(self, request, obj, form, change):
        # If email_verified is True, ensure is_active is also True
        if obj.email_verified and not obj.is_active:
            obj.is_active = True
        super().save_model(request, obj, form, change)

    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

admin.site.register(User, UserAdmin)
