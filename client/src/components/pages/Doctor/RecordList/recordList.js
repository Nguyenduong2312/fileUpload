import React, { useEffect, useState } from 'react';

import './recordList.css';
import Bar from '../../bar/bar';
export default function RecordList() {
    const [recordList, setRecordList] = useState([])

    useEffect(() => {
        const fetchData = async () =>{
            const result = await fetch('http://localhost:5000/uploadRecord/get')
            result.json().then(function(rc){
                setRecordList(rc)
            })
        }
        fetchData()
    }, [])

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
                <h4>Accepted List</h4>
                {recordList.map(record => 
                    <div className="record_tag">
                        <div className='text' style={{display:'block'}}>
                            <p>Patient: <span>{record._idBN}</span></p>
                            <p>{record.name}</p>
                        </div>
                        <div className="button" onClick={onButtonClick}>
                            {' '}
                            Download
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
