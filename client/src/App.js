import React from 'react';
import './App.css';
import Layout from './components/layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UploadRecord from './components/pages/uploadRecord/uploadRecord';
import Login from './components/Account/login';
import Register from './components/Account/register';
import Home from './components/pages/home/home';

const App = () => (
  <div className='main'>
  <BrowserRouter>
    <Routes> 
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="upload" element={<UploadRecord/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
  </div>
  
);

export default App;
