import React from 'react';
import axios from 'axios';
import './RequestList.css';

export default function RequestList(props) {
    const handleRejectRequest  = async (e) => {
        e.preventDefault();
        try{
            await axios.delete(`/requestRecord/${props._id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLengthOfRequestList((prev) => prev - 1)

        } catch(err){
            console.log('lỗi');
        }

    }

    return (
        <div className="record_tag">
            <div className='text' style={{display:'block'}}>
                <p>ID Patient: <span>{props.idReceiver}</span></p>
                <p>Request date :</p>
            </div>
            <div className='dashboard_buttons'>
                <div className="button viewRecord">{props.status}</div>
                <div className="button delete" onClick={handleRejectRequest} style={{marginLeft: '30px'}}>Cancle</div>
            </div>
        </div>
    )
}   
  
