import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import './UpdateInforForm.css';

export default function InforForm(props) {
    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState('');
    const { fullName, gender, address, email, date} = formData;
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try{
            await axios.put('/myProfile/1', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setStatus(true);
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
            <form className = "UpdateAccountForm"
                onSubmit={onSubmit}>
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
                    <select 
                        name="gender" 
                        defaultValue="Select"
                        onChange={onChange}>
                        <option>Select...</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="inputField">
                    <label>Address:</label>
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
                <div className="inputField">
                    <label>BirthDay:</label>
                    <input 
                    type="date" 
                    name = 'date'
                    value={date} 
                    onChange={onChange} />
                </div> 

                <input className="submit save" type="submit" value={'Save'} />
            </form>
        </div>
    );
}
