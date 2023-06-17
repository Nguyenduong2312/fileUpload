import './login.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Bar from '../pages/bar/bar';
import Message from '../Message';

import { checkDoctorIsRegistered } from '../../custom_modules/accountContractModules';
require('dotenv').config();

export default function Register(props) {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    // const [privateKey, setPrivatekey] = useState('');
    const { username, password1, password2 } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        // if (e.target.name=="role" && e.target.value=="Doctor"){
        //     setFormData((prevState) => ({
        //         ...prevState,
        //         ["privateKey"]: "",
        //     }));
        //     }
        // if (e.target.name=="role" && e.target.value=="Doctor"){
        //     var iDiv = document.createElement('div');
        //     iDiv.className = 'inputField';
        //     iDiv.id = 'privateKey';
        //     var label = document.createElement("label");
        //     label.innerHTML = "Private Key:\n"
        //     var input = document.createElement("input");
        //     input.setAttribute('type', 'text');
        //     input.setAttribute('name', 'privateKey');
        //     label.appendChild(input)
        //     iDiv.appendChild(label)
        //     console.log(iDiv)
        //     var parentElement = document.getElementById('formField')[0]
        //     console.log(parentElement)
        //     // parentElement.insertBefore(iDiv, parentElement.childNodes[1]);
        //     parentElement.appendChild(iDiv)
        // }
    };
    const onSubmit = async (e) => {
        if (password1 !== password2) {
            setMessage('Confirm password does not match with password.');
        }

        e.preventDefault();

        //gen key

        //setFormData((prevState) => ({
        //    ...prevState,
        //    ['publicKey']: publicKey,
        //}));

        try {
            // const res = await checkDoctorIsRegistered("ad3bec1060a729641f437fd15690e7fc0fcef1b0a134197faf1076e719b221b8")
            // const res = await checkDoctorIsRegistered(
            //     process.env.REACT_APP_PRIVATE_KEY_A,
            // );
            // setMessage(res);
            // console.log(res);
            // console.log(process.env.REACT_APP_PRIVATE_KEY_A);
            const res = await axios.post('/account/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('status: ', res.status);
            if (res.status === 220) {
                setMessage(res.data);
            }
            if (res.status === 200) {
                navigate(`/myProfile/true`);
                console.log('data:  ', res.data.token);
                localStorage.setItem('token', res.data.token);
                //localStorage.setItem('key', privateKey);
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
                                                value={username}
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
                                                value={password1}
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
                                                value={password2}
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
