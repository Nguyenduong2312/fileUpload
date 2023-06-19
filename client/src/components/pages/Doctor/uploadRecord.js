import React, { Fragment, useEffect, useState } from 'react';
import Message from '../../Message';
import axios from 'axios';

import './uploadRecord.css';
import Bar from '../bar/bar';

import { uploadFile, downloadFile } from '../../../custom_modules/Ipfs';
const UploadRecord = () => {
    const [status, setStatus] = useState('Upload');
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose file');
    const [message, setMessage] = useState('');
    const [id, setId] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        const reader = new FileReader();
        reader.addEventListener(
            'load',
            () => {
                setData(reader.result);
            },
            false,
        );

        if (file) {
            reader.readAsArrayBuffer(file);
        }
    });

    const handleChange = (event) => {
        setId(event.target.value);
    };
    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus('Uploading...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', id);
        // const {cid, stringToken} = await uploadFile(data, filename, "a")
        await downloadFile(
            'bafybeigbhbuk3kocwdetx4ta25vweb6lc7i3y7ciqfb3tnnpwz6zw5qu5y',
            'test.txt',
            {
                iv: '357328149241453d69a2daddb928e435',
                ciphertext:
                    '109241eec315fa305b401a944cddb62fb33ad5f9291b1a67bbaf5d52f7e4adc1ea7c186b553c34ebc1101bf54a47d94a8ee225b0a071a342667b7934d4734fddd9587e539c243563e89f4dcef9d9a43b9bf5b646750d3440e0ddfe9db018e282bc1c06dbd40e1745364138a768f6756170b533485fb6d98133f744d95d7a22c14df654f327e6d58cf7442304f4f46aaea4f28212a025b623cfeb0c9ecf83c7aba97eb4e4210c49a7eb79b02dff4a34e843dd38d7407db455807e76a758010e55bb8c1d04e7d8790c4504d3762cf3b3dc687c9421032f54be8288a1ec984eaea145edd85704461e44424e9727a01d66d688f5d09cf4cdd5e45d27a9d6aa5b1d6aff7a958458e9d2bdf0918d5330f8f3a4',
                mac: '0a9a692237ad69ad6ff73b446ea3c694119022e16252a17d69a2e822cdf46d8e',
                ephemPublicKey:
                    '0406f7362343ca2f8520999b4805b773763ca40e3cece064818f1e3f311c31700c7ae8d7ac236b3574d145ee25908f1eb193017915ed295e798e8bec27d4622c8b',
            },
            'a',
        );
        // try {
        //     const res = await axios.post('/record', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //             authorization: `Bearer ${localStorage.getItem('token')}`,
        //         },
        //         credentials: 'include',
        //     });
        //     if (res.data && res.status === 200) {
        //         setMessage(res.data);
        //         setStatus('Upload');
        //     }
        //     //setMessage(`File "${filename}" Uploaded`);
        // } catch (err) {
        //     if (err.response.status === 500) {
        //         setMessage('There was a problem with the server');
        //     } else {
        //         setMessage(err.response.data.msg);
        //     }
        // }
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
                            value={status}
                            className="btn btn-primary btn-block mt-4"
                        />
                    </form>
                </Fragment>
            </div>
        </div>
    );
};

export default UploadRecord;
