import React, { useState } from 'react';

import './recordList.css';
import Bar from '../../bar/bar';
export default function RecordList() {
    const [patient_id, , setPatient_id] = useState('123');
    const onButtonClick = () => {
        fetch('').then((response) => {
            response.blob().then((blob) => {
                const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = 'SamplePDF.pdf';
                alink.click();
            });
        });
    };

    return (
        <div>
            <Bar />
            <div className="main_tag">
                <h4>Accepted Lits</h4>
                <div className="record_tag">
                    <p>
                        Patient: <span>{`${patient_id}`}</span>
                    </p>
                    <div className="button" onClick={onButtonClick}> Download</div>
                </div>
            </div>
        </div>
    );
}
