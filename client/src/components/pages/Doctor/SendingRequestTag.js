import React from 'react';
import axios from 'axios';
import './SendingRequestTag.css';

export default function RequestList(props) {
    const handleDeleteRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/requestRecord/${props.request._id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLength((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    return (
        <div className="record_tag">
            <div className="text" style={{ display: 'block' }}>
                <p>
                    Receiver id: <span>{props.request.idReceiver}</span>
                </p>
                <p>File name: {props.request.nameRecord} </p>
            </div>
            <div className="dashboard_buttons">
                <div className={`status ${props.request.status}`}>
                    [{props.request.status}]
                </div>
                <div
                    className="button delete"
                    onClick={handleDeleteRequest}
                    style={{ marginLeft: '30px' }}
                >
                    Delete
                </div>
            </div>
        </div>
    );
}
