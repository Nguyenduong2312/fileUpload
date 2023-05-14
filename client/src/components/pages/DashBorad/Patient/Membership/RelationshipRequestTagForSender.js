import React from 'react'
import './RelationshipRequestTag.css'
export default function RelationshipRequestTag(props) {
    const handleRejectRequest = () => {
        
    }

    return (
        <div className='requestTag'>
            <p>Receiver Id: {`${props.id}`}</p>
            <p>Name: {`${props.name}`}</p>
            <p>Relationship: {`${props.name}`} is your {`${props.role}`}</p>
            <div className='buttons'>
                <div className="button red" onClick={handleRejectRequest}>
                    Delete
                </div>
            </div>
        </div>
)
}
