import React from 'react'
import './UserBranch.css'
import { Link } from 'react-router-dom';

import Bar from '../../../bar/bar';
import ParentTag from './ParentTag';

export default function UserBranch() {
    const handleBack = () =>{

    }
    return (
        <div>
            <Bar></Bar>
            <div className='UserBranch'>
                <div className='userTags'>
                    <ParentTag></ParentTag>
                    <ParentTag></ParentTag>
                </div>
                <div className='branch_buttons'>
                    <Link className="button" to="/childBranch">
                        Child branch
                    </Link>
                </div>
                <div className="Back button" onClick={handleBack}>
                    Back
                </div>
            </div>
        </div>
    )
}
