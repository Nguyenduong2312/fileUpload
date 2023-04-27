import React, { useEffect, useState } from 'react';
import Bar from '../bar/bar';
import Infor from './infor';
import './profile.css';
import UpdateInforForm from './UpdateInforForm';
export default function Profile() {
    const [isEdit, setStatus] = useState(true);
    const [infor, setInfor] = useState({
    })
    console.log(isEdit);
    useEffect(() => {
        console.log('get');
        fetch('http://localhost:5000/myProfile/1')
        .then(res => res.json())
        .then(account => {
            console.log('acc: ',account);
            setInfor(account)
        })
}, [isEdit])  

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
                    {isEdit && <Infor name = {infor.name} gender = {infor.gender} address = {infor.address} email = {infor.email} date = {infor.birthday}  ></Infor>}
                    {!isEdit && <UpdateInforForm setStatus={setStatus}></UpdateInforForm>}
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
