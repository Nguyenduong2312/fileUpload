import React from 'react';
import './AcceptedRecordTag.css';
import axios from 'axios';

export default function AcceptedRecordTag(props) {
    //console.log('props', props.record);
    const handleDownload = (id, filename) => {
        fetch(`http://localhost:5000/record/download/${id}`).then(
            (response) => {
                response.blob().then((blob) => {
                    console.log(id);
                    const fileURL = window.URL.createObjectURL(blob);
                    let alink = document.createElement('a');
                    alink.href = fileURL;
                    alink.download = filename;
                    alink.click();
                });
            },
        );
    };

    const handleRejectRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/requestRecord/${props.record._id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLengthOfAcceptedList((prev) => prev - 1);
        } catch (err) {
            console.log('lỗi');
        }
    };

    return (
        <div>
            <div className="record_tag">
                <div className="text" style={{ display: 'block' }}>
                    <p>Patient id: {props.record.idReceiver}</p>
                    <p>Name: {props.record.fileName}</p>
                </div>
                <div className="dashboard_buttons">
                    <div
                        className="button download"
                        onClick={() =>
                            handleDownload(
                                props.record.idOnChain,
                                props.record.fileName,
                            )
                        }
                    >
                        Download
                    </div>
                    <div
                        className="button delete"
                        onClick={handleRejectRequest}
                    >
                        Delete
                    </div>
                </div>
            </div>
        </div>
    );
}
