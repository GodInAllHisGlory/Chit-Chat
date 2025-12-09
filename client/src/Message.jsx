import { useState } from 'react'

function Message() {
    const [message, updateMessage] = useState("");

    function sendMessage(e) {
        e.preventDefault();
        updateMessage("");
    }

    return(
        <>
            <form onSubmit={sendMessage}>
                <input type='text' value={message} onChange={(e) => updateMessage(e.target.value)}></input>
            </form>
        </>
    )
}

export default Message;