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
    nickname = models.CharField(max_length=64, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    birthplace = models.CharField(max_length=200, blank=True)
    contact_no = models.CharField(max_length=64, blank=True)
    tenure_months = models.IntegerField(default=0)
    sss_no = models.CharField(max_length=64, blank=True)
    phic_no = models.CharField(max_length=64, blank=True)
    pagibig_no = models.CharField(max_length=64, blank=True)
    tin_no = models.CharField(max_length=64, blank=True)
    civil_status = models.CharField(max_length=32, blank=True)
    present_address = models.CharField(max_length=255, blank=True)
    employment_status = models.CharField(max_length=32, choices=[
        ('FULL_TIME','Full-time'),('PART_TIME','Part-time'),('PROBATIONARY','Probationary'),('CONTRACTUAL','Contractual'),('PROJECT_BASED','Project-based'),('INTERN','Intern/Trainee'),('RETIRED','Retired'),('RESIGNED','Resigned'),('ON_LEAVE','On leave')
    ], default='FULL_TIME')
    termination_date = models.DateField(null=True, blank=True)
    termination_reason = models.TextField(blank=True)
    remarks = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.employee_code} - {self.user.get_full_name()}"

# Create your models here.
