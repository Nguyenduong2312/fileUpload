import './login.css';
import { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

import Message from '../Message';

export default function Register(props) {
    const [formData, setFormData] = useState({
        username: '',
        password1: '',
        password2: '',
      })  
    const [message, setMessage] = useState('');
    const { username, password1, password2 } = formData
    const navigate = useNavigate();

    const onChange = e => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
          }))
      };
    
    const onSubmit = async e => {
        if (password1 !== password2){
            setMessage('Password không giống nhau.')
        }

        e.preventDefault();
    
        try {
            console.log();
            const res = await axios.post('/register', formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        // 
        if (res.data.status === true) {
            navigate('/myProfile');
        }
        setMessage('Lỗi')
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
                <img src="image/img_login.png" alt=""/>
            </div>
            <div class="login_tag_cover">
                <div class="login_tag">
                    <div className='login_tag_text'>
                        <p>REGISTER</p>
                        <section>
                            <form onSubmit={onSubmit}>
                                <div className="inputField">
                                    <label>Username:<br></br>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        id='email'
                                        value={username || ""} 
                                        onChange= {onChange}
                                    />
                                    </label>
                                </div>
                                <div className="inputField">
                                    <label>Password:<br></br>
                                        <input 
                                        type="password"
                                        name="password1" 
                                        id="password1" 
                                        value={password1 || ""} 
                                        onChange={onChange}
                                        />
                                    </label>
                                </div>
                                <div className="inputField">
                                    <label>Repeat Password:<br></br>
                                        <input 
                                        type="password"
                                        name="password2" 
                                        id="password2" 
                                        value={password2 || ""} 
                                        onChange={onChange}
                                        />
                                    </label>
                                </div>
                                <p className='login'>Already have an account?<Link style={{textDecoration: 'none'}} to="/login"><span> Login</span> </Link></p>
                                <input className="submit" type="submit" />
                            </form>
                            <div className='message'>
                                {message ? <Message msg={message} /> : null}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}  