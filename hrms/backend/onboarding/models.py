from django.db import models
from employees.models import EmployeeProfile


class OnboardingChecklist(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)


class OnboardingTask(models.Model):
    checklist = models.ForeignKey(OnboardingChecklist, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    required = models.BooleanField(default=True)


class DocumentRequest(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='document_requests')
    name = models.CharField(max_length=200)
    uploaded_file = models.FileField(upload_to='onboarding_docs/', null=True, blank=True)
    status = models.CharField(max_length=16, choices=[('PENDING','PENDING'),('APPROVED','APPROVED'),('REJECTED','REJECTED')], default='PENDING')
    remarks = models.TextField(blank=True)


class Orientation(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='orientations')
    scheduled_at = models.DateTimeField()
    details = models.TextField(blank=True)