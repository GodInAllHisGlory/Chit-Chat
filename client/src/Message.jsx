import { useState, useEffect } from 'react'
import * as cookie from "cookie";

const id = "kingkitkat";
const chatSocket = new WebSocket( //Makes a websocket to talk to the other person
    'ws://'
    + window.location.host
    + '/chat/'
    + id
    + '/'
);

function Message() {
    const [message, updateMessage] = useState("");
    const [sentMessages, displayMessage] = useState("");
    useEffect(() =>{
        chatSocket.onmessage = function(e) { //When a message is sent or recvied it's updated here
            const data = JSON.parse(e.data);
            const updatedMessage = sentMessages + (data.message + "\n")
            displayMessage(updatedMessage);
        }
    },[])

     async function sendMessage(e) {
        e.preventDefault();

        let sendMessage = JSON.stringify({
                    'message': message.trimEnd()
                });
        chatSocket.send(sendMessage); //Actually sends the message

        // const res = await fetch("/send_message", {
        //     method: "post",
        //     credentials: "same-origin",
        //     body: 
        //         sendMessage,
        //     headers:{
        //         "Content-Type": "application/json",
        //         "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
        //     }
        // })
        // if(!res.ok){
        //     alert("Last message failed to send. Check your connection and try again.");
        // }
        updateMessage("");
    }

    return(
        <>
            <span id="chat-log">{sentMessages}</span>
            <form onSubmit={sendMessage}>
                <input type='text' value={message} onChange={(e) => updateMessage(e.target.value)}></input>
            </form>
        </>
    )
}

export default Message;