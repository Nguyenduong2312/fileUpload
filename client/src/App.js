import React from 'react';
import './App.css';
import Layout from './components/layout';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FileUpload from './components/Upload/fileUpload';

const App = () => (
  <div className='main'>
  <BrowserRouter>
    <Routes> 
      <Route path="/" element={<Layout/>}>
        <Route index element={<FileUpload/>} />
        <Route path="upload" element={<FileUpload/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
  </div>
  
);

export default App;