import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Servicedetails from './pages/Servicedetails';
import Service from './pages/Service';
import MyBooking from './pages/MyBooking';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const isProvider = useLocation().pathname.startsWith('/provider');

  return (
    <>
      {!isProvider && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/service-detais/:id' element={<Servicedetails />} />
        <Route path='/service' element={<Service />} />
        <Route path='/my-bookings' element={<MyBooking />} />
      </Routes>
    </>
  )
}

export default App;
