import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './UserTag.css';

export default function UserTag(props) {
    const [user, setUser] = useState({});
    useEffect(() => {
        fetch(`http://localhost:5000/account/${props.id}`, {
            credentials: 'include',
            method: 'GET',
        })
            .then((res) => res.json())
            .then((account) => {
                setUser(account);
            });
    }, [props.id]);

    return (
        <div className="userTag">
            <p>{props.role}</p>
            <div className="icon_user">
                <img src="../image/user.png" alt="" />
            </div>
            <div className="infor">
                <p>Name:{user.name}</p>
                <p>Id: {user.id}</p>
            </div>
            <div className="listButton">
                <div
                    className="button viewFamilyMember"
                    style={{ marginTop: '20px' }}
                >
                    <Link
                        to={`/userDetail/${user._id}`}
                        style={{ textDecorationLine: 'none', color: 'white' }}
                    >
                        {' '}
                        View Information{' '}
                    </Link>
                </div>
            </div>
        </div>
    );
}
