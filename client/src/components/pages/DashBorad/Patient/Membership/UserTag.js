import React from 'react'
import './UserTag.css'

export default function UserTag(props) {
    return (
        <div className='userTag'>
            <p>{props.role}</p>
            <div className='icon_user'>
                <img src="image/user.png" alt=""/>
            </div>
            <div className='infor'>
                <p>Name:{props.name} </p>
                <p>Id: {props.id}</p>
            </div>
            <div className='listButton'>
                <div className='button viewRecord'>View records</div>
                <div className='button viewFamilyMember' style={{marginTop: '20px'}}>View family member</div>
            </div>
        </div>
    )
}
