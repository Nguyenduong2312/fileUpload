import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

export default function RecordTag(props) {
    const auth = props.status;
    const [formData, setFormData] = useState({
        idReceiver: props.record.idReceiver,
        idRecord: props.record._id,
        idOnChain: props.record.idOnChain,
        nameRecord: props.record.fileName,
    });

    useEffect(() => {
        fetch('http://localhost:5000/login/user', {
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
        console.log(`Download: ${id}`);
        fetch(`http://localhost:5000/record/download/${id}`).then(
            (response) => {
                response.blob().then((blob) => {
                    const fileURL = window.URL.createObjectURL(blob);
                    let alink = document.createElement('a');
                    alink.href = fileURL;
                    alink.download = filename;
                    alink.click();
                });
            },
        );
    };
    const handleRequestRecord = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/requestRecord', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            props.setMessage(res.data);
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
                        className="button download"
                        onClick={() =>
                            handleDownload(
                                props.record._id,
                                props.record.fileName,
                            )
                        }
                    >
                        Download
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
