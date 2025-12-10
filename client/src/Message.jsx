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
            const data = JSON.parse(e.data).message.split(" "); //gets the sender and message and breaks them up
            const messageObj = {
                message: data[0],
                sender: data[1],
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
                    'message': message.trimEnd()+" "+user.user
                });
                console.log(sendMessage);
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
                <div key={msg.dateReceived} className={(msg.sender === user.user) ? "sent" : "received"}>{msg.message}</div>
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