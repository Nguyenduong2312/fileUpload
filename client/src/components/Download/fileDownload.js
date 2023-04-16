import React, { Fragment, useState } from 'react';
const Dload = () => {
  
    const onButtonClick = () => {
        fetch('').then(response => {
            response.blob().then(blob => {
               const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = 'SamplePDF.pdf';
                alink.click();
            })
        })
    }
    return (
        <>
            <center>
                <h1>Download</h1>
                <h3>Click on below button to download PDF file</h3>
                <button onClick={onButtonClick}>
                    Download
                </button>
            </center>
        </>
    );
};
  
export default Dload;
