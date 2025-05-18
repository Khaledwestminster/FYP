from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from .services import TTSService
from django.utils import timezone

User = get_user_model()

class Language(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10)  # For language codes like 'es', 'fr', etc.
    flag_emoji = models.CharField(max_length=10)  # For storing flag emojis

    def __str__(self):
        return f"{self.name} {self.flag_emoji}"

class Quiz(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    ]
    
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['language', 'level']

    def __str__(self):
        return f"{self.language.name} - {self.level}"

class Question(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('speech', 'Speech Practice'),
        ('translation', 'Translation'),
    ]

    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.CharField(max_length=500, default='')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    correct_answer = models.CharField(max_length=500)
    audio_url = models.URLField(null=True, blank=True)  # For storing TTS audio URLs
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.quiz.language.name} - {self.quiz.level} - {self.text[:30]}"
    
    def save(self, *args, **kwargs):
        # Generate audio for speech practice questions
        if self.question_type == 'speech' and not self.audio_url:
            self.audio_url = TTSService.generate_audio(
                text=self.correct_answer,
                language_code=self.quiz.language.code
            )
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Delete associated audio file
        TTSService.delete_audio(self.audio_url)
        super().delete(*args, **kwargs)

class QuestionOption(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({'Correct' if self.is_correct else 'Incorrect'})"

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    last_attempted = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'quiz']

    def __str__(self):
        return f"{self.user.email} - {self.quiz} - Score: {self.score}"

class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(QuestionOption, null=True, on_delete=models.SET_NULL)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'question']
    
    def __str__(self):
        return f"{self.user.email} - {self.question.text[:30]}"
