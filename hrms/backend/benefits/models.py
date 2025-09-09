from django.db import models
from employees.models import EmployeeProfile


class Benefit(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name


class EmployeeBenefit(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='employee_benefits')
    benefit = models.ForeignKey(Benefit, on_delete=models.CASCADE, related_name='enrollments')
    effective_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('employee', 'benefit', 'effective_date')


class BenefitContribution(models.Model):
    employee_benefit = models.ForeignKey(EmployeeBenefit, on_delete=models.CASCADE, related_name='contributions')
    period = models.CharField(max_length=7)  # YYYY-MM
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


class BenefitClaim(models.Model):
    STATUS_PENDING = 'PENDING'
    STATUS_APPROVED = 'APPROVED'
    STATUS_REJECTED = 'REJECTED'
    STATUS_CHOICES = [(STATUS_PENDING,'Pending'),(STATUS_APPROVED,'Approved'),(STATUS_REJECTED,'Rejected')]

    employee_benefit = models.ForeignKey(EmployeeBenefit, on_delete=models.CASCADE, related_name='claims')
    filed_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    document = models.FileField(upload_to='benefit_claims/', null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)
    decision_reason = models.TextField(blank=True)

# Create your models here.
