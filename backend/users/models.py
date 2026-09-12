from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        MEMBER = 'MEMBER', 'Member'
        SECRETARY = 'SECRETARY', 'Secretary'
        TREASURER = 'TREASURER', 'Treasurer'
        GENERIC_OFFICIAL = 'GENERIC', 'Generic Official'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER
    )
    
    # E.g. for Zonal Reps
    zone = models.CharField(max_length=100, blank=True, null=True)

    def is_treasurer(self):
        return self.role == self.Role.TREASURER

    def is_secretary(self):
        return self.role == self.Role.SECRETARY

    def is_generic_official(self):
        return self.role == self.Role.GENERIC_OFFICIAL

    def is_executive(self):
        return self.is_treasurer() or self.is_secretary()
