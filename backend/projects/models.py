from django.db import models
from django.utils.translation import gettext_lazy as _

def project_image_path(instance, filename):
    """Generate unique path for project images"""
    if instance.id:
        return f'projects/{instance.id}/{filename}'
    from datetime import datetime
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f'projects/temp/{timestamp}_{filename}'


def project_gallery_image_path(instance, filename):
    """Generate path for gallery images"""
    return f'projects/{instance.project.id}/gallery/{filename}'


class Category(models.Model):
    name = models.CharField(_('name'), max_length=100)
    name_ar = models.CharField(_('name in Arabic'), max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['name']  
    
    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(_('title'), max_length=200)
    title_ar = models.CharField(_('title in Arabic'), max_length=200)
    description = models.TextField(_('description'))
    description_ar = models.TextField(_('description in Arabic'))
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='projects',
        verbose_name=_('category')
    )
    image = models.ImageField(_('main image'), upload_to=project_image_path)
    client = models.CharField(_('client'), max_length=100)
    date = models.DateField(_('date'))
    featured = models.BooleanField(_('featured'), default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('project')
        verbose_name_plural = _('projects')
        ordering = ['-date']
    
    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new and self.image and 'temp' in self.image.name:
            import os
            from django.core.files.storage import default_storage
            
            # Get the old file path and name
            old_name = self.image.name
            filename = os.path.basename(old_name)
            
            # Generate the new path
            new_path = f'projects/{self.id}/{filename}'
            
            # If the old file exists, move it to the new location
            if default_storage.exists(old_name):
                new_image = default_storage.save(new_path, self.image)
                # Update the image field
                self.image.name = new_image
                super().save(update_fields=['image'])
                # Delete the old file
                default_storage.delete(old_name)

class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='images',
        verbose_name=_('project')
    )
    image = models.ImageField(_('image'), upload_to=project_gallery_image_path)
    order = models.PositiveSmallIntegerField(_('order'), default=0)
    
    class Meta:
        verbose_name = _('project image')
        verbose_name_plural = _('project images')
        ordering = ['order']
    
    def __str__(self):
        return f'{self.project.title} - Image {self.order}'

    def save(self, *args, **kwargs):
        if self.project.id is None:
            self.project.save()
        super().save(*args, **kwargs)
