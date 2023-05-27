import React from 'react';

export default function RecordList(props) {
    const onButtonClick = (id, filename) => {
        fetch(`http://localhost:5000/uploadRecord/download/${id}`).then(
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

    return (
        <div className="record_tag">
            <div className="text" style={{ display: 'block' }}>
                <p>File: {props.name}</p>
                <p>ID Uploader: {props.id}</p>
            </div>
            <div className="dashboard_buttons">
                <div
                    className="button download"
                    onClick={() => onButtonClick(props.idOnChain, props.name)}
                >
                    Download
                </div>
            </div>
        </div>
    );
}
