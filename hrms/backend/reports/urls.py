from django.urls import path
from .views import AttendanceSummaryView, LeaveSummaryView, PayrollSummaryView


urlpatterns = [
    path('attendance-summary', AttendanceSummaryView.as_view()),
    path('leave-summary', LeaveSummaryView.as_view()),
    path('payroll-summary', PayrollSummaryView.as_view()),
]

