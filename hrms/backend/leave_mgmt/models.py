from django.db import models
from employees.models import EmployeeProfile


class LeaveType(models.Model):
    name = models.CharField(max_length=64, unique=True)
    default_allocation_days = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self) -> str:
        return self.name


class LeaveRequest(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.PROTECT, related_name='requests')
    date_from = models.DateField()
    date_to = models.DateField()
    status = models.CharField(max_length=16, choices=[('PENDING','PENDING'),('APPROVED','APPROVED'),('REJECTED','REJECTED')], default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)


class LeaveBalance(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='leave_balances')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE, related_name='balances')
    remaining_days = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    class Meta:
        unique_together = ('employee', 'leave_type')

# Create your models here.
