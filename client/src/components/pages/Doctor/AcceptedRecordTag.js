import React from 'react';
import './AcceptedRecordTag.css';
import axios from 'axios';
import { downloadFile } from '../../../custom_modules/Ipfs';
import { getTxRecord } from '../../../custom_modules/contractModules';

export default function AcceptedRecordTag(props) {
    const handleDownload = (id, filename) => {
        fetch(`http://localhost:5000/record/detail/${id}`)
            .then((res) => res.json())
            .then((res) => getTxRecord(res.idOnChain))
            .then((txRecord) =>
                downloadFile(
                    txRecord.cid,
                    txRecord.fileName,
                    txRecord.encryptedKey,
                    localStorage.getItem('privateKey'),
                ),
            );
    };

    const handleRejectRequest = async (e) => {
        e.preventDefault();
        try {
            await axios
                .delete(`/record/${props.record._id}`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(() => props.setLength((prev) => prev - 1));
        } catch (err) {
            if (err.response.status === 500) {
                props.setMessage('There was a problem with the server');
            } else {
                props.setMessage(err.response.data.msg);
            }
        }
    };

    return (
        <div>
            <div className="record_tag">
                <div className="text" style={{ display: 'block' }}>
                    <p>Sender id: {props.record.idSender}</p>
                    <p>Name: {props.record.fileName}</p>
                </div>
                <div className="dashboard_buttons">
                    <div
                        className="button download"
                        onClick={() =>
                            handleDownload(
                                props.record._id,
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
