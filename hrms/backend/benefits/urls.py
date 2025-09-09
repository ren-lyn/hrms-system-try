from django.urls import path
from .views import ContributionListView, ClaimCreateView, approve_claim, reject_claim
from .views import ClaimSerializer
from rest_framework import generics, permissions

class ClaimListView(generics.ListAPIView):
    serializer_class = ClaimSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return __import__('benefits').benefits.models.BenefitClaim.objects.all().order_by('-filed_at')

urlpatterns = [
    path('contributions', ContributionListView.as_view()),
    path('claims', ClaimCreateView.as_view()),
    path('claims/admin', ClaimListView.as_view()),
    path('claims/<int:pk>/approve', approve_claim),
    path('claims/<int:pk>/reject', reject_claim),
]
