import React, { useState, useEffect } from 'react';
import './bar.css';
import { Link } from 'react-router-dom';

import DropUser from './dropdown';

export default function Bar() {
    const [auth, setAuth] = useState(false);
    const [role, setRole] = useState('');
    useEffect(() => {
        fetch('http://localhost:5000/login/user', {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((requests) => {
                if (requests) {
                    setAuth(true);
                    setRole(requests.role);
                }
            });
    }, []);

    return (
        <div>
            <div className="bar">
                <div className="bar_logo">
                    <Link to="/">
                        <img src="../image/logoEHR.png" alt="" />
                    </Link>
                </div>
                <div className="bar_menu">
                    {auth && (
                        <li className={`is${auth}`}>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                    )}
                    {auth && role === 'Doctor' && (
                        <div style={{ display: 'flex' }}>
                            <li className={`is${auth}`}>
                                <Link to="/uploadRecord">Upload Record</Link>
                            </li>
                            <li className={`is${auth}`}>
                                <Link to="/searchUser">Search User</Link>
                            </li>
                        </div>
                    )}
                    {auth && (
                        <li className={`is${auth}`}>
                            <DropUser
                                role={role}
                                className="iconUser"
                            ></DropUser>
                        </li>
                    )}
                </div>
            </div>
        </div>
    );
}
