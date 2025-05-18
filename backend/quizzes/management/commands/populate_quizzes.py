from django.core.management.base import BaseCommand
from django.conf import settings
from quizzes.models import Quiz, Question, Language, QuestionOption
import os

class Command(BaseCommand):
    help = 'Populates the database with initial quiz data'

    def handle(self, *args, **kwargs):
        # Create languages
        languages = [
            {'name': 'Spanish', 'code': 'es', 'flag_emoji': '🇪🇸'},
            {'name': 'French', 'code': 'fr', 'flag_emoji': '🇫🇷'},
            {'name': 'German', 'code': 'de', 'flag_emoji': '🇩🇪'},
            {'name': 'Italian', 'code': 'it', 'flag_emoji': '🇮🇹'},
        ]

        for lang_data in languages:
            language, created = Language.objects.get_or_create(
                code=lang_data['code'],
                defaults=lang_data
            )
            self.stdout.write(f"{'Created' if created else 'Found'} language: {language.name}")

            # Create quizzes for each level
            levels = ['beginner', 'intermediate', 'expert']
            for level in levels:
                quiz, created = Quiz.objects.get_or_create(
                    language=language,
                    level=level,
                    defaults={
                        'title': f"{language.name} - {level.capitalize()}",
                        'description': f"Learn {language.name} at {level.capitalize()} level"
                    }
                )
                self.stdout.write(f"{'Created' if created else 'Found'} quiz: {quiz}")

                # Add sample questions based on level
                if created:
                    if level == 'beginner':
                        self.create_beginner_questions(quiz, language)
                    elif level == 'intermediate':
                        self.create_intermediate_questions(quiz, language)
                    else:  # expert
                        self.create_expert_questions(quiz, language)

    def create_beginner_questions(self, quiz, language):
        # Basic greetings and common phrases
        questions_data = {
            'es': [
                ('How do you say "hello" in Spanish?', 'Hola', ['Bonjour', 'Ciao', 'Hola']),
                ('What is "goodbye" in Spanish?', 'Adiós', ['Au revoir', 'Arrivederci', 'Adiós']),
            ],
            'fr': [
                ('How do you say "hello" in French?', 'Bonjour', ['Hola', 'Ciao', 'Bonjour']),
                ('What is "goodbye" in French?', 'Au revoir', ['Adiós', 'Arrivederci', 'Au revoir']),
            ],
            'de': [
                ('How do you say "hello" in German?', 'Hallo', ['Bonjour', 'Ciao', 'Hallo']),
                ('What is "goodbye" in German?', 'Auf Wiedersehen', ['Au revoir', 'Arrivederci', 'Auf Wiedersehen']),
            ],
            'it': [
                ('How do you say "hello" in Italian?', 'Ciao', ['Bonjour', 'Hola', 'Ciao']),
                ('What is "goodbye" in Italian?', 'Arrivederci', ['Au revoir', 'Adiós', 'Arrivederci']),
            ],
            # Add more for other languages
        }

        if language.code in questions_data:
            for q_text, correct, options in questions_data[language.code]:
                question = Question.objects.create(
                    quiz=quiz,
                    text=q_text,
                    question_type='multiple_choice',
                    correct_answer=correct
                )
                for option in options:
                    QuestionOption.objects.create(
                        question=question,
                        text=option,
                        is_correct=(option == correct)
                    )

    def create_intermediate_questions(self, quiz, language):
        # Questions with audio components for speech practice
        questions_data = {
            'es': [
                ('Listen and repeat: "¿Cómo estás?"', '¿Cómo estás?', ['Muy bien', 'Regular', 'Mal']),
                ('Practice saying: "Mucho gusto"', 'Mucho gusto', ['Nice to meet you', 'Good morning', 'Thank you']),
            ],
            'fr': [
                ('Listen and repeat: "Comment allez-vous?"', 'Comment allez-vous?', ['Très bien', 'Comme ci comme ça', 'Mal']),
                ('Practice saying: "Enchanté"', 'Enchanté', ['Nice to meet you', 'Good morning', 'Thank you']),
            ],
            'de': [
                ('Listen and repeat: "Wie geht es dir?"', 'Wie geht es dir?', ['Sehr gut', 'Es geht', 'Schlecht']),
                ('Practice saying: "Freut mich"', 'Freut mich', ['Nice to meet you', 'Good morning', 'Thank you']),
            ],
            'it': [
                ('Listen and repeat: "Come stai?"', 'Come stai?', ['Molto bene', 'Così così', 'Male']),
                ('Practice saying: "Piacere"', 'Piacere', ['Nice to meet you', 'Good morning', 'Thank you']),
            ],
            # Add more for other languages
        }

        if language.code in questions_data:
            for q_text, correct, options in questions_data[language.code]:
                # Audio will be automatically generated by the Question model's save method
                question = Question.objects.create(
                        quiz=quiz,
                    text=q_text,
                    question_type='speech',
                    correct_answer=correct
                )
                for option in options:
                    QuestionOption.objects.create(
                        question=question,
                        text=option,
                        is_correct=(option == correct)
                    )

    def create_expert_questions(self, quiz, language):
        # Complex phrases and sentences
        questions_data = {
            'es': [
                ('Translate: "I would like to practice my Spanish"', 'Me gustaría practicar mi español', 
                 ['Me gusta español', 'Quiero hablar español', 'Me gustaría practicar mi español']),
                ('What is the correct way to say "I have been learning Spanish for two years"?', 
                 'He estado aprendiendo español durante dos años',
                 ['Estoy aprendiendo español por dos años', 'Aprendo español desde dos años', 'He estado aprendiendo español durante dos años']),
            ],
            'fr': [
                ('Translate: "I would like to practice my French"', 'Je voudrais pratiquer mon français',
                 ['Je veux français', 'Je parle français', 'Je voudrais pratiquer mon français']),
                ('What is the correct way to say "I have been learning French for two years"?',
                 "J'apprends le français depuis deux ans",
                 ['Je suis apprendre français pour deux ans', 'Je parle français pour deux ans', "J'apprends le français depuis deux ans"]),
            ],
            'de': [
                ('Translate: "I would like to practice my German"', 'Ich möchte mein Deutsch üben',
                 ['Ich mag Deutsch', 'Ich spreche Deutsch', 'Ich möchte mein Deutsch üben']),
                ('What is the correct way to say "I have been learning German for two years"?',
                 'Ich lerne seit zwei Jahren Deutsch',
                 ['Ich lerne Deutsch für zwei Jahre', 'Ich spreche Deutsch seit zwei Jahre', 'Ich lerne seit zwei Jahren Deutsch']),
            ],
            'it': [
                ('Translate: "I would like to practice my Italian"', 'Vorrei praticare il mio italiano',
                 ['Mi piace italiano', 'Parlo italiano', 'Vorrei praticare il mio italiano']),
                ('What is the correct way to say "I have been learning Italian for two years"?',
                 'Studio italiano da due anni',
                 ['Studio italiano per due anni', 'Parlo italiano da due anni', 'Studio italiano da due anni']),
            ],
            # Add more for other languages
        }

        if language.code in questions_data:
            for q_text, correct, options in questions_data[language.code]:
                question = Question.objects.create(
                    quiz=quiz,
                    text=q_text,
                    question_type='translation',
                    correct_answer=correct
                )
                for option in options:
                    QuestionOption.objects.create(
                        question=question,
                        text=option,
                        is_correct=(option == correct)
                    )

        self.stdout.write(self.style.SUCCESS('Successfully populated quiz data')) 