import React, { useEffect, useState } from 'react'
import RecordList from '../Patient/RecordList';
import './AcceptedRecord.css'
export default function AcceptedRecord(props) {
    const [recordList, setRecordList] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:5000/acceptedRequest/${props._id}`)
        .then(res => res.json())
        .then(records => {
            console.log(records);
            setRecordList(records.listRecord);
            console.log('rc',recordList);
            //setRecordList(records)
        })
    },[])

    const handleBack = () => {
        props.setIsViewRecord(false)
    }
    return (
        <div className="AcceptedRecord_tag">
            <div className='inforPatient'>
                <p>ID Patient: {props.idReceiver}</p>
                <p>Date: {props._id}</p>
            </div>  
            <div className='recordList'>
                {recordList.map(record => 
                    <RecordList key= {record.id} name = {record.fileName} id = {record.idSender} />)}
            </div>
            <div className="button" onClick={handleBack}>
                Back
            </div>

        </div>
    )
}
