from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('send_message', view=views.send_message, name="send_message"),
    path('chat/queue_chatter', view=views.queue_chatter, name="queue_chatter"),
    path('chat/match_maker',view=views.match_maker, name="mathch_maker"),
]