from django.db import models
from django.utils.translation import gettext_lazy as _

class Contact(models.Model):
    name = models.CharField(_('name'), max_length=100)
    email = models.EmailField(_('email'))
    subject = models.CharField(_('subject'), max_length=200)
    message = models.TextField(_('message'))
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(_('is read'), default=False)
    
    class Meta:
        verbose_name = _('contact')
        verbose_name_plural = _('contacts')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.name} - {self.subject}'
