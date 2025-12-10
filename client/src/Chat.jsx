import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react'
import Message from "./Message.jsx"
import * as cookie from "cookie";

const user = {
    user: context.user,
    chatId: "",
    partner: ""
}
const userJSON = JSON.stringify(user);


function Chat() {
    const [isReady, setIsReady] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect( () => { 
        (async () => {
            async function queueUser(){
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
            await queueUser()
            
            async function matchMake() {
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
            await matchMake() 
            setSocket(new WebSocket( //Makes a websocket to talk to the other person
            `ws://${window.location.host}/chat/${user.chatId}/`)); 
            setIsReady(true);
            console.log(socket);
        })()
    },[]);
    console.log(socket);
    function messageRender(){
        if(isReady){
            return(
                <div>
                    <h2>Now talking to {user.partner}</h2>
                    <Message chatSocket={socket}/>
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