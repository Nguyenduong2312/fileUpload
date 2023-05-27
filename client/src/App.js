import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Layout from './components/layout';
import UploadRecord from './components/pages/Doctor/uploadRecord';
import Login from './components/Account/login';
import Register from './components/Account/register';
import Home from './components/pages/home/home';
import Profile from './components/pages/profile/profile';
import DashBoard from './components/pages/DashBoard/DashBoard';

import SearchUser from './components/pages/Doctor/UserInfor/SearchUser';
import UserDetail from './components/pages/Doctor/UserInfor/UserDetail';
import UserRecords from './components/pages/Doctor/UserInfor/UserRecords';


import FamilyMember from './components/pages/Patient/Membership/FamilyMember';
import RelationshipRequestTagForSender from './components/pages/Patient/Membership/RelationshipRequestForSender';
import RelationshipRequestTagForReceiver from './components/pages/Patient/Membership/RelationshipRequestForReceiver';

const App = () => (
    <div className="main">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="Dashboard" element={<DashBoard />} />
                    <Route path="uploadRecord" element={<UploadRecord />} />
                    <Route path="searchUser" element={<SearchUser />} />
                    <Route path="userDetail/:id" element={<UserDetail />} />
                    <Route path="records/:id" element={<UserRecords />} />

                    
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="myProfile" element={<Profile />} />

                    <Route path="mybranch" element={<FamilyMember />} />
                    <Route path="membership/:id" element={<FamilyMember />} />
                    <Route path="relationshipRequestForSender" element={<RelationshipRequestTagForSender />} />
                    <Route path="relationshipRequestForReceiver" element={<RelationshipRequestTagForReceiver />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
);

export default App;
