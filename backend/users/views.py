from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    logger.info("Signup attempt with email: %s", request.data.get('email', 'not provided'))
    
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            response_data = {
                'user': serializer.data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }
            logger.info("User successfully created with email: %s", user.email)
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        logger.warning("Validation failed for signup: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error("Unexpected error during signup: %s", str(e))
        return Response(
            {"error": "An unexpected error occurred during registration."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    logger.info("Login attempt for email: %s", email if email else 'not provided')
    
    if not email or not password:
        logger.warning("Login attempt without email or password")
        return Response(
            {'error': 'Please provide both email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        response_data = {
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
        }
        logger.info("Successful login for user: %s", email)
        return Response(response_data)
    
    logger.warning("Failed login attempt for email: %s", email)
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )
