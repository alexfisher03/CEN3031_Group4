from rest_framework import serializers
from .models import Meeting
from django.contrib.auth.models import User
from django.utils import timezone

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['id', 'title', 'date', 'start_time', 'end_time']

    def validate(self, data):
        # end_time is after start_time
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time.")

        # Check for conflicting meetings on the same date
        conflicting_meetings = Meeting.objects.filter(
            date=data['date'],
            start_time__lt=data['end_time'],   # Existing meeting starts before this one ends
            end_time__gt=data['start_time']    # Existing meeting ends after this one starts
        )

        if conflicting_meetings.exists():
            raise serializers.ValidationError("A meeting is already scheduled during this time block.")

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
