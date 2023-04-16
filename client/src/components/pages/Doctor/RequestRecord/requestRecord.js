import React, { Fragment, useState } from 'react';
import Message from '../../../Message';
import axios from 'axios';

const RequestRecord = () => {
    const [message, setMessage] = useState('');
    const [id, setId] = useState('');
    const handleChange = (event) => {
    setId(event.target.value);
    };
    const formData = {id: id}

    const onSubmit = async (e) => {
    e.preventDefault();
    try {
    console.log('fe id:', formData);
    await axios.post('/request', formData   , {
        headers: {
        'Content-Type': 'multipart/form-data'
        },
    });
    
    } catch (err) {
        if (err.response.status === 500) {
        setMessage('There was a problem with the server');
        } else {
        setMessage(err.response.data.msg);
        }
    }
};

  return (
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">Request Record</h4>

      <Fragment>
        {message ? <Message msg={message} /> : null}
        <form onSubmit={onSubmit}>
          <div className="inputField id">
            <label>Patient id:<br></br>
            <input 
              type="text"
              id="id"
              name="id"
              onChange={handleChange}
            />
            </label>
          </div>
          <input
              type="submit"
              value="Send request"
              className="btn btn-warning btn-block mt-4"
          />
        </form>
      </Fragment>
    </div>
  );
};

export default RequestRecord;