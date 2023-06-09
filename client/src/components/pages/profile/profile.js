import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Bar from '../bar/bar';
import Message from '../../Message';

import './profile.css';

export default function Profile() {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({});

    const [message, setMessage] = useState('');
    const { name, address, email, date } = formData;
    const [key, setKey] = useState();

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('items'));
        if (items) {
            console.log('items:', items);
            setKey(items);
        }
        fetch('http://localhost:5000/login/user', {
            credentials: 'include',
            method: 'GET',
        })
            .then((res) => res.json())
            .then((account) => {
                setUser(account);
            });
    }, []);

    const onChange = (e) => {
        if (e.target.value === '') {
            e.target.value = ' ';
        }
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/myProfile/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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
            <div className="profile">
                {message ? <Message msg={message} /> : null}
                <div className="infoTag">
                    <div className="profile_form_tag">
                        <form className="UpdateAccountForm" onSubmit={onSubmit}>
                            <p className="titleProfile">Information:</p>
                            <p style={{ fontWeight: '600' }}>Id: {user.id}</p>
                            <div className="inputField">
                                <label>Full name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name || user.name}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="line_input">
                                <div className="inputField">
                                    <label>Gender:</label>
                                    <select name="gender" onChange={onChange}>
                                        <option>
                                            {user.gender || 'Select...'}
                                        </option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="inputField">
                                    <label>BirthDay:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={date || user.birthday}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <div className="inputField">
                                <label>Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={address || user.address}
                                    onChange={onChange}
                                />
                            </div>

                            <div className="inputField">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email || user.email}
                                    onChange={onChange}
                                />
                            </div>
                            <input
                                className="button"
                                type="submit"
                                value={'Save'}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
