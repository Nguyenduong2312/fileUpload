import React, { useState, useEffect } from 'react';
import './bar.css';
import { Link } from 'react-router-dom';

import DropUser from './dropdown';

export default function Bar() {
    const [auth, setAuth] = useState(false);
    useEffect(() => {
        fetch('http://localhost:5000/login/checkLogin',{
            credentials: 'include',
            method: 'GET',
          })
        .then(res => res.json())
        .then(requests => {
            const {status} = requests
            setAuth(status)
        })
}, [auth])  

    return (
        <div>
            <div className={`bar auth_${auth}`}>
                <div className="bar_logo">
                    <Link to="/">
                        <img src="image/logoEHR.png" alt="" />
                    </Link>
                </div>
                <div className="bar_menu">
                    <li className={`is${auth}`}>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className={`is${auth}`}>
                        <Link to="/uploadRecord">Upload Record</Link>
                    </li>
                    <li>
                        <Link to="/aboutUs">About Us</Link>
                    </li>
                    <li className={`is${auth}`}>
                        <DropUser setAuth = {setAuth}></DropUser>
                    </li>
                </div>
            </div>
        </div>
    );
}
