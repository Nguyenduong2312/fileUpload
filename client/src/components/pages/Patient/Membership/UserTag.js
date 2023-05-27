import React from 'react'
import { Link } from 'react-router-dom';

import './UserTag.css'

export default function UserTag(props) {
    return (
        <div className='userTag'>
            <p>{props.role}</p>
            <div className='icon_user'>
                <img src="../image/user.png" alt=""/>
            </div>
            <div className='infor'>
                <p>Name:{props.name} </p>
                <p>Id: {props.id}</p>
            </div>
            <div className='listButton'>
                <div className='button viewFamilyMember' style={{marginTop: '20px'}}><Link to= {`/userDetail/${props.id}`} style={{textDecorationLine: 'none', color: 'white'}}> View Information </Link></div>
            </div>
        </div>
    )
}
