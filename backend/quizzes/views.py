from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Language, Quiz, Question, QuestionOption, UserProgress, UserAnswer
from .serializers import (
    LanguageSerializer, QuizSerializer, QuestionSerializer,
    UserProgressSerializer, UserAnswerSerializer,
    QuizSubmissionSerializer, QuizResultSerializer
)
import requests
from django.conf import settings

# Create your views here.

class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [IsAuthenticated]

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Quiz.objects.all()
        language = self.request.query_params.get('language', None)
        level = self.request.query_params.get('level', None)
        
        if language:
            queryset = queryset.filter(language__code=language)
        if level:
            queryset = queryset.filter(level=level)

        return queryset

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        quiz = self.get_object()
        user = request.user
        
        # Create or get user progress
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            quiz=quiz,
            defaults={'score': 0, 'completed': False}
        )
        
        # Reset progress if retaking
        if not created and progress.completed:
            progress.score = 0
            progress.completed = False
            progress.save()

        serializer = UserProgressSerializer(progress)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        user = request.user
        
        serializer = QuizSubmissionSerializer(data=request.data, many=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete previous answers for this quiz's questions
        UserAnswer.objects.filter(
            user=user,
            question__quiz=quiz
        ).delete()

        # Process answers
        correct_answers = 0
        total_questions = len(serializer.validated_data)

        for answer_data in serializer.validated_data:
            question = get_object_or_404(Question, id=answer_data['question_id'])
            selected_option = get_object_or_404(QuestionOption, id=answer_data['selected_option_id'])

            # Save user's answer
            user_answer = UserAnswer.objects.create(
                user=user,
                question=question,
                selected_option=selected_option,
                is_correct=selected_option.is_correct
            )

            if selected_option.is_correct:
                correct_answers += 1

        # Update user progress
        score_percentage = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        progress = UserProgress.objects.get(user=user, quiz=quiz)
        progress.score = score_percentage
        progress.completed = True
        progress.save()
        
        result_serializer = QuizResultSerializer(data={
            'total_questions': total_questions,
            'correct_answers': correct_answers,
            'score_percentage': score_percentage,
            'completed': True
        })
        result_serializer.is_valid()
        return Response(result_serializer.data)

class UserProgressViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_language(self, request):
        language = request.query_params.get('language')
        if not language:
            return Response({'error': 'Language parameter is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        progress = self.get_queryset().filter(quiz__language=language)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)
