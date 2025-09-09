from django.urls import path
from . import views

urlpatterns = [
    path('jobs', views.JobPostingListCreateView.as_view()),
    path('jobs/<int:pk>', views.JobPostingRetrieveUpdateDestroyView.as_view()),
    path('jobs/<int:pk>/publish', views.publish_job_posting),
    path('jobs/<int:pk>/unpublish', views.unpublish_job_posting),
    path('applications', views.ApplicationCreateView.as_view()),
    path('applications/admin', views.ApplicationAdminListView.as_view()),
    path('applications/<int:pk>/status', views.update_application_status),
    path('applications/<int:pk>/interview', views.schedule_interview),
    path('applications/<int:pk>/offer', views.create_offer),
]

