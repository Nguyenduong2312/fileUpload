import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Bar from '../pages/bar/bar';
import Message from '../Message';

import './login.css';
import { getPublicKey } from '../../custom_modules/ECC';

export default function Login() {
    const [privateKey, setPrivateKey] = useState('');
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const publicKey = getPublicKey(privateKey);
            const loginFormData = {
                ...formData,
                ['publicKey']: publicKey,
            };
            const res = await axios.post('/account/login', loginFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res.status);
            if (res.status === 220) {
                setMessage(res.data);
            }
            if (res.status === 200) {
                navigate('/');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('privateKey', privateKey);
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
            <Bar></Bar>
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
                                                onChange={onChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="inputField">
                                        <label>
                                            Private key:<br></br>
                                            <input
                                                type="password"
                                                name="privateKey"
                                                onChange={(e) =>
                                                    setPrivateKey(
                                                        e.target.value,
                                                    )
                                                }
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
