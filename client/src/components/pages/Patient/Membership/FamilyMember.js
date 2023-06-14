import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Message from '../../../Message';
import Bar from '../../bar/bar';
import UserTag from './UserTag';

import './FamilyMember.css';

export default function FamilyMember() {
    const [formData, setFormData] = useState({});
    const [childList, setChildList] = useState([]);
    const [parentList, setParentList] = useState([]);
    const [message, setMessage] = useState('');
    const [idUser, setIduser] = useState('');
    let { id } = useParams();
    useEffect(() => {
        setParentList([]);
        setChildList([]);
        fetch(`http://localhost:5000/account/${id || 'user'}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                setIduser(account.id);
                console.log('account: ', account);
                console.log('relation: ', account.relationship);
                const accRelationship = account.relationship;
                for (let key in accRelationship) {
                    fetch(`http://localhost:5000/account/id/${key}`, {
                        credentials: 'include',
                        method: 'GET',
                    })
                        .then((res) => res.json())
                        .then((user) => {
                            var tmp = user;
                            tmp.roleRelationShip = accRelationship[key];
                            if (accRelationship[key] !== 'Child') {
                                setParentList((oldArray) => [...oldArray, tmp]);
                            } else {
                                setChildList((oldArray) => [...oldArray, tmp]);
                            }
                        });
                }
            });
    }, [id]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/membership`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage(res.data);
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
            <div style={{ width: '60%', margin: 'auto' }}>
                {message ? <Message msg={message} /> : null}
            </div>
            {!id && (
                <form className="addMember" onSubmit={onSubmit}>
                    <div className="line_input">
                        <div className="inputField">
                            <label>ID:</label>
                            <input type="text" name="id" onChange={onChange} />
                        </div>
                        <div className="inputField">
                            <label>Role: </label>
                            <select
                                name="role"
                                defaultValue="Select"
                                onChange={onChange}
                            >
                                <option>Select...</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Child">Child</option>
                            </select>
                        </div>
                    </div>
                    <input
                        className="button submit"
                        type="submit"
                        value={'Send request'}
                    />
                </form>
            )}

            <div style={{ marginLeft: '100px', marginTop: '50px' }}>
                {id && <h5>ID user: {idUser}</h5>}
            </div>

            <div className="listMember">
                <p style={{ fontSize: '25px', fontWeight: '700' }}>PARENTS: </p>
                <div className="memberTags parents">
                    {parentList.map((user) => (
                        <UserTag
                            id={user._id}
                            role={user.roleRelationShip}
                        ></UserTag>
                    ))}
                </div>

                <p
                    style={{
                        fontSize: '25px',
                        fontWeight: '700',
                        marginTop: '50px',
                    }}
                >
                    CHILDREN:{' '}
                </p>
                <div className="memberTags children">
                    {childList.map((user) => (
                        <UserTag
                            id={user._id}
                            role={user.roleRelationShip}
                        ></UserTag>
                    ))}
                </div>
            </div>
        </div>
    );
}
