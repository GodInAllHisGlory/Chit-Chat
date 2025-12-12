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

     async function matchMake() { //Constantly pings the chat/match_maker view to get a match
        const userJSON = JSON.stringify(user);
        while(user.chatId === ""){
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
                
        }
    }

    function block(){ //Sends a post request to block a user
        const block_body = JSON.stringify({
            'user': user.user,
            'chatter': user.partner
        });
        fetch('chat/block',{
                method: "post",
                credentials: "same-origin",
                body: 
                    block_body,
                    headers:{
                        "Content-Type": "application/json",
                        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                    }
                }
            )
            disconnect()
    }

    function disconnect() { //Resets everything
        setIsReady(false);
        socket.send(JSON.stringify({
                    'message': `${user.user}/${user.user} has disconnected`
                }));
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
        let display;
        if(isReady){
             display = (
                <div id="message-view">
                    <h2>Now talking to {user.partner}</h2>
                    <Message chatSocket={socket}
                            user={user}/>
                    <button id='disconnect' onClick={disconnect}>Disconnect</button>
                    <button id='block' onClick={block}>Block</button>
                </div>
            );
        }else {
             display = (<h2 id="looking">Finding you someone to talk to</h2>);
        }
        return display;
    }
    return(
        <div>
            {messageRender()}
        </div>
    )
}

export default Chat;