import React from 'react';
import './RequestList.css';
const onButtonClick = () => {};
export default function RequestList(props) {
    return (
        <div className="record_tag">
            <div className="text" style={{ display: 'block' }}>
                <p>
                    Patient id: <span>{props.idBN}</span>
                </p>
                <p>Request date :{props.name}</p>
            </div>
            <div className="dashboard_buttons">
                <div className="button green">Watting...</div>
                <div
                    className="button red"
                    onClick={onButtonClick}
                    style={{ marginLeft: '30px' }}
                >
                    Cancle
                </div>
            </div>
        </div>
    );
}
