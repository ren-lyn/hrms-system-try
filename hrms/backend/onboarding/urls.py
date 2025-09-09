from django.urls import path
from .views import (
    DocumentRequestCreateView, DocumentRequestUploadView, DocumentRequestListView,
    approve_document, reject_document,
    OrientationCreateView, set_start_date, set_salary,
)

urlpatterns = [
    path('documents', DocumentRequestCreateView.as_view()),
    path('documents/list', DocumentRequestListView.as_view()),
    path('documents/<int:pk>', DocumentRequestUploadView.as_view()),
    path('documents/<int:pk>/approve', approve_document),
    path('documents/<int:pk>/reject', reject_document),
    path('orientation', OrientationCreateView.as_view()),
    path('employees/<int:employee_id>/start-date', set_start_date),
    path('employees/<int:employee_id>/salary', set_salary),
]

