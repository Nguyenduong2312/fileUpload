import React from 'react'
import Bar from './bar/bar';
import './home.css';
import {Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
        <Bar></Bar>
        <div class="main_layout">
            <p class="main_title">MEDICAL HEALTH RECORD</p>
            <div class="main_button">
                <Link class="button register" to="/register">Register</Link>
                <Link class="button login" to="/login">Login</Link>
            </div>
            <div class="main_img">
                <img src="image/img_main.png" alt=""/>
            </div>
        </div>

    </div>
  )
}