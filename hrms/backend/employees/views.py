from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions, serializers
from .models import EmployeeProfile


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'employee_profile', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'fullName': user.get_full_name(),
            'employee': {
                'employeeCode': getattr(profile, 'employee_code', None),
                'department': getattr(getattr(profile, 'department', None), 'name', None),
                'position': getattr(getattr(profile, 'position', None), 'name', None),
            } if profile else None
        })


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeProfile
        fields = '__all__'


class EmployeeListView(generics.ListAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = EmployeeProfile.objects.select_related('department','position','user').all()
        q = self.request.query_params.get('q')
        status = self.request.query_params.get('employment_status')
        if q:
            qs = qs.filter(user__first_name__icontains=q) | qs.filter(user__last_name__icontains=q) | qs.filter(employee_code__icontains=q)
        if status:
            qs = qs.filter(employment_status=status)
        return qs.order_by('employee_code')


class EmployeeUpdateView(generics.UpdateAPIView):
    serializer_class = EmployeeSerializer
    queryset = EmployeeProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]
from django.shortcuts import render

# Create your views here.
