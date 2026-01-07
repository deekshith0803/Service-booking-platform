import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const MyBooking = () => {
  const { currency, axios, user } = useAppContext();
  const [booking, setBooking] = useState([]);
  const navigate = useNavigate();

  const fetchMyBooking = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBooking(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    user && fetchMyBooking();
  }, [user]);

  // motion variants
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-40 mt-10 text-sm"
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back
      </button>

      <Title
        title="My Bookings"
        subtitle="View and manage your bookings"
        align="left"
      />

      {/* Bookings */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {booking.map((booking, index) => (
          <motion.div
            key={booking._id}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* service image + info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking.service.image}
                  alt="service"
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="font-medium">{booking.service.title}</p>
              <p className="text-gray-500">
                {booking.service.category} · {booking.service.service_area} ·{" "}
                {booking.service.staffCount} staff
              </p>
            </div>

            {/* booking info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 rounded-full ${booking.status === "confirmed"
                    ? "bg-green-400/15 text-green-600"
                    : "bg-red-400/15 text-red-600"
                    }`}
                >
                  {booking.status}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  alt="calendar"
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Date</p>
                  <p>
                    {booking.date?.split("T")[0]} · {booking.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  alt="location"
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Location</p>
                  <p>{booking.service.service_area}</p>
                </div>
              </div>
            </div>

            {/* price */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 md:text-right">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency} {booking.price}
                </h1>
                <p>Booked on {booking.createdAt?.split("T")[0]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MyBooking;
