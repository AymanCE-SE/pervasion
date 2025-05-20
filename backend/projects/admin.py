from django.contrib import admin
from .models import Project, Category, ProjectImage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'client', 'date', 'featured')
    list_filter = ('category', 'featured', 'date')
    search_fields = ('title', 'title_ar', 'description', 'description_ar', 'client')
    date_hierarchy = 'date'
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ProjectImageInline]

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_ar')
    search_fields = ('name', 'name_ar')
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Project, ProjectAdmin)
admin.site.register(Category, CategoryAdmin)
