import './login.css';
import { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Message from '../Message';

export default function Login(props) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const { username, password } = formData;
    const navigate = useNavigate();
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        console.log('login');
        e.preventDefault();
        try {
            console.log();
            const res = await axios.post('/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res.data);

            //check logined -> home
            if (res.data.status === true) {
                navigate('/');
            } else {
                setMessage('Username và password không hợp lệ');
            }
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };
    return (
        <div>
            <div class="login_layout">
                <div class="login_img">
                    <img src="image/img_login.png" alt="" />
                </div>
                <div class="login_tag_cover" style={{ marginTop: '30px' }}>
                    <div class="login_tag">
                        <div
                            className="login_tag_text"
                            style={{ padding: '50px 0px' }}
                        >
                            <p>LOGIN</p>
                            <section>
                                <form onSubmit={onSubmit}>
                                    <div className="inputField">
                                        <label>
                                            Username:<br></br>
                                            <input
                                                type="text"
                                                name="username"
                                                id="email"
                                                value={username || ''}
                                                onChange={onChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="inputField">
                                        <label>
                                            Password:<br></br>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                value={password || ''}
                                                onChange={onChange}
                                            />
                                        </label>
                                    </div>
                                    <p className="login">
                                        Don't have account?
                                        <Link
                                            style={{ textDecoration: 'none' }}
                                            to="/register"
                                        >
                                            <span> Register</span>{' '}
                                        </Link>
                                    </p>
                                    <input className="submit" type="submit" />
                                </form>
                                <div className="message">
                                    {message ? <Message msg={message} /> : null}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
