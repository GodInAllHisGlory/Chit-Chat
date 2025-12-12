import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react'
import * as cookie from "cookie";
import './Home.css'

function Home() {
    const [blocked, setBlocked] = useState([])

    useEffect(() => {
        async function get_blocked(){
        const jsonBody = JSON.stringify({'user':context.user})
        const res = fetch("chat/get_blocked", {
                method: "POST",
                credentials: "same-origin",
                body: 
                    jsonBody,
                    headers:{
                        "Content-Type": "application/json",
                        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                    }
                }
            ).then(r => r.json());
            const data = await res
            const blockedList = data.blockedList.split(",")
            blockedList.pop()
            
            setBlocked(blockedList)
        }
        get_blocked();
        },[])

        function unblock(b){
            const updateBlocked = [...blocked];
            updateBlocked.splice(updateBlocked.indexOf(b),1);
            setBlocked(updateBlocked);
            const jsonBody = JSON.stringify({
                'user': context.user,
                'chatter': b 
            })
            fetch("chat/unblock", {
                method: "POST",
                credentials: "same-origin",
                body: 
                    jsonBody,
                    headers:{
                        "Content-Type": "application/json",
                        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                    }
                }
            )
        }
        
    return(
        <div>
            <nav id="new-chat">
                <Link id="chat-link" to="/chat">Start Random Chat</Link>
            </nav>
            <Outlet />
            <h2 id="blocked-message">Blocked Users</h2>
            <div id="blocked">
                {blocked.map(b => (
                    <div className="blocked" key={b}>
                        <h4 className="name">{b}</h4>
                        <button className="unblock-button" onClick={() => unblock(b)}>Unblock</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;