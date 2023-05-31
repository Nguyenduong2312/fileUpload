import React, { useEffect, useState } from 'react';
import './DashBoard.css';

import Bar from '../bar/bar';
import AcceptedRecordTag from '../Doctor/AcceptedRecordTag';
import RequestList from '../Doctor/SendingRequestTag';
import RecordTag from '../Patient/RecordTag';
import RequestedTag from '../Patient/RequestedTag';

export default function DashBoard() {
    const [tab, setTab] = useState(1);

    const [requestList, setRequestList] = useState([]);
    const [acceptedList, setAcceptedList] = useState([]);
    const [recordList, setRecordList] = useState([]);
    const [requestedList, setRequestedList] = useState([]);

    const [lengthOfRecordList, setLengthOfRecordList] = useState(0);
    const [lengthOfRequestedList, setLengthOfRequestedList] = useState(0);
    const [lengthOfRequestList, setLengthOfRequestList] = useState(0);
    const [lengthOfAcceptedList, setLengthOfAcceptedList] = useState(0);
    const [role, setRole] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/login/user', {
            credentials: 'include',
            method: 'GET',
        })
            .then((res) => res.json())
            .then((account) => {
                if (account.role === 'Doctor') {
                    setRole(true);
                } else {
                    setRole(false);
                }

                if (account.role === 'Doctor') {
                    fetch(
                        `http://localhost:5000/requestRecord/sender/${account.id}`,
                    )
                        .then((res) => res.json())
                        .then((requests) => {
                            setRequestList(requests);
                            setLengthOfRequestList(requests.length);
                        });
                    fetch(`http://localhost:5000/record/${account.id}`)
                        .then((res) => res.json())
                        .then((record) => {
                            setAcceptedList(record);
                            setLengthOfAcceptedList(record.length);
                        });
                } else {
                    fetch(
                        `http://localhost:5000/requestRecord/receiver/${account.id}`,
                    )
                        .then((res) => res.json())
                        .then((requests) => {
                            setRequestedList(requests);
                            setLengthOfRequestedList(requests.length);
                        });
                    fetch(`http://localhost:5000/record/${account.id}`)
                        .then((res) => res.json())
                        .then((records) => {
                            setRecordList(records);
                            setLengthOfRecordList(records.length);
                        });
                }
            });
    }, [
        lengthOfRecordList,
        lengthOfRequestedList,
        lengthOfRequestList,
        lengthOfAcceptedList,
    ]);

    return (
        <div>
            <Bar />
            <h3>DASHBOARD</h3>
            <div className="dashboard_content">
                {role && (
                    <div className="dashboard_menu">
                        <div
                            className={`dashboard_menu_button ${tab === 1}`}
                            onClick={() => setTab(1)}
                            style={{ display: 'flex' }}
                        >
                            Received Record
                            {lengthOfAcceptedList !== 0 && (
                                <div className="notice">
                                    {lengthOfAcceptedList}
                                </div>
                            )}
                        </div>
                        <div
                            className={`dashboard_menu_button ${tab === 2}`}
                            onClick={() => setTab(2)}
                        >
                            Sent Request
                        </div>
                    </div>
                )}
                {!role && (
                    <div className="dashboard_menu">
                        <div
                            className={`dashboard_menu_button ${tab === 1}`}
                            onClick={() => setTab(1)}
                        >
                            My Records
                        </div>
                        <div
                            className={`dashboard_menu_button ${tab === 2}`}
                            onClick={() => setTab(2)}
                            style={{ display: 'flex' }}
                        >
                            Request List
                            {lengthOfRequestedList !== 0 && (
                                <div className="notice">
                                    {lengthOfRequestedList}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {role && (
                    <div className="dashboard_tag">
                        {tab === 1 &&
                            acceptedList.map((record) => (
                                <AcceptedRecordTag
                                    record={record}
                                    setLengthOfAcceptedList={
                                        setLengthOfAcceptedList
                                    }
                                />
                            ))}
                        {tab === 2 &&
                            requestList.map((request) => (
                                <RequestList
                                    request={request}
                                    setLengthOfRequestList={
                                        setLengthOfRequestList
                                    }
                                />
                            ))}
                    </div>
                )}
                {!role && (
                    <div className="dashboard_tag">
                        {tab === 1 &&
                            recordList.map((record) => (
                                <RecordTag record={record} status={true} />
                            ))}
                        {tab === 2 &&
                            requestedList.map((request) => (
                                <RequestedTag
                                    request={request}
                                    setLengthOfRequestList={
                                        setLengthOfRequestList
                                    }
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
