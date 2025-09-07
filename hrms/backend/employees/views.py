from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


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
from django.shortcuts import render

# Create your views here.
