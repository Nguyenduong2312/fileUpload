import { useState } from 'react';
import React from 'react';
import Bar from '../bar/bar';
import Infor from './infor';
import './profile.css';
import InforForm from './infor_form';
export default function Profile(props) {
    const [isEdit, setStatus] = useState(true);
    function ChangeTag() {
        if (isEdit) {
            return <Infor></Infor>;
        } else {
            return <InforForm setStatus={setStatus}></InforForm>;
        }
    }
    return (
        <div>
            <Bar></Bar>
            <div className="profile_tag">
                <div className="tag_img">
                    <div className="profile_img">
                        <img src="image/Sample_User_Icon.png" alt="" />
                    </div>
                </div>
                <div className="tag_info">
                    <ChangeTag />
                    <button
                        className={`button editProfile ${isEdit}`}
                        onClick={() => setStatus(false)}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
