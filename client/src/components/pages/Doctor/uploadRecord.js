import React, { Fragment, useEffect, useState } from 'react';
import Message from '../../Message';
import axios from 'axios';

import './uploadRecord.css';
import Bar from '../bar/bar';

import { uploadFile } from '../../../custom_modules/Ipfs';
import { createRecordOnBlockchain } from '../../../custom_modules/contractModules';

const UploadRecord = () => {
    const [status, setStatus] = useState('Upload');
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose file');
    const [message, setMessage] = useState('');
    const [id, setId] = useState('');
    const [data, setData] = useState('');
    const [patient, setPatient] = useState({});

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
        fetch(`http://localhost:5000/account/patient/${event.target.value}`)
            .then((res) => res.json())
            .then((account) => {
                if (account) {
                    setPatient(account);
                } else {
                    setPatient();
                }
            });
    };
    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus('Uploading...');

        const { cid, stringToken } = await uploadFile(
            data,
            filename,
            patient.publicKey,
        );

        const idOnChain = await createRecordOnBlockchain(
            stringToken,
            patient.blockchainAddress,
            cid,
            filename,
            localStorage.getItem('privateKey'),
        );
        const formData = new FormData();
        formData.append('id', id);
        formData.append('filename', filename);
        formData.append('idOnChain', idOnChain);

        console.log(idOnChain);
        // await downloadFile(
        //     cid,
        //     filename,
        //     stringToken,
        //     privateKey,
        // );
        try {
            console.log('ok');
            const res = await axios.post('/record', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
            });
            if (res.data && res.status === 200) {
                setMessage(res.data);
                setStatus('Upload');
            }
            setMessage(`File "${filename}" Uploaded`);
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
                                    required
                                />
                            </label>
                        </div>

                        <div className="custom-file mb-3">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="customFile"
                                onChange={onChange}
                                required
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
