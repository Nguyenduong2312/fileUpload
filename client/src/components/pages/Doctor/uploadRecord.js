import React, { Fragment, useState, useEffect } from 'react';
import Message from '../../Message';
import axios from 'axios';

import './uploadRecord.css';
import Bar from '../bar/bar';

const UploadRecord = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose file');
    const [message, setMessage] = useState('');
    const [id, setId] = useState('');

    const handleChange = (event) => {
        setId(event.target.value);
    };
    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', id);
        console.log('form', formData);
        try {
            const res = await axios.post('/record', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                credentials: 'include',
            });
            console.log(res.status);
            if (res.data && res.status === 200) {
                console.log('true');
                setMessage(res.data);
            }
            //setMessage(`File "${filename}" Uploaded`);
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
                <h4 className="display-4 text-center mb-4">File Upload</h4>

                <Fragment>
                    {message ? <Message msg={message} /> : null}
                    <form onSubmit={onSubmit}>
                        <div className="inputField id">
                            <label>
                                Patient id:<br></br>
                                <input
                                    type="text"
                                    id="id"
                                    name="id"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        <div className="custom-file mb-3">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="customFile"
                                onChange={onChange}
                            />
                            <label
                                className="custom-file-label"
                                htmlFor="customFile"
                            >
                                {filename}
                            </label>
                        </div>
                        <input
                            type="submit"
                            value="Upload"
                            className="btn btn-primary btn-block mt-4"
                        />
                    </form>
                </Fragment>
            </div>
        </div>
    );
};

export default UploadRecord;
