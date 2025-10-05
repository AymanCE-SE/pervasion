from django.db.models.fields.files import ImageField

class ProjectImageField(ImageField):
    def pre_save(self, model_instance, add):
        file = super().pre_save(model_instance, add)
        if file and not model_instance.id:
            # Set a temporary path until we have an ID
            setattr(model_instance, self.attname, file)
        return file