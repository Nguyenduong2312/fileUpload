import React from 'react';
import './AcceptedList.css';
import axios from 'axios';
import AcceptedRecordCpn from './AcceptedRecord';

export default function AcceptedList(props) {
    console.log(props.status);
    const handleViewRecords  = async (e) => {
        console.log('set');
        props.setIsViewRecord(true)
    }

    const handleRejectRequest  = async (e) => {
        e.preventDefault();
        try{
            await axios.delete(`/requestRecord/${props._id}`, {
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
                    <p>ID Patient: {props.idReceiver}</p>
                    <p>Date: </p>
                </div>
                <div className="dashboard_buttons">
                    <div className="button viewRecord" onClick={handleViewRecords}>
                        View Records
                    </div>
                    <div className="button delete" onClick={handleRejectRequest}>
                        Delete
                    </div>
                </div>
            </div>
            {props.status && <AcceptedRecordCpn _id = {props._id} idReceiver = {props.idReceiver} status = {props.status} setIsViewRecord = {props.setIsViewRecord}></AcceptedRecordCpn>}

        </div>
    );
}
