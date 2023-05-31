import React, { useEffect, useState } from 'react';
import './DashBoard.css';

import Bar from '../bar/bar';
import AcceptedRecordTag from '../Doctor/AcceptedRecordTag';
import RequestList from '../Doctor/SendingRequestTag';
import RecordTag from '../Patient/RecordTag';
import RequestedTag from '../Patient/RequestedTag';

export default function DashBoard() {
    const [tab, setTab] = useState(1);

    const [receivedRecord_DT, setReceivedRecord_DT] = useState([]);
    const [requestList_DT, setRequestList_DT] = useState([]);

    const [recordList, setRecordList] = useState([]);
    const [receivedRequest, setReceivedRequest] = useState([]);
    const [receivedRecord_PT, setReceivedRecord_PT] = useState([]);
    const [requestList_PT, setRequestList_PT] = useState([]);

    const [lengthOfReceivedRecord_DT, setLengthOfReceivedRecord_DT] =
        useState(0);
    const [lengthOfRequestList_DT, setLengthOfRequestList_DT] = useState(0);

    const [lengthOfReceivedRequest, setLengthOfReceivedRequest] = useState(0);
    const [lengthOfReceivedRecord_PT, setLengthOfReceivedRecord_PT] =
        useState(0);
    const [lengthOfRequestList_PT, setLengthOfRequestList_PT] = useState(0);

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
                if (account.role === 'Patient') {
                    fetch(`http://localhost:5000/record/${account.id}`)
                        .then((res) => res.json())
                        .then((records) => {
                            setRecordList(records);
                            //setLengthOfRecordList(records.length);
                        });

                    fetch(
                        `http://localhost:5000/requestRecord/receiver/${account.id}`,
                    )
                        .then((res) => res.json())
                        .then((requests) => {
                            setReceivedRequest(requests);
                            setLengthOfReceivedRequest(requests.length);
                        });
                }

                fetch(`http://localhost:5000/record/${account.id}`)
                    .then((res) => res.json())
                    .then((record) => {
                        if (account.role === 'Doctor') {
                            setReceivedRecord_DT(record);
                            setLengthOfReceivedRecord_DT(record.length);
                        } else {
                            setReceivedRecord_PT(record);
                            setLengthOfReceivedRecord_PT(record.length);
                        }
                    });

                fetch(
                    `http://localhost:5000/requestRecord/sender/${account.id}`,
                )
                    .then((res) => res.json())
                    .then((requests) => {
                        if (account.role === 'Doctor') {
                            setRequestList_DT(requests);
                            setLengthOfRequestList_DT(requests.length);
                        } else {
                            setRequestList_PT(requests);
                            setLengthOfRequestList_PT(requests.length);
                        }
                    });
            });
    }, [
        lengthOfReceivedRecord_DT,
        lengthOfRequestList_DT,

        lengthOfReceivedRequest,
        lengthOfReceivedRecord_PT,
        lengthOfRequestList_PT,
    ]);

    return (
        <div>
            <Bar />
            <h3>DASHBOARD</h3>
            <div className="dashboard_content">
                <div className="dashboard_menu">
                    {!role && (
                        <div style={{ display: 'flex' }}>
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
                                {lengthOfReceivedRequest !== 0 && (
                                    <div className="notice">
                                        {lengthOfReceivedRequest}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div
                        className={`dashboard_menu_button ${
                            role ? tab === 1 : tab === 3
                        }`}
                        onClick={() => setTab(role ? 1 : 3)}
                        style={{ display: 'flex' }}
                    >
                        Received Record
                        {role && lengthOfReceivedRecord_DT !== 0 && (
                            <div className="notice">
                                {lengthOfReceivedRecord_DT}
                            </div>
                        )}
                        {!role && lengthOfReceivedRecord_PT !== 0 && (
                            <div className="notice">
                                {lengthOfReceivedRecord_PT}
                            </div>
                        )}
                    </div>
                    <div
                        className={`dashboard_menu_button ${
                            role ? tab === 2 : tab === 4
                        }`}
                        onClick={() => setTab(role ? 2 : 4)}
                    >
                        Sent Request
                    </div>
                </div>

                {role && (
                    <div className="dashboard_tag">
                        {tab === 1 &&
                            receivedRecord_DT.map((record) => (
                                <AcceptedRecordTag
                                    record={record}
                                    setLength={setLengthOfReceivedRecord_DT}
                                />
                            ))}
                        {tab === 2 &&
                            requestList_DT.map((request) => (
                                <RequestList
                                    request={request}
                                    setLength={setLengthOfRequestList_DT}
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
                            receivedRequest.map((request) => (
                                <RequestedTag
                                    request={request}
                                    setLength={setLengthOfReceivedRequest}
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
