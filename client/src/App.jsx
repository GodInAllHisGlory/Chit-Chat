import { useState } from 'react';
import './App.css';
import Message from './Message';

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
      <Message />
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default App;
