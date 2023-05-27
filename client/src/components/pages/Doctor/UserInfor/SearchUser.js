import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSearchAlt } from "react-icons/bi";

import Message from '../../../Message';
import Bar from '../../bar/bar';
import UserTag from '../../Patient/Membership/UserTag';

import './SearchUser.css'
import { Button } from 'react-bootstrap';

const RequestRecord = () => {
    const [message, setMessage] = useState('');
    const [id, setId] = useState('null')
    const [user, setUser] = useState({
        name: ' ',
        id: ' '
    })

    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(`/login/patient/${e.target.id.value}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data === false){
                setId('null');
                setMessage('User is not exist.');
            }
            else{
                setId(e.target.id.value);
            }
        } catch(err){
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };
    useEffect(() => {
        fetch(`http://localhost:5000/login/${id}`,{
            credentials: 'include',
            method: 'GET',
        })
        .then(res => res.json())
        .then((account) => {
            setUser(account);
        })
    },[id])
    return (
        <div>
            <Bar></Bar>
            <div className="container mt-4">
                <h5>User id:</h5>
            </div>
            <div style={{width: '70%', margin: 'auto'}}>{message ? <Message msg={message}  /> : null}</div>
            <form className="input-group" onSubmit={onSubmit}>
                <input 
                type="text" 
                name = "id"
                className="form-control" 
                placeholder="Search ... "
                />
                <Button className="search-button" type="submit">
                    <BiSearchAlt className="fa fa-search" fontSize={20} />
                </Button>
            </form>
            <div className = "result_search">
                {id !== 'null'&& user && <UserTag name = {user.name} id = {user.id}></UserTag>}
            </div>
        </div>
    );
};

export default RequestRecord;
