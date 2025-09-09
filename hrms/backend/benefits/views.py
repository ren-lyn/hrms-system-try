from rest_framework import generics, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import EmployeeBenefit, BenefitContribution, BenefitClaim


class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BenefitContribution
        fields = ['id','employee_benefit','period','amount','created_at']


class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = BenefitClaim
        fields = ['id','employee_benefit','filed_at','description','document','status','decision_reason']


class ContributionListView(generics.ListAPIView):
    serializer_class = ContributionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        period = self.request.query_params.get('period')
        qs = BenefitContribution.objects.all()
        if period:
            qs = qs.filter(period=period)
        return qs.order_by('-created_at')


class ClaimCreateView(generics.CreateAPIView):
    serializer_class = ClaimSerializer
    queryset = BenefitClaim.objects.all()
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def approve_claim(request, pk: int):
    claim = BenefitClaim.objects.get(pk=pk)
    claim.status = 'APPROVED'
    claim.decision_reason = request.data.get('reason','')
    claim.save()
    return Response({'status': claim.status})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_claim(request, pk: int):
    claim = BenefitClaim.objects.get(pk=pk)
    claim.status = 'REJECTED'
    claim.decision_reason = request.data.get('reason','')
    claim.save()
    return Response({'status': claim.status})

# Create your views here.
