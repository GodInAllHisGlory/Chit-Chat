import { useState, useEffect } from 'react'
import * as cookie from "cookie";

function Message(props) {
    const chatSocket = props.chatSocket;
    const [message, updateMessage] = useState("");
    const [sentMessages, displayMessage] = useState([]);

    useEffect(() =>{
        chatSocket.onmessage = function(e) { //When a message is sent or recvied it's updated here
            const data = JSON.parse(e.data);
            data.date = Date.now();
            displayMessage((prev) => [...prev, data]);
        }
    },[])

     async function sendMessage(e) {
        e.preventDefault();

        if(message === ""){
            return;
        }

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
            <div id="chat-log">{sentMessages.map(msg => (
                <div key={msg.date}>{msg.message}</div>
            ))}</div>
            <form onSubmit={sendMessage}>
                <input type='text' value={message} onChange={(e) => updateMessage(e.target.value)}></input>
            </form>
        </>
    )
}

export default Message;