from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question

class Command(BaseCommand):
    help = 'Creates test quiz data for different languages and levels'

    def handle(self, *args, **kwargs):
        # Spanish Beginner Quiz
        spanish_beginner = Quiz.objects.create(
            title='Spanish for Beginners',
            language='spanish',
            level='beginner',
            description='Basic Spanish vocabulary and phrases for beginners.'
        )

        Question.objects.create(
            quiz=spanish_beginner,
            question_text='How do you say "hello" in Spanish?',
            question_type='mcq',
            correct_answer='Hola',
            options=['Hola', 'Adiós', 'Gracias'],
            order=1
        )

        Question.objects.create(
            quiz=spanish_beginner,
            question_text='What is "thank you" in Spanish?',
            question_type='mcq',
            correct_answer='Gracias',
            options=['Por favor', 'Gracias', 'De nada'],
            order=2
        )

        # Spanish Intermediate Quiz
        spanish_intermediate = Quiz.objects.create(
            title='Spanish Intermediate',
            language='spanish',
            level='intermediate',
            description='Intermediate Spanish listening and speaking practice.'
        )

        Question.objects.create(
            quiz=spanish_intermediate,
            question_text='¿Cómo estás?',
            question_type='tts',
            correct_answer='confident',
            order=1
        )

        Question.objects.create(
            quiz=spanish_intermediate,
            question_text='¿Qué hora es?',
            question_type='tts',
            correct_answer='confident',
            order=2
        )

        # Spanish Expert Quiz
        spanish_expert = Quiz.objects.create(
            title='Spanish Expert',
            language='spanish',
            level='expert',
            description='Advanced Spanish grammar and conversation.'
        )

        Question.objects.create(
            quiz=spanish_expert,
            question_text='Which is the correct form of the subjunctive in "Espero que tú ___ (venir) a la fiesta"?',
            question_type='mcq',
            correct_answer='vengas',
            options=['vengas', 'vienes', 'vendrás'],
            order=1
        )

        Question.objects.create(
            quiz=spanish_expert,
            question_text='¿Podrías explicarme la diferencia entre "por" y "para"?',
            question_type='tts',
            correct_answer='confident',
            order=2
        )

        self.stdout.write(self.style.SUCCESS('Successfully created test quiz data')) 