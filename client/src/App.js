import React from 'react';
import './App.css';
import Layout from './components/layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UploadRecord from './components/pages/Doctor/Upload/uploadRecord';
import Login from './components/Account/login';
import Register from './components/Account/register';
import Home from './components/pages/home/home';
import RequestRecord from './components/pages/Doctor/RequestRecord/requestRecord';
import RecordList from './components/pages/Doctor/RecordList/recordList';
import Profile from './components/pages/profile/profile';

const App = () => (
  <div className='main'>
  <BrowserRouter>
    <Routes> 
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />

        <Route path="upload" element={<UploadRecord/>}/>
        <Route path="request" element={<RequestRecord/>}/>
        <Route path="accepted_list" element={<RecordList/>}/>

        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="myProfile" element={<Profile/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
  </div>
  
);

export default App;
