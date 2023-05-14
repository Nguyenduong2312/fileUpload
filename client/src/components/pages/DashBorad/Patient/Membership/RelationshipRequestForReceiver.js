import React, {useEffect, useState}from 'react'

import Bar from '../../../bar/bar';
import RelationshipRequestTag from './RelationshipRequestTagForReceiver';

import './RelationshipRequestTag.css'


export default function RelationshipRequest() {
    const [Requests,setRequests] = useState([])
    const [lengthOfRequestList, setLengthOfRequestList] = useState(0)
    useEffect(() => {
        fetch('http://localhost:5000/login/user',{
            credentials: 'include',
            method: 'GET',
        })
        .then(res => res.json())
        .then(account => {
            console.log(account.id);
            fetch(`http://localhost:5000/membership/receiver/${account.id}`,{
                credentials: 'include',
                method: 'GET',
            })
            .then(res => res.json())
            .then(requests => {
                setRequests(requests)
                setLengthOfRequestList(requests.length)
            });
        });

    },[lengthOfRequestList])

    return (
        <div className = "requestsTag">
            <Bar></Bar>
            <h4 style={{marginLeft:'60px', marginTop:'30px'}}>RELATIONSHIP MEMBER</h4>
            <div className = "requests">
                {Requests.map(request => 
                <RelationshipRequestTag request = {request} name = {request.senderName} role = {request.senderRole} setLengthOfRequestList = {setLengthOfRequestList}></RelationshipRequestTag>
            )}
            </div>
        </div>
    )
}
