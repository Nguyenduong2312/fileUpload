import React, { useState } from 'react'
import './bar.css';
import {Link } from "react-router-dom";
import DropUser from './dropdown';
export default function Bar() {
  const [auth, setAuth]= useState('true')

  function checkAuth(status_auth) {
    if (status_auth){
      setAuth(true)
    }
    else{
      setAuth(false)
    }
  }
  
  return (
    <div>
        <div class={`bar auth_${auth}`}>
            <div class="bar_logo">
              <Link to="/"><img src="image/logoEHR.png" alt=""/></Link>  
            </div>
            <div class="bar_menu">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/aboutUs">About Us</Link></li>
                <li className = {`is${auth}`}><DropUser></DropUser></li>
            </div>
        </div>
    </div>
  )
}