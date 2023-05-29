import React from 'react';
import './AcceptedRecordTag.css';
import axios from 'axios';

export default function AcceptedRecordTag (props) {
    
    const handleDownload  = async (e) => {
    }

    const handleRejectRequest  = async (e) => {
        e.preventDefault();
        try{
            await axios.delete(`/requestRecord/${props.record._id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLengthOfAcceptedList((prev) => prev - 1)

        } catch(err){
            console.log('lỗi');
        }

    }

    return (
        <div>
            <div className="record_tag">
                <div className='text' style={{display:'block'}}>
                    <p>Patient id: {props.record.idReceiver}</p>
                    <p>Name: {props.record.nameRecord}</p>
                </div>
                <div className="dashboard_buttons">
                    <div className="button download" onClick={handleDownload}>
                        Download
                    </div>
                    <div className="button delete" onClick={handleRejectRequest}>
                        Delete
                    </div>
                </div>
            </div>
        </div>
    );
}
