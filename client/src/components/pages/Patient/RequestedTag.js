import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function RequestedTag(props) {
    const Accepted = {
        idSender: props.request.idSender,
        status: 'Accepted',
    };
    const Rejected = {
        idSender: props.request.idSender,
        status: 'Rejected',
    };

    const handleAcceptRequest = async (e) => {
        e.preventDefault();
        //cập nhật status cho api waitting -> accepted
        try {
            await axios.put(`/requestRecord/${props.request._id}`, Accepted, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('ac', Accepted);
            props.setLength((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    const handleRejectRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/requestRecord/${props.request._id}`, Rejected, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('rj', Rejected);
            props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    return (
        <div className="record_tag">
            <div className="text" style={{ display: 'block' }}>
                <p>
                    Id Sender: {props.request.idSender}{' '}
                    <Link
                        to={`/userDetail/${props.request.idSender}`}
                        style={{ textDecorationLine: 'none' }}
                    >
                        [Xem thông tin]
                    </Link>
                </p>
                <p>File name: {props.request.nameRecord}</p>
            </div>
            <div className="dashboard_buttons">
                <div
                    className="button"
                    style={{ backgroundColor: '#54B435' }}
                    onClick={handleAcceptRequest}
                >
                    Accept
                </div>
                <div
                    className="button delete"
                    onClick={handleRejectRequest}
                    style={{ marginLeft: '30px' }}
                >
                    Reject
                </div>
            </div>
        </div>
    );
}
