import React, { useState } from 'react'

import './recordList.css'
import Bar from '../../bar/bar'
export default function RecordList() {

    const [patient_id, ,setPatient_id] = useState('123')
    return (
        <div>
            <Bar/>
            <div className='main_tag'>
            <h4>Accepted Lits</h4>
            <div className='record_tag'>
                <p>Patient: <span>{`${patient_id}`}</span></p>
                <div className='button'> Download</div>
            </div>
            </div>
        </div>
    )
}
