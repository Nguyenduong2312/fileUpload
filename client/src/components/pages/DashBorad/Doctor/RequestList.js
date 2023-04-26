import React from 'react';
import './RequestList.css';
const onButtonClick = () => {};
export default function RequestList(props) {
  return (
    <div className="record_tag">
        <div className='text' style={{display:'block'}}>
            <p>ID Patient: <span>{props.id}</span></p>
            <p>Request date :</p>
        </div>
        <div className='dashboard_buttons'>
            <div className="button green">{props.status}</div>
            <div className="button red" onClick={onButtonClick} style={{marginLeft: '30px'}}>Cancle</div>
        </div>
    </div>
)
}   
  
