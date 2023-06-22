import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function RequestedTag(props) {
    const [user, setuser] = useState();
    useEffect(() => {
        fetch(`http://localhost:5000/account/id/${props.request.idSender}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                if (account) {
                    console.log('acc', account);
                    setuser(account);
                }
            });
    }, [props.request.idSender]);

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
            //console.log('rj', Rejected);
            props.setLengthOfRequestList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    return (
        <div className="record_tag">
            <div className="text" style={{ display: 'block' }}>
                <p>
                    Id Sender: {user?.id}
                    <Link
                        to={`/userDetail/${user?._id}`}
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
