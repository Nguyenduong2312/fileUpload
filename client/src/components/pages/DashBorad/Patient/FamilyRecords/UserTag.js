import React from 'react'
import './UserTag.css'

export default function UserTag() {
    return (
        <div className='userTag me'>
            <p>Me</p>
            <div className='icon_user'>
                <img src="image/user.png" alt=""/>
            </div>
            <div className='infor'>
                <p>Name: </p>
                <p>Id: </p>
            </div>
            <div className='listButton'>
                <div className='button yellow'>My records</div>
            </div>
        </div>
    )
}
