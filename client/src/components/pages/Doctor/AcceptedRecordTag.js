import React from 'react';
import './AcceptedRecordTag.css';
import axios from 'axios';

export default function AcceptedRecordTag(props) {
    const handleDownload = (id, filename) => {
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

    const handleRejectRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/requestRecord/${props.record._id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLength((prev) => prev - 1);
        } catch (err) {
            if (err.response.status === 500) {
                props.setMessage('There was a problem with the server');
            } else {
                props.setMessage(err.response.data.msg);
            }
        }
    };

    return (
        <div>
            <div className="record_tag">
                <div className="text" style={{ display: 'block' }}>
                    <p>Sender id: {props.record.idSender}</p>
                    <p>Name: {props.record.fileName}</p>
                </div>
                <div className="dashboard_buttons">
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
                    <div
                        className="button delete"
                        onClick={handleRejectRequest}
                    >
                        Delete
                    </div>
                </div>
            </div>
        </div>
    );
}
