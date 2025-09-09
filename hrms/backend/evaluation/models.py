from django.db import models
from employees.models import EmployeeProfile
from django.conf import settings


class EvaluationForm(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)


class EvaluationCategory(models.Model):
    form = models.ForeignKey(EvaluationForm, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1)


class EvaluationQuestion(models.Model):
    category = models.ForeignKey(EvaluationCategory, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=255)


class EvaluationResult(models.Model):
    form = models.ForeignKey(EvaluationForm, on_delete=models.PROTECT)
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    submitted_at = models.DateTimeField(auto_now_add=True)
    overall_score = models.IntegerField()
    comments = models.TextField(blank=True)


class EvaluationAnswer(models.Model):
    result = models.ForeignKey(EvaluationResult, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(EvaluationQuestion, on_delete=models.PROTECT)
    score = models.IntegerField()  # 1-10
    comment = models.TextField(blank=True)