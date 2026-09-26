from django.db import models
from django.conf import settings

class MemberProfile(models.fields.related.OneToOneField):
    pass # Replaced below

class MemberProfile(models.Model):
    class Status(models.TextChoices):
        PENDING_TREASURER = 'PENDING_TREASURER', 'Pending Treasurer Approval'
        ACTIVE_INCOMPLETE = 'ACTIVE_INCOMPLETE', 'Active (Missing Details)'
        ACTIVE = 'ACTIVE', 'Active'
        SUSPENDED = 'SUSPENDED', 'Suspended'
        INACTIVE = 'INACTIVE', 'Inactive'
        REJECTED = 'REJECTED', 'Rejected'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='welfare_profile')
    member_id = models.IntegerField(unique=True, null=True, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_TREASURER)
    
    # Core Details
    phone = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    id_number = models.CharField(max_length=20, blank=True)
    current_workstation = models.CharField(max_length=255, blank=True)
    home_subcounty = models.CharField(max_length=100, blank=True)
    member_type = models.CharField(max_length=50, blank=True)
    zone = models.CharField(max_length=100, blank=True)
    
    # Spouse Details
    spouse_name = models.CharField(max_length=255, blank=True)
    spouse_phone = models.CharField(max_length=20, blank=True)
    
    # Financial/Admin
    registration_fee_paid = models.BooleanField(default=False)
    emergency_kitty_paid = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    rejection_reason = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} (ID: {self.member_id or self.get_status_display()})"

    def assign_member_id(self):
        if not self.member_id and self.status == self.Status.ACTIVE:
            last_member = MemberProfile.objects.exclude(member_id__isnull=True).order_by('member_id').last()
            self.member_id = (last_member.member_id + 1) if last_member else 1
            self.save()

class Guardian(models.Model):
    profile = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='guardians')
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} ({self.relationship})"

class Dependent(models.Model):
    profile = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='dependents')
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.relationship})"


class Case(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    required_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    beneficiary = models.ForeignKey('MemberProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='beneficiary_cases')

    def __str__(self):
        return self.title


class Contribution(models.Model):
    member = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='contributions')
    welfare_case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='contributions')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_fully_paid = models.BooleanField(default=False)
    mpesa_reference = models.CharField(max_length=100, blank=True)
    date_paid = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('member', 'welfare_case')

    def __str__(self):
        return f"{self.member} -> {self.welfare_case} ({'Paid' if self.is_fully_paid else 'Pending'})"

class MinuteRecord(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)
    excerpt = models.TextField()
    pdf_file = models.FileField(upload_to='minutes/', null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='published_minutes')

    def __str__(self):
        return self.title
