from django.contrib import admin
from .models import Quiz, Question, UserProgress

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(UserProgress)
