from django.db import models
from employees.models import EmployeeProfile


class PayrollCycle(models.Model):
    name = models.CharField(max_length=64)
    period_start = models.DateField()
    period_end = models.DateField()
    processed = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.name} ({self.period_start} - {self.period_end})"


class Payslip(models.Model):
    cycle = models.ForeignKey(PayrollCycle, on_delete=models.CASCADE, related_name='payslips')
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='payslips')
    gross = models.DecimalField(max_digits=12, decimal_places=2)
    net = models.DecimalField(max_digits=12, decimal_places=2)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cycle', 'employee')

# Create your models here.
