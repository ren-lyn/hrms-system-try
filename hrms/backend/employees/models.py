from django.db import models
from django.conf import settings


class Department(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name


class JobPosition(models.Model):
    name = models.CharField(max_length=128)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='positions')

    class Meta:
        unique_together = ('name', 'department')

    def __str__(self) -> str:
        return f"{self.name} ({self.department.name})"


class EmployeeProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee_profile')
    employee_code = models.CharField(max_length=32, unique=True)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='employees')
    position = models.ForeignKey(JobPosition, on_delete=models.PROTECT, related_name='employees')
    date_hired = models.DateField()
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.employee_code} - {self.user.get_full_name()}"

# Create your models here.
