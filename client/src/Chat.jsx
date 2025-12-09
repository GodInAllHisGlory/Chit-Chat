import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react'
import Message from "./Message.jsx"
import * as cookie from "cookie";

const id = context.user;

function Chat() {
    const chatSocket = new WebSocket( //Makes a websocket to talk to the other person
    'ws://'
    + window.location.host
    + '/chat/'
    + id
    + '/'
);

useEffect(() => {
    const res = fetch("chat/queue_chatter", {
            method: "post",
            credentials: "same-origin",
            body: 
                context.user,
            headers:{
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            }
})},[])

    return(
        <div>
            <Message chatSocket={chatSocket}/>
        </div>
    )
}

export default Chat;