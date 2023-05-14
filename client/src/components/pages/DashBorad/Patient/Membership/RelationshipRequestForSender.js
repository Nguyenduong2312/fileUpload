import React, {useEffect, useState}from 'react'

import Bar from '../../../bar/bar';
import RelationshipRequestTag from './RelationshipRequestTagForSender';

import './RelationshipRequestTag.css'


export default function RelationshipRequest() {
    const [Requests,setRequests] = useState([])
    useEffect(() => {
        fetch('http://localhost:5000/login/user',{
            credentials: 'include',
            method: 'GET',
        })
        .then(res => res.json())
        .then(account => {
            fetch(`http://localhost:5000/membership/sender/${account.id}`,{
                credentials: 'include',
                method: 'GET',
            })
            .then(res => res.json())
            .then(requests => {
                setRequests(requests)
            });
        });

    },[])

    return (
        <div className = "requestsTags">
            <Bar></Bar>
            <h4 style={{marginLeft:'60px', marginTop:'30px'}}>RELATIONSHIP MEMBER</h4>
            <div className = "requests">
                {Requests.map(request => 
                <RelationshipRequestTag id = {request.receiverId} name = {request.receiverName} role = {request.receiverRole}></RelationshipRequestTag>
            )}
            </div>
        </div>
    )
}
