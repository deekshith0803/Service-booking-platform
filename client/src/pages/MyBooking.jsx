import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useChat } from "../context/ChatContext"; // Import useChat
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"; // Import icon

const MyBooking = () => {
  const { currency, axios, user } = useAppContext();
  const { openChat, unreadCounts } = useChat(); // Use chat context
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
        className="flex items-center gap-2 mb-6 text-gray-500 hover:text-primary transition-colors cursor-pointer group"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65 group-hover:opacity-100 transition-opacity" />
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
              gap-8 p-8 border border-borderColor rounded-3xl mt-5 first:mt-12 bg-white transition-all duration-300 shadow-lg hover:shadow-xl shadow-gray-100"
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
              <p className="font-bold text-lg">{booking.service.title}</p>
              <p className="text-gray-500 mt-1 uppercase tracking-wider text-xs font-semibold">
                {booking.service.category} · {booking.service.service_area} ·{" "}
                {booking.service.staffCount} staff
              </p>
            </div>

            {/* booking info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3">
                <p className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold transition-colors">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${booking.status === "confirmed"
                    ? "bg-green-400/10 text-green-600"
                    : "bg-red-400/10 text-red-600"
                    }`}
                >
                  Booking: {booking.status}
                </p>
                <p
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${booking.paymentStatus === "paid"
                    ? "bg-blue-400/10 text-blue-600"
                    : "bg-yellow-400/10 text-yellow-600"
                    }`}
                >
                  Payment: {booking.paymentStatus || 'pending'}
                </p>
              </div>

              <div className="flex items-start gap-3 mt-5">
                <img
                  src={assets.calendar_icon_colored}
                  alt="calendar"
                  className="w-5 h-5 mt-0.5"
                />
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Date</p>
                  <p className="font-medium mt-0.5">
                    {booking.date?.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-5">
                <img
                  src={assets.location_icon_colored}
                  alt="location"
                  className="w-5 h-5 mt-0.5"
                />
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Contact & Address</p>
                  <p className="font-bold mt-0.5">{booking.phone}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{booking.address}</p>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-5 p-4 bg-primary/5 rounded-2xl border border-primary/10 transition-colors">
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-2">Requirements</p>
                  <p className="text-gray-600 text-xs italic leading-relaxed font-medium">"{booking.notes}"</p>
                </div>
              )}

              {/* Chat Button */}
              <div className="mt-4">
                <button
                  onClick={() => openChat({ _id: booking.provider._id, name: booking.provider.name, image: booking.provider.image || assets.user_profile, role: "provider" })}
                  className="flex items-center gap-2 text-primary hover:text-primary-dull transition-colors"
                >
                  <div className="relative">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    {unreadCounts[booking.provider._id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                        {unreadCounts[booking.provider._id]}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Chat with Provider</span>
                </button>
              </div>
            </div>

            {/* price */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 md:text-right">
                <p className="text-xs font-bold uppercase tracking-widest mb-1">Total Price</p>
                <h1 className="text-3xl font-black text-primary">
                  {currency} {booking.price}
                </h1>
                <p className="mt-2 text-xs font-medium">Booked on {booking.createdAt?.split("T")[0]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MyBooking;
