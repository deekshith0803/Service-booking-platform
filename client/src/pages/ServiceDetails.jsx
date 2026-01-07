import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Servicedetails = () => {
  const { id } = useParams();
  const { service, axios, date, setDate, time, setTime } = useAppContext();
  const navigate = useNavigate();
  const [services, setServices] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/bookings/create", {
        service: id,
        date,
        time,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message || "Failed to book the service");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  useEffect(() => {
    const foundService = service.find((s) => s._id === id);
    setServices(foundService);
  }, [service, id]);

  if (!services) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="lg:col-span-2"
        >
          <motion.img
            src={services.image}
            alt="service"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{services.title}</h1>
              <p className="text-gray-500 text-lg">{services.category}</p>
            </div>

            <hr className="border-borderColor my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: assets.users_icon, text: `${services.staffCount} Staff` },
                { icon: assets.location_icon, text: services.service_area },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={item.icon} alt="" className="mb-2 h-5" />
                  <p className="text-gray-600 text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{services.description}</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Booking Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="shadow-lg h-max sticky top-20 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}{services.price}
            <span className="text-base text-gray-500 font-medium">
              Price per hour
            </span>
          </p>

          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="date">Select your date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-borderColor rounded-lg px-3 py-2"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="time">Select your time</label>
            <select
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-borderColor rounded-lg px-3 py-2"
            >
              <option value="" disabled>
                Select a time
              </option>
              <option value="9-11">9:00 AM - 11:00 AM</option>
              <option value="11-1">11:00 AM - 1:00 PM</option>
              <option value="2-4">2:00 PM - 4:00 PM</option>
              <option value="4-6">4:00 PM - 6:00 PM</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="w-full bg-primary hover:bg-primary-dull py-3 font-medium text-white rounded-lg cursor-pointer"
          >
            Book Now
          </motion.button>

          <p className="text-sm text-center">
            No credit card required to book
          </p>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Servicedetails;
