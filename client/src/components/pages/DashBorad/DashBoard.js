import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css'

import Bar from '../bar/bar';
import AcceptedList from './Doctor/AcceptedList';
import RequestList from './Doctor/RequestList';
import RecordList from './Patient/RecordList';
import RequestedList from './Patient/RequestedList';

export default function DashBoard() {
    const role = true; //true: doctor
    const [first, setFirst] = useState(true)
    const [second, setSecond] = useState(false)
    const [recordList, setRecordList] = useState([])
    const [requestList,setRequestList] = useState([])

    useEffect(() => {
        if (role){
            fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(posts => {
                setRequestList(posts)
            })
            fetch('http://localhost:5000/uploadRecord/get')
            .then(res => res.json())
            .then(posts => {
                setRecordList(posts)
            })
        }
        else{
            fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(posts => {
                setRequestList(posts)
            })
            fetch('http://localhost:5000/uploadRecord/get')
            .then(res => res.json())
            .then(posts => {
                setRecordList(posts)
            })
        }
    }, [])  

    const handleFirst = () =>{
        setFirst(true)
        setSecond(false)    
    }

    const handleSecond = () =>{
        setFirst(false)
        setSecond(true)
    }

    return (
        <div>
            <Bar />
            <h3>DASHBOARD</h3>
            <div className='dashboard_content'>
                {role && <div className='dashboard_menu'>
                    <div className={`dashboard_menu_button ${first}`} onClick={handleFirst}>Accepted Records</div>
                    <div className={`dashboard_menu_button ${second}`} onClick={handleSecond}>Request Records</div>
                    <Link to="/requestRecord"><div className={`dashboard_menu_button newRequest`}>New Request</div></Link>
                </div>}
                {!role && <div className='dashboard_menu'>
                    <div className={`dashboard_menu_button ${first}`} onClick={handleFirst}>My Records</div>
                    <div className={`dashboard_menu_button ${second}`} onClick={handleSecond}>Requested Records</div>
                </div>}
                {role && <div className='dashboard_tag'>
                    {first && recordList.map(record => 
                        <AcceptedList idBN = {record._idBN} name = {record.name}/>)}
                    {second && requestList.map(record => 
                        <RequestList idBN = {record.title} name = {record.name}/>
                    )}
                </div>}
                {!role && <div className='dashboard_tag'>
                    {first && recordList.map(record => 
                        <RecordList idBN = {record._idBN} name = {record.name}/>)}
                    {second && requestList.map(record => 
                        <RequestedList idBN = {record.title} name = {record.name}/>
                    )}
                </div>}
            </div>
        </div>
    )
}
