import React, { Fragment, useState, useEffect } from 'react';
import Message from '../../../Message';
import Bar from '../../bar/bar';

import axios from 'axios';

const RequestRecord = () => {
    const [message, setMessage] = useState('');
    const [idBN, setIdBN] = useState('');
    const handleChange = (event) => {
        setIdBN(event.target.value);
    };
    const formData = { idBN: idBN };

    const [id, setId] = useState();
    useEffect(() => {
        fetch('http://localhost:5000/login/user', {
            credentials: 'include',
            method: 'GET',
        })
            .then((res) => res.json())
            .then((requests) => {
                setId(requests.id);
            });
    });
    const onSubmit = async (e) => {
        e.preventDefault();
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
        <div>
            <Bar></Bar>
            <div className="container mt-4">
                <h4 className="display-4 text-center mb-4">Request Record</h4>
                <Fragment>
                    {message ? <Message msg={message} /> : null}
                    <form onSubmit={onSubmit}>
                        <div className="inputField id">
                            <label>
                                Patient id:<br></br>
                                <input
                                    type="text"
                                    id="id"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <input
                            type="submit"
                            value="Send request"
                            className="btn btn-warning btn-block mt-4"
                        />
                    </form>
                </Fragment>
            </div>
        </div>
    );
};

export default RequestRecord;
