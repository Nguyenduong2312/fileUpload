import React from 'react'
const onButtonClick = () =>{

}
export default function RequestedList(props) {
  return (
    <div className="record_tag">
        <div className='text' style={{display:'block'}}>
            <p>Patient id: <span>{props.idBN}</span></p>
            <p>Request date :{props.name}</p>
        </div>
        <div className='dashboard_buttons'>
            <div className="button green">Accept</div>
            <div className="button red" onClick={onButtonClick} style={{marginLeft: '30px'}}>Reject</div>
        </div>
    </div>
)
}   
  
