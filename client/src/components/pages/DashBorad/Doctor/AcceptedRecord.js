import React, { useEffect, useState } from 'react';
import RecordList from '../Patient/RecordList';
import './AcceptedRecord.css';
export default function AcceptedRecord(props) {
    const [recordList, setRecordList] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:5000/acceptedRequest/${props._id}`)
            .then((res) => res.json())
            .then((records) => {
                setRecordList(records.listRecord);
            });
    }, []);

    const handleBack = () => {
        props.setIsViewRecord(false);
    };
    return (
        <div className="AcceptedRecord_tag">
            <div className="inforPatient">
                <h5>ID Patient: {props.idReceiver}</h5>
                <h5>Date: </h5>
            </div>

            <div className="recordList">
                {recordList.map((record) => (
                    <RecordList
                        key={record.id}
                        name={record.fileName}
                        id={record.idSender}
                    />
                ))}
            </div>

            <div className="button back" onClick={handleBack}>
                Back
            </div>
        </div>
    );
}
