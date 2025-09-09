from rest_framework import generics, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from .models import LeaveRequest, LeaveType, LeaveBalance
from employees.models import EmployeeProfile


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ['id','employee','leave_type','date_from','date_to','status','created_at']


class LeaveRequestCreateView(generics.CreateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        employee = serializer.validated_data['employee']
        leave_type = serializer.validated_data['leave_type']
        date_from = serializer.validated_data['date_from']
        date_to = serializer.validated_data['date_to']
        days = (date_to - date_from).days + 1
        balance = LeaveBalance.objects.get(employee=employee, leave_type=leave_type)
        if balance.remaining_days < days:
            raise serializers.ValidationError('Insufficient balance')
        # TODO: check commitments/conflicts
        serializer.save()


class LeaveRequestAdminListView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return LeaveRequest.objects.all().order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def approve_leave(request, pk: int):
    lr = LeaveRequest.objects.get(pk=pk)
    days = (lr.date_to - lr.date_from).days + 1
    balance = LeaveBalance.objects.get(employee=lr.employee, leave_type=lr.leave_type)
    if balance.remaining_days < days:
        return Response({'error': 'Insufficient balance'}, status=400)
    balance.remaining_days -= days
    balance.save()
    lr.status = 'APPROVED'
    lr.save()
    return Response({'status': lr.status, 'remaining': str(balance.remaining_days)})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_leave(request, pk: int):
    lr = LeaveRequest.objects.get(pk=pk)
    lr.status = 'REJECTED'
    lr.save()
    return Response({'status': lr.status})

# Create your views here.
