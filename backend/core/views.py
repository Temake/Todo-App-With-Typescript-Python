from .serializers import UserSerializers, NoteSerializers
from rest_framework import generics,status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import *
from rest_framework.permissions import IsAuthenticated, AllowAny


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializers
    queryset = User.objects.all()
    permission_classes = [AllowAny]


class NoteCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializers
    permission_classes = [IsAuthenticated]
    queryset = NoteModel.objects.all()

    def get_queryset(self):
        user = self.request.user
        return NoteModel.objects.filter(created_by=user)

    def perform_create(self, serializer):
        use=self.request.user
        if serializer.is_valid():
            serializer.save(created_by=use)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializers


    def get_queryset(self):
        user = self.request.user
        return NoteModel.objects.filter(created_by=user)
    
def update_note(request,id):
    user=request.user
    note= NoteModel.objects.filter(author=user)

    if user is None:
     return Response("Authentication credentiaks were not provided", status=status.HTTP_511_NETWORK_AUTHENTICATION_REQUIRED)