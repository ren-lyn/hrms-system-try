from rest_framework import generics, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils.dateparse import parse_datetime, parse_date
from .models import DocumentRequest, Orientation
from employees.models import EmployeeProfile


class DocumentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentRequest
        fields = ['id','employee','name','uploaded_file','status','remarks']


class OrientationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orientation
        fields = ['id','employee','scheduled_at','details']


class DocumentRequestCreateView(generics.CreateAPIView):
    queryset = DocumentRequest.objects.all()
    serializer_class = DocumentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]


class DocumentRequestUploadView(generics.UpdateAPIView):
    queryset = DocumentRequest.objects.all()
    serializer_class = DocumentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def approve_document(request, pk: int):
    doc = DocumentRequest.objects.get(pk=pk)
    doc.status = 'APPROVED'
    doc.remarks = request.data.get('remarks','')
    doc.save()
    return Response({'status': doc.status})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_document(request, pk: int):
    doc = DocumentRequest.objects.get(pk=pk)
    doc.status = 'REJECTED'
    doc.remarks = request.data.get('remarks','')
    doc.save()
    return Response({'status': doc.status})


class OrientationCreateView(generics.CreateAPIView):
    queryset = Orientation.objects.all()
    serializer_class = OrientationSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_start_date(request, employee_id: int):
    date_str = request.data.get('start_date')
    start_date = parse_date(date_str) if date_str else None
    profile = EmployeeProfile.objects.get(pk=employee_id)
    if not start_date:
        return Response({'error': 'Invalid date'}, status=400)
    profile.date_hired = start_date
    profile.save()
    return Response({'ok': True})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_salary(request, employee_id: int):
    salary = request.data.get('base_salary')
    try:
        salary_val = float(salary)
    except Exception:
        return Response({'error': 'Invalid salary'}, status=400)
    profile = EmployeeProfile.objects.get(pk=employee_id)
    profile.base_salary = salary_val
    profile.save()
    return Response({'ok': True})

