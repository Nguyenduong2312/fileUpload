import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import './UpdateInforForm.css';

export default function InforForm(props) {
    const [formData, setFormData] = useState({})
    const [role, setRole] = useState({})
    const [listRole, setListRole] = useState([])
    const [id, setId] = useState([])
    //const [role, setRole] = useState([])
    const [lengthOfRole, setLengthOfRole] = useState(1)
    const [message, setMessage] = useState('');
    const { fullName, gender, address, email, date} = formData;

    const handleNew = () =>{
        setLengthOfRole(lengthOfRole + 1);
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.put(`/myProfile/${props._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setStatus(true);
            console.log(formData);
            console.log('id: ', id);
            console.log('role',role);
            console.log('list role: ', listRole);
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
                <p className='titleProfile'>Information:</p>
                <div className="inputField">
                    <label>Full name:</label>
                    <input
                        type="text"
                        name="name"
                        value={fullName}
                        onChange={onChange}
                    />
                </div>
                <div className='line_input'> 
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
                        <label>BirthDay:</label>
                        <input 
                        type="date" 
                        name = 'date'
                        value={date} 
                        onChange={onChange} />
                    </div> 
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
                <p className='titleProfile'>Relationship:</p>
                <div className="new button" onClick={handleNew}>+ New</div>
                {Array(lengthOfRole).fill().map((item,index) => (
                    <div className='line_input'> 
                        <div className="inputField">
                            <label>ID: </label>
                            <input
                                type="text"
                                name={`id${index}`}
                                //value={fullName}
                                onChange={onChange}
                            />

                        </div>
                        <div className="inputField">
                            <label>Role: </label>
                            <select 
                                name={`role${index}`}
                                defaultValue="Select"
                                onChange={onChange}>
                                <option>Select...</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Child">Child</option>
                                <option value="Other">Other</option>
                            </select>
                        </div> 
                    </div>

                ))}


                <input className="submit save" type="submit" value={'Save'} />
            </form>
        </div>
    );
}
