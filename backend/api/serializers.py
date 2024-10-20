from rest_framework import serializers
from .models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['title', 'date', 'time']

    def validate(self, data):
        # Check if a meeting exists with the same date
        if Meeting.objects.filter(date=data['date']).exists():
            raise serializers.ValidationError('A meeting is already scheduled on this date.')
        return data
