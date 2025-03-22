from django.urls import path

from .views import *

urlpatterns = [
    path('user/register/',UserCreateView.as_view(),name='register'),
    path('notes/create/',NoteCreateView.as_view(),name='note-create'),
    path('notes/delete/<int:pk>/',NoteDelete.as_view(),name='note-delete')
]
