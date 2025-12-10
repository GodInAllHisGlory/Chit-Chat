from django.shortcuts import render
from django.conf  import settings
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import json
import os
import string
import random
import time

# Load manifest when server launches
MANIFEST = {}
chatter_queue = []
open_rooms = []

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
def send_message(req):
    body = json.loads(req.body)
    message = body["message"]
    print(message)
    return JsonResponse({"success": True})

@login_required
def queue_chatter(req):
    chatter = json.loads(req.body)
    if chatter not in chatter_queue:
        chatter_queue.append(chatter)
    return JsonResponse(chatter)

@login_required
def match_maker(req):
    user = json.loads(req.body)
    for chatter in chatter_queue:
        if chatter['user'] == user['user']:
            userIndex = chatter_queue.index(chatter) #Make a refrence to where this element is so we can remove it when we find a partner
            if chatter['chatId'] != "":
                chatter_queue.remove(chatter)
                return JsonResponse(chatter) 
            else:
                break
                

    chat_id = make_id()

    for chatter in chatter_queue:
        if chatter['user'] != user['user'] and chatter['chatId'] == "":
            chatter['chatId'] = chat_id
            chatter['partner'] = user['user']
            user['chatId'] = chat_id
            user['partner'] = chatter['user']
            print(userIndex)
            del chatter_queue[userIndex]
            break
    return JsonResponse(user) 
    
def make_id():
    full_string_set = string.ascii_letters + string.digits
    id = "".join(random.choice(full_string_set) for _ in range(8))
    return id


