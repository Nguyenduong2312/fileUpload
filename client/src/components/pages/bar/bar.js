import React, { useState, useEffect } from 'react';
import './bar.css';
import { Link } from 'react-router-dom';

import DropUser from './dropdown';

export default function Bar() {
    const [auth, setAuth] = useState(false);
    const [role, setRole] = useState('')
    useEffect(() => {
        fetch('http://localhost:5000/login/user',{
            credentials: 'include',
            method: 'GET',
        })
        .then(res => res.json())
        .then((requests) => {
            if(requests){
                setAuth(true)
                setRole(requests.role)
            }
        })
    }, [auth])  

    return (
        <div>
            <div className={`bar`}>
                <div className="bar_logo">
                    <Link to="/">
                        <img src="image/logoEHR.png" alt="" />
                    </Link>
                </div>
                <div className="bar_menu">
                    {auth && <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>}
                    {auth && role === 'Doctor' && <li>
                        <Link to="/uploadRecord">Upload Record</Link>
                    </li>}
                    <li>
                        <Link to="/aboutUs">About Us</Link>
                    </li>
                    {auth && <li className={`is${auth}`}>
                        <DropUser role = {role}></DropUser>
                    </li>}
                </div>
            </div>
        </div>
    );
}
