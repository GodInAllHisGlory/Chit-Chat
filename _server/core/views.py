from django.shortcuts import render
from django.conf  import settings
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from .models import Blocked
import json
import os
import string
import random

# Load manifest when server launches
MANIFEST = {}
chatter_queue = []

if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def block(req):
    body = json.loads(req.body)
    user = body["user"]
    chatter = body["chatter"]
    blocked_list = Blocked.objects.get(user=user)
    blocked_list.blocked += f"{chatter},"
    blocked_list.save()
    return JsonResponse({"success": True})

@login_required
def unblock(req):
    body = json.loads(req.body)
    user = body["user"]
    chatter = body["chatter"]
    blocked_list = Blocked.objects.get(user=user)
    blocked_list.blocked = blocked_list.blocked.replace(f"{chatter},","")
    blocked_list.save()
    return JsonResponse({"success": True})

@login_required
def get_blocked(req):
    body = json.loads(req.body)
    user = body["user"]
    blocked_list = Blocked.objects.get(user=user)
    return JsonResponse({"blockedList": blocked_list.blocked})

@login_required
def queue_chatter(req):
    chatter = json.loads(req.body)
    if chatter not in chatter_queue:
        chatter_queue.append(chatter)
    return JsonResponse(chatter)

@login_required
def match_maker(req):
    user = json.loads(req.body)
    user_blocked = Blocked.objects.get(user=user['user'])
    for chatter in chatter_queue:
        chatter_blocked = Blocked.objects.get(user=chatter['user'])

        if(user['user'] in chatter_blocked.blocked or chatter['user'] in user_blocked.blocked):
            pass
        if chatter['user'] == user['user']:
            userIndex = chatter #Make a refrence to where this element is so we can remove it when we find a partner
            if chatter['chatId'] != "":
                chatter_queue.remove(chatter)
                return JsonResponse(chatter) 
            else:
                break
                

    chat_id = make_id()

    for chatter in chatter_queue:
        chatter_blocked = Blocked.objects.get(user=chatter['user'])

        if(user['user'] not in chatter_blocked.blocked and chatter['user'] not in user_blocked.blocked):
            if chatter['user'] != user['user'] and chatter['chatId'] == "":
                chatter_queue.remove(userIndex)
                chatter['chatId'] = chat_id
                chatter['partner'] = user['user']
                user['chatId'] = chat_id
                user['partner'] = chatter['user']
                break
    return JsonResponse(user) 
    
def make_id():
    full_string_set = string.ascii_letters + string.digits
    id = "".join(random.choice(full_string_set) for _ in range(8))
    return id


