from django.db import models

class JobApplication(models.Model):
    # 1. Basic Information
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    city_country = models.CharField(max_length=255)

    POSITION_CHOICES = [
        ('graphic_designer', 'Graphic Designer'),
        ('motion_designer', 'Motion Designer'),
        ('content_creator', 'Content Creator'),
        ('media_buyer', 'Media Buyer'),
    ]
    position = models.CharField(max_length=50, choices=POSITION_CHOICES)

    WORK_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('remote', 'Remote'),
        ('internship', 'Internship'),
    ]
    work_type = models.CharField(max_length=20, choices=WORK_TYPE_CHOICES)

    # 2. Professional Background
    EXPERIENCE_CHOICES = [
        ('0_1', '<1'),
        ('1_3', '1–3'),
        ('3_5', '3–5'),
        ('5_plus', '5+'),
    ]
    years_of_experience = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES)

    about_you = models.TextField()

    # Tools checkboxes → list of strings
    tools = models.JSONField(default=list)

    portfolio_link = models.URLField()

    worked_in_agency_before = models.BooleanField(default=False)

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.position}"
