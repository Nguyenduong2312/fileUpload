import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css';

import Bar from '../bar/bar';
import AcceptedList from './Doctor/AcceptedList';
import RequestList from './Doctor/RequestList';
import RecordList from './Patient/RecordList';
import RequestedList from './Patient/RequestedList';

export default function DashBoard() {
    const role = false; //true: doctor
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(false);
    const [recordList, setRecordList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [lengthOfRecordList, setLengthOfRecordList] = useState(0)
    const [lengthOfRequestList, setLengthOfRequestList] = useState(0)
    
    useEffect(() => {
        fetch('http://localhost:5000/requestRecord')
        .then(res => res.json())
        .then(requests => {
            setRequestList(requests)
            setLengthOfRequestList(requests.length)
        })
        fetch('http://localhost:5000/uploadRecord/get')
        .then(res => res.json())
        .then(records => {
            setRecordList(records)
            setLengthOfRecordList(records.length)
        })
}, [lengthOfRecordList,lengthOfRequestList])  

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
                        <AcceptedList key= {record.id} id = {record.idReceiver} name = {record.fileName}/>)}
                    {second && requestList.map(record => 
                        <RequestList key= {record.id} id = {record.idReceiver} status = {record.status}/>
                    )}
                </div>}
                {!role && <div className='dashboard_tag'>
                    {first && recordList.map(record => 
                        <RecordList key= {record.id} name = {record.fileName} id = {record.idSender} />)}
                    {second && requestList.map(record => 
                        <RequestedList key= {record.status} id = {record.idSender} _id = {record._id} setLengthOfRequestList = {setLengthOfRequestList}/>
                    )}
                </div>}
            </div>
        </div>
    );
}
