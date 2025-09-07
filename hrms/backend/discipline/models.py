from django.db import models
from employees.models import EmployeeProfile


class DisciplinaryAction(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='disciplinary_actions')
    action_date = models.DateField()
    action_type = models.CharField(max_length=64)  # e.g., Verbal Warning, Written Warning, Suspension
    reason = models.TextField()
    issued_by = models.CharField(max_length=128)
    status = models.CharField(max_length=16, choices=[('OPEN','OPEN'),('CLOSED','CLOSED')], default='OPEN')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.action_type} - {self.employee.employee_code} ({self.action_date})"

# Create your models here.
