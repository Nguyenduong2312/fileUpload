import React, { Fragment, useState } from 'react';
import Message from '../Message';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

    try {
      await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      
      setMessage(`File "${filename}" Uploaded`);
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
            <h4 className="display-4 text-center mb-4">File Upload</h4>

            <Fragment>
                {message ? <Message msg={message} /> : null}
                <form onSubmit={onSubmit}>
                    <div className="custom-file mb-3">
                        <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            onChange={onChange}
                        />
                        <label
                            className="custom-file-label"
                            htmlFor="customFile"
                        >
                            {filename}
                        </label>
                    </div>
                    <input
                        type="submit"
                        value="Upload"
                        className="btn btn-primary btn-block mt-4"
                    />
                </form>
            </Fragment>
        </div>
    );
};

export default FileUpload;
