from django.db import models
from django.conf import settings
from employees.models import Department, JobPosition


class JobPosting(models.Model):
    STATUS_OPEN = 'OPEN'
    STATUS_CLOSED = 'CLOSED'
    STATUS_CHOICES = [(STATUS_OPEN, 'Open'), (STATUS_CLOSED, 'Closed')]

    title = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='job_postings')
    position = models.ForeignKey(JobPosition, on_delete=models.PROTECT, related_name='job_postings')
    description = models.TextField()
    requirements = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_CLOSED)
    published_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_job_postings')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.title} [{self.get_status_display()}]"


class Application(models.Model):
    STATUS_RECEIVED = 'RECEIVED'
    STATUS_SHORTLISTED = 'SHORTLISTED'
    STATUS_REJECTED = 'REJECTED'
    STATUS_INTERVIEW = 'INTERVIEW'
    STATUS_OFFERED = 'OFFERED'
    STATUS_ACCEPTED = 'ACCEPTED'
    STATUS_DECLINED = 'DECLINED'
    STATUS_CHOICES = [
        (STATUS_RECEIVED,'Received'), (STATUS_SHORTLISTED,'Shortlisted'), (STATUS_REJECTED,'Rejected'),
        (STATUS_INTERVIEW,'Interview Scheduled'), (STATUS_OFFERED,'Offered'), (STATUS_ACCEPTED,'Accepted'), (STATUS_DECLINED,'Declined')
    ]

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=64)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_RECEIVED)
    submitted_at = models.DateTimeField(auto_now_add=True)


class Interview(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    scheduled_at = models.DateTimeField()
    mode = models.CharField(max_length=32, default='In-person')
    notes = models.TextField(blank=True)


class Offer(models.Model):
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='offer')
    offered_salary = models.DecimalField(max_digits=12, decimal_places=2)
    start_date = models.DateField()
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

