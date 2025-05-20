from django.db import models
from django.utils.translation import gettext_lazy as _
from projects.models import Project
from users.models import User

class Comment(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name=_('project')
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name=_('user')
    )
    content = models.TextField(_('content'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.user.email} - {self.content[:30]}...'
