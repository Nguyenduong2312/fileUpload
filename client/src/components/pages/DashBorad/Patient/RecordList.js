import React from 'react';

export default function RecordList(props) {
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
        <div className="record_tag">
            <div className="text" style={{ display: 'block' }}>
                <p>File: {props.name}</p>
                <p>ID Sender: {props.id}</p>
            </div>
            <div className="dashboard_buttons">
                <div className="button" onClick={onButtonClick}>
                    Download
                </div>
            </div>
        </div>
    );
}
