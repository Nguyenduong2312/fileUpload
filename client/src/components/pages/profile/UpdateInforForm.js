import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import './UpdateInforForm.css';

export default function InforForm(props) {
    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState('');
    const { fullName, gender, address, email} = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        props.setStatus(true);

        e.preventDefault();

        try{
            await axios.put('/myProfile/1', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch(err){
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    return (
        <div className="profile_form_tag">
            <form onSubmit={onSubmit}>
                <div className="inputField">
                    <label>Full name:</label>
                    <input
                        type="text"
                        name="name"
                        value={fullName}
                        onChange={onChange}
                    />
                </div>
                <div className="inputField">
                    <label>Gender:</label>
                    <input
                        type="text"
                        name="gender"
                        value={gender}
                        onChange={onChange}
                    />
                </div>
                <div className="inputField">
                    <label>Add  ress:</label>
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={onChange}
                    />
                </div> 
                <div className="inputField">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                    />
                </div> 
                <input className="submit save" type="submit" value={'Save'} />
            </form>
        </div>
    );
}
