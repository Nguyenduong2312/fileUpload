import React, {useState,useEffect} from 'react'
import axios from 'axios';

import Message from '../../../../Message';
import Bar from '../../../bar/bar';
import UserTag from './UserTag';

import './FamilyMember.css'

export default function FamilyMember() {
    const [formData,setFormData] = useState({})
    const [childList, setChildList] = useState([])
    const [parentList, setParentList] = useState([])
    const [message, setMessage] = useState('');
    useEffect(() => {
        fetch('http://localhost:5000/login/user',{
            credentials: 'include',
            method: 'GET',
        })
        .then(res => res.json())
        .then((account) => {
            const accRelationship = account.relationship;
            console.log('accRelationship: ',accRelationship);
            
            for (let key in accRelationship){
                fetch(`http://localhost:5000/login/${key}`,{
                    credentials: 'include',
                    method: 'GET',
                })
                .then(res => res.json())
                .then((user) => {
                    var tmp = user;
                    tmp.roleRelationShip = accRelationship[key]
                    if(accRelationship[key] !== 'Child'){
                        setParentList(oldArray => [...oldArray,tmp])
                    }
                    else{
                        setChildList(oldArray => [...oldArray,tmp])
                    }
                })
            }
            
        })
    }, [])  

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(`/membership`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(res.data);
        } catch(err){
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };    


    const handleBack = () =>{

    }



    return (
        <div>
            <Bar></Bar>
            <div style={{width: '60%', margin: 'auto'}}>{message ? <Message msg={message}  /> : null}</div>
            <form className='addMember' onSubmit={onSubmit}>

                <div className='line_input'> 
                    <div className="inputField">
                        <label>ID: </label>
                        <input
                            type="text"
                            name='receiverId'
                            //value={fullName}
                            onChange={onChange}
                        />
                    </div>
                    <div className="inputField">
                        <label>Role: </label>
                        <select 
                            name='receiverRole'
                            defaultValue="Select"
                            onChange={onChange}>
                            <option>Select...</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Child">Child</option>
                            <option value="Other">Other</option>
                        </select>
                    </div> 
                </div>
                <input className="button" type="submit" value={'Add'} />
            </form>

            <div className='listMember'>
                <p style= {{fontSize: '25px', fontWeight:'700'}}>PARENTS: </p>
                <div className='memberTags parents'>
                    {parentList.map(user =>
                        <UserTag id = {user.id} role = {user.roleRelationShip}></UserTag>
                    )}
                </div>

                <p style= {{fontSize: '25px', fontWeight:'700', marginTop: '50px'}}>CHILDRENT: </p>
                <div className='memberTags children'>
                    {childList.map(user =>
                        <UserTag id = {user.id} role = {user.roleRelationShip}></UserTag>
                    )}
                </div>

                <div className="Back button" onClick={handleBack}>
                    Back
                </div>
            </div>
        </div>
    )
}
