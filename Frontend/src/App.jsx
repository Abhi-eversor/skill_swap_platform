import React from 'react'
import { Routes, Route } from 'react-router-dom';
import './index.css'
// import SendSwapRequest from './components/SendSwapRequest'
// import SwapRequestDashboard from './components/SwapRequestDashBorad'
// import Hompage from './pages/HomePage'
import HomePage from './pages/HomePage'
import Login from './components/Login'
import UserProfilePreview from './components/Profilepreview';
import SendSwapRequest from './components/SendSwapRequest';
import User from './components/User';
import UserProfile from './components/UserProfile'
import Register from './components/Register';
// import UserProfilePreview from './components/Profilepreview'

function App() {
  

  return (
    <>

    <Routes>
      <Route path='/'  element={<HomePage />}></Route>
      <Route path='/login'  element={<Login />}></Route>
      <Route path='/login/user' element={<UserProfilePreview />}></Route>
      <Route path="/login/userrequest"   element={<SendSwapRequest />}></Route>
      <Route path="/userprofile"    element={<UserProfile />}></Route>
      <Route path="/register"  element={<Register />}></Route>
      
    </Routes>
  
      {/* <HomePage />  */}
     {/* <Login /> */}
     {/* <UserProfile /> */}
     {/* <UserProfilePreview />  */}
      {/* <SendSwapRequest />  */}
     {/* <SwapRequestDashboard /> */}


    </>
  )
}

export default App
