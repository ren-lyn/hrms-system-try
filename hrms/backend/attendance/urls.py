from django.urls import path
from .views import log_attendance

urlpatterns = [
    path('log', log_attendance),
]
