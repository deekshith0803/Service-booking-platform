import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Servicedetails from "./pages/ServiceDetails";
import Service from "./pages/Service";
import MyBooking from "./pages/MyBooking";
import Footer from "./components/Footer";
import Layout from "./pages/provider/Layout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ManageBookings from "./pages/provider/ManageBookings";
import ManageService from "./pages/provider/ManageService";
import AddService from "./pages/provider/AddService";
import ProviderMessages from "./pages/provider/ProviderMessages";
import Login from "./components/Login";
import ServiceCategory from "./pages/ServiceCategory";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

import { ChatProvider } from "./context/ChatContext";
import ChatPopup from "./components/Chat/ChatPopup";

const App = () => {

  const { showLogin } = useAppContext();

  const isProvider = useLocation().pathname.startsWith("/provider");

  return (
    <ChatProvider>
      <Toaster position="top-center" />

      {showLogin && <Login />}
      {!isProvider && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />} />
        <Route path="/service/:category" element={<ServiceCategory />} />
        <Route path="/service-details/:id" element={<Servicedetails />} />
        <Route path="/my-bookings" element={<MyBooking />} />

        <Route path="/provider" element={<Layout />}>
          <Route index element={<ProviderDashboard />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="manage-service" element={<ManageService />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="messages" element={<ProviderMessages />} />
        </Route>
      </Routes>

      {!isProvider && <Footer />}
      {!isProvider && <ChatPopup />}
    </ChatProvider>
  );
};

export default App;
