from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import JobPosting, Application, Interview, Offer
from rest_framework import serializers


class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ['id','title','department','position','description','requirements','status','published_at']


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id','job','full_name','email','phone','resume','cover_letter','status','submitted_at']


class JobPostingListCreateView(generics.ListCreateAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        published_only = self.request.query_params.get('published')
        if search:
            qs = qs.filter(title__icontains=search)
        if published_only == 'true':
            qs = qs.filter(status=JobPosting.STATUS_OPEN)
        return qs.order_by('-published_at', '-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class JobPostingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def publish_job_posting(request, pk: int):
    job = JobPosting.objects.get(pk=pk)
    job.status = JobPosting.STATUS_OPEN
    job.published_at = timezone.now()
    job.save()
    return Response({'status': job.status})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unpublish_job_posting(request, pk: int):
    job = JobPosting.objects.get(pk=pk)
    job.status = JobPosting.STATUS_CLOSED
    job.save()
    return Response({'status': job.status})


class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]


class ApplicationAdminListView(generics.ListAPIView):
    queryset = Application.objects.all().order_by('-submitted_at')
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_application_status(request, pk: int):
    status_value = request.data.get('status')
    app = Application.objects.get(pk=pk)
    app.status = status_value
    app.save()
    return Response({'status': app.status})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def schedule_interview(request, pk: int):
    app = Application.objects.get(pk=pk)
    scheduled_at = request.data.get('scheduled_at')
    mode = request.data.get('mode','In-person')
    Interview.objects.create(application=app, scheduled_at=scheduled_at, mode=mode)
    app.status = Application.STATUS_INTERVIEW
    app.save()
    return Response({'ok': True})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_offer(request, pk: int):
    app = Application.objects.get(pk=pk)
    offered_salary = request.data.get('offered_salary')
    start_date = request.data.get('start_date')
    message = request.data.get('message','')
    Offer.objects.update_or_create(application=app, defaults={'offered_salary': offered_salary, 'start_date': start_date, 'message': message})
    app.status = Application.STATUS_OFFERED
    app.save()
    return Response({'ok': True})