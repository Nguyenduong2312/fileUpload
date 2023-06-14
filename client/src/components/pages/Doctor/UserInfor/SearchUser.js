import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSearchAlt } from 'react-icons/bi';

import Message from '../../../Message';
import Bar from '../../bar/bar';
import UserTag from '../../Patient/Membership/UserTag';

import './SearchUser.css';
import { Button } from 'react-bootstrap';

const RequestRecord = () => {
    const [message, setMessage] = useState('');
    const [user, setUser] = useState();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            fetch(`http://localhost:5000/login/patient/${e.target.id.value}`)
                .then((res) => res.json())
                .then((account) => {
                    if (account) {
                        setUser(account);
                    } else {
                        setMessage('User is not exist');
                        setUser();
                    }
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
            <div className="container mt-4">
                <h5>User id:</h5>
            </div>
            <div style={{ width: '70%', margin: 'auto' }}>
                {message ? <Message msg={message} /> : null}
            </div>
            <form className="input-group" onSubmit={onSubmit}>
                <input
                    type="text"
                    name="id"
                    className="form-control"
                    placeholder="Search ... "
                />
                <Button className="search-button" type="submit">
                    <BiSearchAlt className="fa fa-search" fontSize={20} />
                </Button>
            </form>
            <div className="result_search">
                {user && <UserTag id={user._id}></UserTag>}
            </div>
        </div>
    );
};

export default RequestRecord;
