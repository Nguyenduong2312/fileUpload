import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'


export default function RequestedTag(props) {
    const formData = {
        'idSender': props.request.idSender,
    }
    const handleAcceptRequest = async (e) => {
        e.preventDefault();
        //cập nhật status cho api waitting -> accepted
        try{
            await axios.put(`/requestRecord/${props.request._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLengthOfRequestList((prev) => prev -1)
        } catch(err){
            console.log('lỗi');
        }        
    }

    const handleRejectRequest  = async (e) => {
        e.preventDefault();
        //xóa api ra khỏi requested list
        try{
            await axios.delete(`/requestRecord/${props._id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.setLengthOfRequestList((prev) => prev - 1)

        } catch(err){
            console.log('lỗi');
        }
    }

    return (
        <div className="record_tag">
            <div className='text' style={{display:'block'}}>
                <p>Id Sender: {props.request.idSender} <Link to= {`/userDetail/${props.request.idSender}`} style={{textDecorationLine: 'none'}}>[Xem thông tin]</Link></p>
                <p>File name: {props.request.nameRecord}</p>
            </div>
            <div className='dashboard_buttons'>
                <div className="button" style = {{'backgroundColor': '#54B435'}} onClick={handleAcceptRequest}>Accept</div>
                <div className="button delete" onClick={handleRejectRequest} style={{marginLeft: '30px'}}>Reject</div>
            </div>
        </div>
    )
}   
  
