import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css';

import Bar from '../bar/bar';
import AcceptedRecordTag from '../Doctor/AcceptedRecordTag';
import RequestList from '../Doctor/SendingRequestTag';
import RecordTag from '../Patient/RecordTag';
import RequestedTag from '../Patient/RequestedTag';

export default function DashBoard() {
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(false);

    const [requestList, setRequestList] = useState([]);
    const [acceptedList, setAcceptedList] = useState([]);
    const [recordList, setRecordList] = useState([]);
    const [requestedList, setRequestedList] = useState([]);

    const [lengthOfRecordList, setLengthOfRecordList] = useState(0);
    const [lengthOfRequestedList, setLengthOfRequestedList] = useState(0);
    const [lengthOfRequestList, setLengthOfRequestList] = useState(0);
    const [lengthOfAcceptedList, setLengthOfAcceptedList] = useState(0);
    const [role,setRole] = useState(true)
    useEffect(() => {
        fetch('http://localhost:5000/login/user',{
            credentials: 'include',
            method: 'GET',
        })
        .then(res => res.json())
        .then(account => {
            if(account.role === 'Doctor'){ setRole(true) }
            else{setRole(false) }

            if(account.role === 'Doctor'){
                fetch(`http://localhost:5000/requestRecord/sender/${account.id}`)
                .then(res => res.json())
                .then(requests => {
                    setRequestList(requests)
                    setLengthOfRequestList(requests.length)
                })
                fetch(`http://localhost:5000/requestRecord/accepted/sender/${account.id}`)
                .then(res => res.json())
                .then(requests => {
                    setAcceptedList(requests)
                    setLengthOfAcceptedList(requests.length)
                })
            }
            else{
                fetch(`http://localhost:5000/requestRecord/receiver/${account.id}`)
                .then(res => res.json())
                .then(requests => {
                    setRequestedList(requests)
                    setLengthOfRequestedList(requests.length)
                })
                fetch(`http://localhost:5000/record/${account.id}`)
                .then(res => res.json())
                .then(records => {
                    setRecordList(records)
                    setLengthOfRecordList(records.length)
                })
            }
                
        })
    },[lengthOfRecordList,lengthOfRequestedList,lengthOfRequestList,lengthOfAcceptedList])

    const handleClickFirst = () =>{
        setFirst(true)
        setSecond(false)    
    }
    const handleClickSecond = () =>{
        setFirst(false)
        setSecond(true)    
    }


    return (
        <div>
            <Bar />
            <h3>DASHBOARD</h3>
            <div className='dashboard_content'>
                {role && <div className='dashboard_menu'>
                    <div className={`dashboard_menu_button ${first}`} onClick={handleClickFirst}>Accepted Records</div>
                    <div className={`dashboard_menu_button ${second}`} onClick={handleClickSecond}>Sending Request</div>
                </div>}
                {!role && <div className='dashboard_menu'>
                    <div className={`dashboard_menu_button ${first}`} onClick={handleClickFirst}>My Records</div>
                    <div className={`dashboard_menu_button ${second}`} onClick={handleClickSecond}>Request List</div>
                </div>}
                {role && <div className='dashboard_tag'>
                    {first && acceptedList.map(record => 
                        <AcceptedRecordTag record = {record} setLengthOfAcceptedList = {setLengthOfAcceptedList}/>)}
                    {second && requestList.map(request => 
                        <RequestList request = {request} setLengthOfRequestList = {setLengthOfRequestList}/>
                    )}
                </div>}
                {!role && <div className='dashboard_tag'>
                    {first && recordList.map(record => 
                        <RecordTag record = {record} status = {true}/>)}
                    {second && requestedList.map(request => 
                        <RequestedTag request = {request} setLengthOfRequestList = {setLengthOfRequestList}/>
                    )}
                </div>}
            </div>

        </div>
    );
}
