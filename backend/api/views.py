from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Meeting
from .serializers import MeetingSerializer, UserSerializer

User = get_user_model()

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            meeting = self.get_object()
            meeting.delete()
            return Response({"message": "Meeting deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Meeting.DoesNotExist:
            return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Ensure email ends with @ufl.edu
        if not email.endswith('@ufl.edu'):
            return Response({"error": "Please use a UFL email address."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if email is already registered
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create and save the new user without username
        user = User(email=email, username=email)  # Use email as the username
        user.set_password(password)
        user.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Look up user by email and authenticate with password
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                return Response({"message": "Login successful"})
            else:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
