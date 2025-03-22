from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializers(serializers.ModelSerializer):
  
    class Meta:
        model= User
        fields =['id','username','password']
        extra_kwargs= {'password':{'write_only':True}}
    def create(self, validated_data):
        user= User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class NoteSerializers(serializers.ModelSerializer):
    class Meta:
        model= NoteModel
        fields=['id','title','content','created_by','created_on']
        extra_kwargs= {'created_by':{'read_only':True}}


    