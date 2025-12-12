import { useState, useEffect } from 'react'
import * as cookie from "cookie";
import './Message.css'

function Message(props) {
    const chatSocket = props.chatSocket;
    const user = props.user;
    const [message, updateMessage] = useState("");
    const [sentMessages, displayMessage] = useState([]);

    useEffect(() =>{
        chatSocket.onmessage = function(e) { //When a message is sent or received it's updated here
            const dataPrased = JSON.parse(e.data).message;
            const message = dataPrased.slice(dataPrased.search("/")+1);
            const sender = dataPrased.slice(0, dataPrased.search("/"));

            const messageObj = {
                message: message,
                sender: sender,
                dateReceived: Date.now(),
            }
            displayMessage((prev) => [...prev, messageObj]);
        }
    },[])

     async function sendMessage(e) {
        e.preventDefault();

        if(message === ""){
            alert("Must have a message to send");
            return;
        }

        let sendMessage = JSON.stringify({
                    'message': user.user+"/"+message.trimEnd()
                });
        chatSocket.send(sendMessage); //Actually sends the message
        updateMessage("");
    }
    return(
        <>
            <div id="chat-log">{sentMessages.map(msg => (
                <div key={msg.dateReceived} className={(msg.sender == user.user) ? "sent" : "received"}>{msg.message}</div>
            ))}</div>
            <form onSubmit={sendMessage}>
                <input type='text' value={message} onChange={(e) => {
                    if(!(e.target.value.length > 150)){
                        updateMessage(e.target.value)
                    }
                }}></input>
            </form>
        </>
    )
}

export default Message;