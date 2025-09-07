from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employees.models import Department, JobPosition, EmployeeProfile
from attendance.models import AttendanceRecord
from leave_mgmt.models import LeaveType, LeaveRequest, LeaveBalance
from payroll.models import PayrollCycle, Payslip
from discipline.models import DisciplinaryAction
from benefits.models import Benefit, EmployeeBenefit
from datetime import date, datetime, timedelta
from django.utils import timezone
import random


class Command(BaseCommand):
    help = 'Seed demo data for HRMS'

    def handle(self, *args, **options):
        # Users
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        user, _ = User.objects.get_or_create(username='employee1', defaults={'email':'e1@example.com'})
        if not user.password:
            user.set_password('pass1234')
            user.first_name = 'Juan'
            user.last_name = 'Dela Cruz'
            user.save()

        # Departments & Positions
        dept, _ = Department.objects.get_or_create(name='Operations')
        pos, _ = JobPosition.objects.get_or_create(name='Engineer', department=dept)

        # Employee Profile
        profile, _ = EmployeeProfile.objects.get_or_create(
            user=user,
            defaults={
                'employee_code': 'EMP-0001',
                'department': dept,
                'position': pos,
                'date_hired': date.today() - timedelta(days=400),
                'base_salary': 30000,
            }
        )

        # Attendance (last 14 days)
        for i in range(14):
            day = timezone.now() - timedelta(days=i)
            clock_in = day.replace(hour=8, minute=0, second=0, microsecond=0)
            is_late = random.random() < 0.2
            if is_late:
                clock_in += timedelta(minutes=random.choice([5,10,15,20]))
            clock_out = clock_in + timedelta(hours=9)
            overtime = random.choice([0,0,0,30,60])
            AttendanceRecord.objects.get_or_create(
                employee=profile,
                clock_in=clock_in,
                defaults={
                    'clock_out': clock_out + timedelta(minutes=overtime),
                    'is_late': is_late,
                    'overtime_minutes': overtime,
                }
            )

        # Leave types and requests
        vl, _ = LeaveType.objects.get_or_create(name='Vacation', defaults={'default_allocation_days': 10})
        sl, _ = LeaveType.objects.get_or_create(name='Sick', defaults={'default_allocation_days': 7})
        LeaveBalance.objects.get_or_create(employee=profile, leave_type=vl, defaults={'remaining_days': 8})
        LeaveBalance.objects.get_or_create(employee=profile, leave_type=sl, defaults={'remaining_days': 5})
        LeaveRequest.objects.get_or_create(employee=profile, leave_type=vl, date_from=date.today()-timedelta(days=20), date_to=date.today()-timedelta(days=18), defaults={'status':'APPROVED'})

        # Payroll
        cycle, _ = PayrollCycle.objects.get_or_create(name='2025-09A', period_start=date.today()-timedelta(days=15), period_end=date.today())
        Payslip.objects.get_or_create(cycle=cycle, employee=profile, defaults={'gross': 32000, 'net': 28000})

        # Disciplinary action
        DisciplinaryAction.objects.get_or_create(employee=profile, action_date=date.today()-timedelta(days=60), action_type='Written Warning', reason='Tardiness', issued_by='HR', defaults={'status':'CLOSED'})

        # Benefits
        hmo, _ = Benefit.objects.get_or_create(name='HMO')
        EmployeeBenefit.objects.get_or_create(employee=profile, benefit=hmo, effective_date=date.today()-timedelta(days=365))

        self.stdout.write(self.style.SUCCESS('Seed data created.'))

