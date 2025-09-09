from django.urls import path
from .views import LeaveRequestCreateView, LeaveRequestAdminListView, approve_leave, reject_leave

urlpatterns = [
    path('requests', LeaveRequestCreateView.as_view()),
    path('requests/admin', LeaveRequestAdminListView.as_view()),
    path('requests/<int:pk>/approve', approve_leave),
    path('requests/<int:pk>/reject', reject_leave),
]
