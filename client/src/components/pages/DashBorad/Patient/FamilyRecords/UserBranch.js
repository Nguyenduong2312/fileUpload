import React from 'react'
import './UserBranch.css'
import { Link } from 'react-router-dom';

import Bar from '../../../bar/bar';
import UserTag from './UserTag';

export default function UserBranch() {
    return (
        <div>
            <Bar></Bar>
            <div className='UserBranch'>
                <UserTag></UserTag>
                <div className='branch_buttons'>
                    <Link className="button" to="/parentBranch">
                        Parent branch
                    </Link>
                    <Link className="button" to="/childBranch">
                        Child branch
                    </Link>
                </div>
            </div>
        </div>
    )
}
