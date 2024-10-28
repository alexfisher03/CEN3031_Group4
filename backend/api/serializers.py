from rest_framework import serializers
from .models import Meeting
from django.contrib.auth.models import User


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['title', 'date', 'time']

    def validate(self, data):
        # Check if a meeting exists with the same date
        if Meeting.objects.filter(date=data['date']).exists():
            raise serializers.ValidationError('A meeting is already scheduled on this date.')
        return data
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
