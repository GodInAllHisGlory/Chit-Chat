import { useContext, useState } from 'react';
import './App.css';
import Message from './Message';
import { Outlet } from 'react-router-dom';

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
      <div id="header"><span id="chit-chat">Chit Chat</span></div>
      <button onClick={logout} id="logout">Logout</button>
      <Outlet />
      
    </>
  )
}

export default App;
