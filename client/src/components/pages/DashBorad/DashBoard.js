import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css';

import Bar from '../bar/bar';
import AcceptedList from './Doctor/AcceptedList';
import RequestList from './Doctor/RequestList';
import RecordList from './Patient/RecordList';
import RequestedList from './Patient/RequestedList';

export default function DashBoard() {
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(false);
    const [isViewRecord, setIsViewRecord]  = useState(false);

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
        .then(requests => {
            if(requests.role === 'Doctor'){ setRole(true) }
            else{setRole(false) }

            if(requests.role === 'Doctor'){
                fetch(`http://localhost:5000/requestRecord/sender/${requests.id}`)
                .then(res => res.json())
                .then(requests => {
                    setRequestList(requests)
                    setLengthOfRequestList(requests.length)
                })
                fetch(`http://localhost:5000/requestRecord/accepted/sender/${requests.id}`)
                .then(res => res.json())
                .then(requests => {
                    setAcceptedList(requests)
                    setLengthOfAcceptedList(requests.length)
                })
            }
            else{
                fetch(`http://localhost:5000/requestRecord/receiver/${requests.id}`)
                .then(res => res.json())
                .then(requests => {
                    setRequestedList(requests)
                    setLengthOfRequestedList(requests.length)
                })
                fetch(`http://localhost:5000/uploadRecord/receiver/${requests.id}`)
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
                    <div className={`dashboard_menu_button ${second}`} onClick={handleClickSecond}>Request Records</div>
                    <Link to="/requestRecord"><div className={`dashboard_menu_button newRequest`}>New Request</div></Link>
                </div>}
                {!role && <div className='dashboard_menu'>
                    <div className={`dashboard_menu_button ${first}`} onClick={handleClickFirst}>My Records</div>
                    <div className={`dashboard_menu_button ${second}`} onClick={handleClickSecond}>Requested List</div>
                </div>}
                {role && <div className='dashboard_tag'>
                    {first && acceptedList.map(request => 
                        <AcceptedList key= {request.id} _id = {request._id} idReceiver = {request.idReceiver} name = {request.fileName} setLengthOfAcceptedList = {setLengthOfAcceptedList}  status = {isViewRecord} setIsViewRecord = {setIsViewRecord}/>)}
                    {second && requestList.map(request => 
                        <RequestList key= {request.id} _id = {request._id} idReceiver = {request.idReceiver} status = {request.status}  setLengthOfRequestList = {setLengthOfRequestList}/>
                    )}
                </div>}
                {!role && <div className='dashboard_tag'>
                    {first && recordList.map(record => 
                        <RecordList key= {record.id} name = {record.fileName} id = {record.idSender}/>)}
                    {second && requestedList.map(request => 
                        <RequestedList key= {request.id} idSender = {request.idSender} idReceiver = {request.idReceiver} _id = {request._id} setLengthOfRequestList = {setLengthOfRequestList}/>
                    )}
                </div>}
            </div>

        </div>
    );
}
