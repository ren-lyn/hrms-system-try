from django.urls import path
from .views import MeView, EmployeeListView, EmployeeUpdateView

urlpatterns = [
    path('me', MeView.as_view()),
    path('', EmployeeListView.as_view()),
    path('<int:pk>', EmployeeUpdateView.as_view()),
]
