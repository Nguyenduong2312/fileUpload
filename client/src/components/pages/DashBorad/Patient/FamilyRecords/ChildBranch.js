import React from 'react'
import './UserBranch.css'
import { Link } from 'react-router-dom';

import Bar from '../../../bar/bar';
import ChildTag from './ChildTag';

export default function UserBranch() {
    const handleBack = () =>{

    }
    return (
        <div>
            <Bar></Bar>
            <div className='UserBranch'>
                <div className='userTags'>
                    <ChildTag></ChildTag>
                    <ChildTag></ChildTag>
                    <ChildTag></ChildTag>
                    <ChildTag></ChildTag>
                </div>
                <div className='branch_buttons'>
                    <Link className="button" to="/parentBranch">
                        Parent branch
                    </Link>
                </div>
                <div className="Back button" onClick={handleBack}>
                    Back
                </div>
            </div>
        </div>

    )
}
