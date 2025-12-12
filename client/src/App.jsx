import { useContext, useState } from 'react';
import './App.css';
import Message from './Message';
import { Link, Outlet } from 'react-router-dom';

function App() {

  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }

  return (
    <>
      <div id="header">
        <nav>
          <Link id="profile" to="/">{context.user}</Link>
        </nav>
        <span id="chit-chat">Chit Chat</span>
        <button onClick={logout} id="logout">Logout</button>
      </div>
      <Outlet />
      
    </>
  )
}

export default App;
