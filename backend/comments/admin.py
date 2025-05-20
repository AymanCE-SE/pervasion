from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'project', 'content_preview', 'created_at')
    list_filter = ('created_at', 'project')
    search_fields = ('content', 'user__email', 'project__title')
    readonly_fields = ('created_at', 'updated_at')
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    
    content_preview.short_description = 'Content Preview'
