import React from 'react';
const onButtonClick = () => {};
export default function RequestedList(props) {
    const handleAcceptRequest = () =>{
        
    }

    const handleRejectRequest = () =>{
        
    }


    return (
        <div className="record_tag">
            <div className='text' style={{display:'block'}}>
                <p>Id Sender: {props.id}</p>
                <p>Request date :{props.name}</p>
            </div>
            <div className='dashboard_buttons'>
                <div className="button green" onClick={handleAcceptRequest}>Accept</div>
                <div className="button red" onClick={handleRejectRequest} style={{marginLeft: '30px'}}>Reject</div>
            </div>
        </div>
    )
}   
  
