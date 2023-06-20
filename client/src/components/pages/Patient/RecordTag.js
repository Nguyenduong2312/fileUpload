import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { downloadFile } from '../../../custom_modules/Ipfs';
import { getTxRecord } from '../../../custom_modules/contractModules';

export default function RecordTag(props) {
    const auth = props.status;
    const [status, setStatus] = useState('Download');
    const [formData, setFormData] = useState({
        idReceiver: props.record.idReceiver,
        idRecord: props.record._id,
        idOnChain: props.record.idOnChain,
        nameRecord: props.record.fileName,
    });

    useEffect(() => {
        fetch('http://localhost:5000/account/user', {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                setFormData((prevState) => ({
                    ...prevState,
                    ['idUploader']: account.id,
                }));
            });
    }, []);

    const handleDownload = (id, filename) => {
        setStatus('Downloading');
        fetch(`http://localhost:5000/record/detail/${id}`)
            .then((res) => res.json())
            .then((res) => getTxRecord(res.idOnChain))
            .then((txRecord) =>
                downloadFile(
                    txRecord.cid,
                    txRecord.fileName,
                    txRecord.encryptedKey,
                    localStorage.getItem('privateKey'),
                ),
            );
    };
    const handleRequestRecord = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/requestRecord', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            //props.setMessage(res.data);
        } catch (err) {
            if (err.response.status === 500) {
                props.setMessage('There was a problem with the server');
            } else {
                props.setMessage(err.response.data.msg);
            }
        }
    };

    return (
        <div className="record_tag">
            <div className="text" style={{ display: 'block' }}>
                <p>File: {props.record.fileName}</p>
                <p>ID Uploader: {props.record.idUploader}</p>
            </div>
            <div className="dashboard_buttons">
                {auth && (
                    <div
                        className={`button ${status}`}
                        onClick={() =>
                            handleDownload(
                                props.record._id,
                                props.record.fileName,
                            )
                        }
                    >
                        {status}
                    </div>
                )}
                {!auth && (
                    <div
                        className="button viewRecord"
                        onClick={handleRequestRecord}
                    >
                        Request Record
                    </div>
                )}
            </div>
        </div>
    );
}
