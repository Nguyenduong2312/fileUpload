import React, { useState, useEffect } from 'react';
import Bar from '../bar/bar';
import './home.css';
import { Link } from 'react-router-dom';

export default function Home() {
    const [auth, setAuth] = useState(false);
    useEffect(() => {
        fetch('http://localhost:5000/login/user', {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                if (account) {
                    setAuth(true);
                }
            });
    }, []);

    return (
        <div>
            <Bar></Bar>
            <div className="main_layout">
                <p className="main_title">MEDICAL HEALTH RECORD {auth}</p>
                {!auth && (
                    <div className="main_button">
                        <Link className="button" to="/register">
                            Register
                        </Link>
                        <Link
                            className="button"
                            style={{ marginLeft: '30px' }}
                            to="/login"
                        >
                            Login
                        </Link>
                    </div>
                )}
                <div className="main_img">
                    <img src="image/img_main.png" alt="" />
                </div>
            </div>
        </div>
    );
}
