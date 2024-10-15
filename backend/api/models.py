from django.db import models

class Meeting(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return self.title
