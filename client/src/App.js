import React from 'react';
import './App.css';
import Layout from './components/layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import FileUpload from './components/Upload/fileUpload';
import Login from './components/Account/login';
import Register from './components/Account/register';


const App = () => (
  <div className='main'>
  <BrowserRouter>
    <Routes> 
      <Route path="/" element={<Layout/>}>
        <Route index element={<FileUpload/>} />
        <Route path="upload" element={<FileUpload/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
  </div>
  
);

export default App;
