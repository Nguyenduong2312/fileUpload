import React from 'react';
import axios from 'axios';
import './RelationshipRequestTag.css';
export default function RelationshipRequestTag(props) {
    const handleConfirm = async (e) => {
        e.preventDefault();
        //cập nhật status cho api waitting -> accepted
        try {
            await axios.put(`/membership/${props.request._id}`, props.request, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    const handleRejectRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/membership/${props.request._id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    return (
        <div className="requestTag">
            <p>Sender Id: {`${props.request.senderId}`}</p>
            <p>Name: {`${props.request.senderName}`}</p>
            <p>
                Relationship: {`${props.request.senderName}`} is your{' '}
                {`${props.request.senderRole}`}
            </p>
            <div className="buttons">
                <div className="button viewRecord" onClick={handleConfirm}>
                    Confirm
                </div>
                <div
                    className="button delete"
                    style={{ marginLeft: '30px' }}
                    onClick={handleRejectRequest}
                >
                    Decline
                </div>
            </div>
        </div>
    );
}
