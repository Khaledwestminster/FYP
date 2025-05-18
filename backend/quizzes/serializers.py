from rest_framework import serializers
from .models import Language, Quiz, Question, QuestionOption, UserProgress, UserAnswer

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'code', 'flag_emoji']

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)
    quiz = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'options', 'audio_url', 'quiz']
    
    def get_quiz(self, obj):
        return {
            'language': {
                'code': obj.quiz.language.code
            }
        }

class QuizSerializer(serializers.ModelSerializer):
    language = LanguageSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'language', 'level', 'title', 'description', 'questions']

class UserProgressSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = UserProgress
        fields = ['id', 'quiz', 'score', 'completed', 'last_attempted']

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ['id', 'question', 'selected_option', 'is_correct', 'created_at']

class QuizSubmissionSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option_id = serializers.IntegerField()

class QuizResultSerializer(serializers.Serializer):
    total_questions = serializers.IntegerField()
    correct_answers = serializers.IntegerField()
    score_percentage = serializers.FloatField()
    completed = serializers.BooleanField() 