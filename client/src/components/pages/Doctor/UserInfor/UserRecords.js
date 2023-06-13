import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import Bar from '../../bar/bar';
import RecordTag from '../../Patient/RecordTag';
import Message from '../../../Message';

import './UserRecords.css';

export default function UseRecords(props) {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [recordList, setRecordList] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/account/${id}`)
            .then((res) => res.json())
            .then((account) => {
                setUser(account);
                fetch(`http://localhost:5000/record/${account.id}`)
                    .then((res) => res.json())
                    .then((records) => {
                        setRecordList(records);
                    });
            });
    }, []);

    return (
        <div>
            <Bar></Bar>
            <div className="AcceptedRecord_tag">
                <div className="inforPatient">
                    <h5>Name: {user.name}</h5>
                </div>

                <div className="recordList">
                    <div style={{ width: '100%', margin: 'auto' }}>
                        {message ? <Message msg={message} /> : null}
                    </div>

                    {recordList?.map((record) => (
                        <RecordTag
                            record={record}
                            idSession={id}
                            status={false}
                            setMessage={setMessage}
                        />
                    ))}
                </div>

                <div className="button back">
                    <Link
                        to={`/userDetail/${id}`}
                        style={{ textDecorationLine: 'none', color: 'white' }}
                    >
                        {' '}
                        Back{' '}
                    </Link>
                </div>
            </div>
        </div>
    );
}
