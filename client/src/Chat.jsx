import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react'
import Message from "./Message.jsx"
import * as cookie from "cookie";
import './Chat.css'

const user = {
            user: context.user,
            chatId: "",
            partner: ""
        };

function Chat() {
    const [isReady, setIsReady] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        (async () => conncect())();
    },[]);

    async function queueUser(){
        const userJSON = JSON.stringify({
            user: context.user,
            chatId: "",
            partner: ""
        });
        const res = fetch("chat/queue_chatter", {
            method: "post",
            credentials: "same-origin",
            body: 
                userJSON,
                headers:{
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                }
            }
        )
    }

     async function matchMake() {
        const userJSON = JSON.stringify(user);
        while(user.chatId === ""){
            console.log("Working");
            const res = await fetch("chat/match_maker", {
                method: "post",
                credentials: "same-origin",
                body: 
                    userJSON,
                    headers:{
                        "Content-Type": "application/json",
                        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                    }
                }
            ).then(r => r.json());
            user.chatId = res.chatId
            user.partner = res.partner
            console.log(res);
                
        }
    }

    function disconnect() { //Resets everything
        setIsReady(false);
        socket.close();
        user.chatId = "";
        user.partner = "";
        conncect();
    }

    async function conncect(){
        await queueUser()
        await matchMake()
        setSocket(new WebSocket( //Makes a websocket to talk to the other person
        `ws://${window.location.host}/chat/${user.chatId}/`)); 
        setIsReady(true);
    }
    
    function messageRender(){
        if(isReady){
            return(
                <div id="message-view">
                    <h2>Now talking to {user.partner}</h2>
                    <Message chatSocket={socket}
                            user={user}/>
                    <button id='disconnect' onClick={disconnect}>Disconnect</button>
                </div>
            )
        }
    }
    return(
        <div>
            {messageRender()}
        </div>
    )
}

export default Chat;