import './login.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Bar from '../pages/bar/bar';
import Message from '../Message';

import { checkDoctorIsRegistered } from '../../custom_modules/accountContractModules';
import { generatePrivate, getPublicKey } from '../../custom_modules/ECC';

require('dotenv').config();

export default function Register(props) {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const { role } = formData;
    const navigate = useNavigate();
    let privateKey;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onChangePublicKey = (e) => {
        if (e.target.value) {
            checkDoctorIsRegistered(e.target.value)
                .then((publicKey) => {
                    if (publicKey) {
                        setFormData((prevState) => ({
                            ...prevState,
                            ['publicKey']: publicKey,
                        }));
                        privateKey = e.target.value;
                    } else {
                        setMessage('Private key is not registerd as a doctor');
                    }
                })
                .catch((err) => {
                    setMessage('Private key is invalid');
                });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (formData.role == 'Patient') {
                const _privateKey = generatePrivate();
                const publicKey = getPublicKey(_privateKey);
                const patientFormData = {
                    ...formData,
                    ['publicKey']: publicKey,
                };
                privateKey = _privateKey;
                console.log(_privateKey);
                res = await axios.post('/account/signup', patientFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                res = await axios.post('/account/signup', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            console.log('status: ', res.status);
            if (res.status === 220) {
                setMessage(res.data);
            }
            if (res.status === 200) {
                navigate(`/myProfile/true`);
                console.log('data:  ', res.data.token);
                localStorage.setItem('token', res.data.token);
                console.log(privateKey);
                localStorage.setItem('privateKey', privateKey);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <Bar></Bar>
            <div class="login_layout">
                <div class="login_img">
                    <img src="image/img_login.png" alt="" />
                </div>
                <div class="login_tag_cover">
                    <div class="login_tag">
                        <div
                            className="login_tag_text"
                            style={{ padding: '50px 0px' }}
                        >
                            <p>REGISTER</p>
                            <section>
                                <form onSubmit={onSubmit} id="formField">
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
                                                name="password1"
                                                onChange={onChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="inputField">
                                        <label>
                                            Repeat Password:<br></br>
                                            <input
                                                type="password"
                                                name="password2"
                                                onChange={onChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="inputField">
                                        <label>Role: </label>
                                        <select
                                            name="role"
                                            defaultValue="Select"
                                            onChange={onChange}
                                            style={{
                                                borderRadius: '5px',
                                                padding: '5px 20px',
                                                marginLeft: '10px',
                                            }}
                                        >
                                            <option>Select...</option>
                                            <option value="Doctor">
                                                Doctor
                                            </option>
                                            <option value="Patient">
                                                Patient
                                            </option>
                                        </select>
                                    </div>
                                    {role === 'Doctor' && (
                                        <div className="inputField">
                                            <label>
                                                Private key:<br></br>
                                                <input
                                                    type="password"
                                                    name="privateKey"
                                                    onChange={onChangePublicKey}
                                                />
                                            </label>
                                        </div>
                                    )}
                                    <p className="login">
                                        Already have an account?
                                        <Link
                                            style={{ textDecoration: 'none' }}
                                            to="/login"
                                        >
                                            <span> Login</span>{' '}
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
