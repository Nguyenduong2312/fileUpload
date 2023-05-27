import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Message from '../../../../Message';

import './UserTag.css';

export default function UserTag(props) {
    const [message, setMessage] = useState('');
    const formData = {
        idBN: props.id,
    };
    const handleRequest = async (e) => {
        e.preventDefault();
        console.log('tap');
        try {
            const res = await axios.post(`/requestRecord`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(res.data);
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    return (
        <div className="userTag">
            <div style={{ width: '100%', marginTop: '-20px' }}>
                {message ? <Message msg={message} /> : null}
            </div>
            <p>{props.role}</p>
            <div className="icon_user">
                <img src="../image/user.png" alt="" />
            </div>
            <div className="infor">
                <p>Name:{props.name} </p>
                <p>Id: {props.id}</p>
            </div>
            <div className="listButton">
                <div className="button viewRecord" onClick={handleRequest}>
                    Request records
                </div>
                <div
                    className="button viewFamilyMember"
                    style={{ marginTop: '20px' }}
                >
                    <Link
                        to={`/branch/${props.id}`}
                        style={{ textDecorationLine: 'none', color: 'white' }}
                    >
                        {' '}
                        View family member{' '}
                    </Link>
                </div>
            </div>
        </div>
    );
}
