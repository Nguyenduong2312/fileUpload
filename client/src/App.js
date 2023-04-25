import React from 'react';
import './App.css';
import Layout from './components/layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UploadRecord from './components/pages/Upload/uploadRecord';
import Login from './components/Account/login';
import Register from './components/Account/register';
import Home from './components/pages/home/home';
import Profile from './components/pages/profile/profile';
import DashBoard from './components/pages/DashBorad/DashBoard';
import RequestRecord from './components/pages/DashBorad/Doctor/RequestRecord';

const App = () => (
    <div className="main">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="Dashboard" element={<DashBoard />} />
                    <Route path="uploadRecord" element={<UploadRecord />} />
                    <Route path="requestRecord" element={<RequestRecord />} />
                    
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="myProfile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
);

export default App;
