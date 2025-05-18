from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'languages', views.LanguageViewSet)
router.register(r'progress', views.UserProgressViewSet, basename='progress')
router.register(r'', views.QuizViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 