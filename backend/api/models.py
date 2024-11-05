from django.db import models

class Meeting(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    start_time = models.TimeField()  # Start time of the meeting
    end_time = models.TimeField()    # End time of the meeting

    def __str__(self):
        return f"{self.title} on {self.date} from {self.start_time} to {self.end_time}"