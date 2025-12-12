from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('chat/queue_chatter', view=views.queue_chatter, name="queue_chatter"),
    path('chat/match_maker',view=views.match_maker, name="match_maker"),
    path('chat/block',view=views.block, name="block"),
    path('chat/unblock',view=views.unblock, name="unblock"),
    path('chat/get_blocked',view=views.get_blocked, name="get_blocked"),
]