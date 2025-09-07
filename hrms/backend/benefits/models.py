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

# Create your models here.
