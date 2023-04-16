import React from 'react'
import { useState } from "react";
import './infor_form.css';

export default function InforForm(props) {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = (event) => {
        props.setStatus(true);
        event.preventDefault();
        console.log(inputs);
    }
  
    return (
        <div className='profile_form_tag'>
            <form onSubmit={handleSubmit}>
            <div className="inputField">
                <label>Username:</label>
                <input 
                    type="text" 
                    name="password" 
                    value={inputs.password || ""} 
                    onChange={handleChange}
                />

            </div>
            <div className="inputField">
                <label>Full name:</label>
                <input 
                    type="text" 
                    name="password" 
                    value={inputs.password || ""} 
                    onChange={handleChange}
                />
            </div>
            <div className="inputField">
                <label>Age:</label>
                <input 
                    type="text" 
                    name="password" 
                    value={inputs.password || ""} 
                    onChange={handleChange}
                />
            </div>
            <div className="inputField">
                <label>Gender:</label>
                <input 
                    type="text" 
                    name="password" 
                    value={inputs.password || ""} 
                    onChange={handleChange}
                />
            </div>
            <input className="submit save" type="submit" value={"Save"}/>
        </form>

        </div>
    )
}
