import React, { useEffect, useState } from 'react';
import Bar from '../bar/bar';
import Infor from './infor';
import './profile.css';
import UpdateInforForm from './UpdateInforForm';
export default function Profile() {
    const [isEdit, setStatus] = useState(true);
    const [infor, setInfor] = useState({
    })
    useEffect(() => {
        fetch('http://localhost:5000/myProfile/1')
        .then(res => res.json())
        .then(account => {
            console.log('acc: ',account);
            setInfor(account)
        })
        console.log('infor');
        console.log(infor);
}, [])  


    function ChangeTag() {
        if (isEdit) {
            return <Infor name = {infor.name} gender = {infor.gender} address = {infor.address} email = {infor.email}  ></Infor>;
        } else {
            return <UpdateInforForm setStatus={setStatus}></UpdateInforForm>;
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
                    <ChangeTag/>
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
