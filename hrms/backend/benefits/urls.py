from django.urls import path
from .views import ContributionListView, ClaimCreateView, approve_claim, reject_claim

urlpatterns = [
    path('contributions', ContributionListView.as_view()),
    path('claims', ClaimCreateView.as_view()),
    path('claims/<int:pk>/approve', approve_claim),
    path('claims/<int:pk>/reject', reject_claim),
]
