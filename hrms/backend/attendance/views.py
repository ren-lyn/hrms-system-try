from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from .models import AttendanceRecord
from employees.models import EmployeeProfile


@api_view(['POST'])
@permission_classes([AllowAny])
def log_attendance(request):
    employee_code = request.data.get('employee_code')
    pin = request.data.get('pin')  # placeholder for biometric validation
    try:
        profile = EmployeeProfile.objects.get(employee_code=employee_code)
    except EmployeeProfile.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=400)
    now = timezone.now()
    today_records = AttendanceRecord.objects.filter(employee=profile, clock_in__date=now.date()).order_by('clock_in')
    if not today_records.exists():
        AttendanceRecord.objects.create(employee=profile, clock_in=now, is_late=now.hour > 8 or (now.hour == 8 and now.minute > 0))
        return Response({'message': 'Time-in recorded'})
    last = today_records.last()
    if last.clock_out is None:
        last.clock_out = now
        last.save()
        return Response({'message': 'Time-out recorded'})
    else:
        last.clock_out = now
        last.save()
        return Response({'message': 'Time-out updated'})

# Create your views here.
