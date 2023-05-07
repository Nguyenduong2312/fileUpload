import React, { useState,useEffect } from 'react';
import Bar from '../bar/bar';
import './home.css';
import { Link } from 'react-router-dom';

export default function Home() {
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
            <Bar></Bar>
            <div className="main_layout">
                <p className="main_title">MEDICAL HEALTH RECORD</p>
                <div className={`main_button auth_${auth}`}>
                    <Link className="button register" to="/register">
                        Register
                    </Link>
                    <Link className="button login" to="/login">
                        Login
                    </Link>
                </div>
                <div className="main_img">
                    <img src="image/img_main.png" alt="" />
                </div>
            </div>
        </div>
    );
}
