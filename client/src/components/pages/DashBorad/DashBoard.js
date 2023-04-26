import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css';

import Bar from '../bar/bar';
import AcceptedList from './Doctor/AcceptedList';
import RequestList from './Doctor/RequestList';
import RecordList from './Patient/RecordList';
import RequestedList from './Patient/RequestedList';

export default function DashBoard() {
    const role = true; //true: doctor
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(false);
    const [recordList, setRecordList] = useState([]);
    const [requestList, setRequestList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/requestRecord/')
        .then(res => res.json())
        .then(posts => {
            setRequestList(posts)
        })
        fetch('http://localhost:5000/uploadRecord/get')
        .then(res => res.json())
        .then(posts => {
            setRecordList(posts)
        })
}, [])  

    const handleClick = () =>{
        setFirst(!first)
        setSecond(!second)    
    }

    return (
        <div>
            <Bar />
            <h3>DASHBOARD</h3>
            <div className='dashboard_content'>
                {role && <div className='dashboard_menu'>
                    <div className={`dashboard_menu_button ${first}`} onClick={handleClick}>Accepted Records</div>
                    <div className={`dashboard_menu_button ${second}`} onClick={handleClick}>Request Records</div>
                    <Link to="/requestRecord"><div className={`dashboard_menu_button newRequest`}>New Request</div></Link>
                </div>}
                {!role && <div className='dashboard_menu'>
                    <div className={`dashboard_menu_button ${first}`} onClick={handleClick}>My Records</div>
                    <div className={`dashboard_menu_button ${second}`} onClick={handleClick}>Requested List</div>
                </div>}
                {role && <div className='dashboard_tag'>
                    {first && recordList.map(record => 
                        <AcceptedList id = {record.idReceiver} name = {record.fileName}/>)}
                    {second && requestList.map(record => 
                        <RequestList id = {record.idReceiver} status = {record.status}/>
                    )}
                </div>}
                {!role && <div className='dashboard_tag'>
                    {first && recordList.map(record => 
                        <RecordList name = {record.fileName} id = {record.idSender} />)}
                    {second && requestList.map(record => 
                        <RequestedList id = {record.idSender}/>
                    )}
                </div>}
            </div>
        </div>
    );
}
