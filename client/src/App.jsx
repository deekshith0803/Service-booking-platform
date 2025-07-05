import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const isProvider = useLocation().pathname.startsWith('/provider');
  return (
    <>
      { !isProvider && <Navbar setShowLogin={setShowLogin} />}
    </>
  )
}

export default App
