from django.db import models

# Create your models here.
class Blocked(models.Model):
    user = models.TextField(primary_key=True)
    blocked = models.TextField()