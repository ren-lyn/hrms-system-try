from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils.dateparse import parse_datetime
from attendance.models import AttendanceRecord
from leave_mgmt.models import LeaveRequest
from payroll.models import Payslip


class AttendanceSummaryView(APIView):
    def get(self, request):
        from_param = request.query_params.get('from')
        to_param = request.query_params.get('to')
        qs = AttendanceRecord.objects.all()
        if from_param:
            qs = qs.filter(clock_in__gte=parse_datetime(from_param))
        if to_param:
            qs = qs.filter(clock_in__lte=parse_datetime(to_param))
        data = (
            qs.extra(select={'day': "date(clock_in)"})
              .values('day')
              .annotate(count=Count('id'), late=Count('id', filter=Q(is_late=True)), overtime=Sum('overtime_minutes'))
              .order_by('day')
        )
        return Response({"series": list(data)})


class LeaveSummaryView(APIView):
    def get(self, request):
        data = (
            LeaveRequest.objects
            .extra(select={'month': "to_char(date_from, 'YYYY-MM')"})
            .values('month', 'leave_type__name')
            .annotate(count=Count('id'))
            .order_by('month', 'leave_type__name')
        )
        return Response({"series": list(data)})


class PayrollSummaryView(APIView):
    def get(self, request):
        cycle_id = request.query_params.get('cycleId')
        qs = Payslip.objects.all()
        if cycle_id:
            qs = qs.filter(cycle_id=cycle_id)
        data = qs.aggregate(total_gross=Sum('gross'), total_net=Sum('net'))
        return Response(data)

from django.shortcuts import render

# Create your views here.
