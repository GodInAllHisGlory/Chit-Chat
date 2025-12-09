from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('send_message', view=views.send_message, name="send_message"),
]