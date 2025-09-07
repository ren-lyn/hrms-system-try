from django.db import models
from django.utils import timezone
from employees.models import EmployeeProfile


class AttendanceRecord(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='attendance_records')
    clock_in = models.DateTimeField()
    clock_out = models.DateTimeField(null=True, blank=True)
    is_late = models.BooleanField(default=False)
    overtime_minutes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def worked_minutes(self) -> int:
        end_time = self.clock_out or timezone.now()
        delta = end_time - self.clock_in
        return int(delta.total_seconds() // 60)


class OvertimeRequest(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='overtime_requests')
    date = models.DateField()
    minutes = models.PositiveIntegerField()
    status = models.CharField(max_length=16, choices=[('PENDING','PENDING'),('APPROVED','APPROVED'),('REJECTED','REJECTED')], default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

# Create your models here.
