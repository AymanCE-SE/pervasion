from django.db import models
from django.utils.translation import gettext_lazy as _

class Category(models.Model):
    name = models.CharField(_('name'), max_length=100)
    name_ar = models.CharField(_('name in Arabic'), max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
    
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
    image = models.ImageField(_('main image'), upload_to='projects/')
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

class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='images',
        verbose_name=_('project')
    )
    image = models.ImageField(_('image'), upload_to='projects/')
    order = models.PositiveSmallIntegerField(_('order'), default=0)
    
    class Meta:
        verbose_name = _('project image')
        verbose_name_plural = _('project images')
        ordering = ['order']
    
    def __str__(self):
        return f'{self.project.title} - Image {self.order}'
