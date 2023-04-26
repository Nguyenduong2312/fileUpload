import React from 'react';
export default function Infor(props) {
    return (
        <div>
            <p>Full name: {props.name}</p>
            <p>Gender: {props.gender}</p>
            <p>Adress: {props.address}</p>
            <p>Email: {props.email}</p>
        </div>
    );
}
