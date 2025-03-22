from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class NoteModel(models.Model):
    title=models.CharField(max_length=120,null=False)
    content=models.TextField(null=False)
    created_on=models.DateField(auto_now_add=True)
    created_by= models.ForeignKey(User,on_delete=models.CASCADE, related_name='notes')