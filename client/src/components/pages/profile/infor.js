import React from 'react'
export default function Infor(props) {
  return (
    <div>
        <p>Username:{props.username}</p>
        <p>Full name:{props.name}</p>
        <p>Age:{props.age}</p>
        <p>Gender:{props.gender}</p>
    </div>
  )
}
