import React, { useEffect, useState } from 'react';

import './UserDetail.css';
import Bar from '../../bar/bar';
import { useParams, Link } from 'react-router-dom';

export default function UserDetail(props) {
    const { id } = useParams();
    const [user, setUser] = useState({});
    useEffect(() => {
        fetch(`http://localhost:5000/login/id/${id}`, {
            credentials: 'include',
            method: 'GET',
        })
            .then((res) => res.json())
            .then((account) => {
                setUser(account);
            });
    });
    return (
        <div>
            <Bar></Bar>
            <div className="userInfor">
                <div className="img_buttons">
                    <img src="../image/userProfile.png" />
                    <div className="buttons">
                        <div className="button viewRecord">
                            <Link
                                to={`/records/${id}`}
                                style={{
                                    textDecorationLine: 'none',
                                    color: 'white',
                                }}
                            >
                                Record list
                            </Link>
                        </div>
                        <div
                            className="button viewFamilyMember"
                            style={{ marginTop: '10px' }}
                        >
                            <Link
                                to={`/membership/${id}`}
                                style={{
                                    textDecorationLine: 'none',
                                    color: 'white',
                                }}
                            >
                                Relationship
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="infor">
                    <div className="inforTag">
                        <h5 style={{ fontWeight: '700' }}>Information</h5>
                        <div className="inforContent">
                            <p>Full name: {user.name}</p>
                            <p>Gender: {user.gender}</p>
                            <p>Birthday: {user.birthday}</p>
                            <p>Address: {user.address}</p>
                            <p>Email: {user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
