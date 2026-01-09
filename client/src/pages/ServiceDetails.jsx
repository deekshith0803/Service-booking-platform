import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import { useChat } from "../context/ChatContext"; // Import useChat
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"; // Import icon
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewSection from "../components/ReviewSection"; // Import ReviewSection

const Servicedetails = () => {
  const { id } = useParams();
  const { service, axios, date, setDate, time, setTime } = useAppContext();
  const { openChat, unreadCounts } = useChat(); // Use chat context
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [services, setServices] = useState(null);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const currency = import.meta.env.VITE_CURRENCY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/bookings/create", {
        service: id,
        date,
        time: "all-day",
        notes,
        address,
        phone
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

    // Fetch review stats
    const fetchReviewStats = async () => {
      try {
        const { data } = await axios.get(`/api/reviews/${id}`);
        if (data.success && data.reviews.length > 0) {
          const total = data.reviews.reduce((acc, curr) => acc + curr.rating, 0);
          const avg = total / data.reviews.length;
          setReviewStats({
            averageRating: avg,
            totalReviews: data.reviews.length
          });
        }
      } catch (error) {
        console.error("Failed to fetch reviews for stats");
      }
    };
    if (id) fetchReviewStats();

    // Default selection
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }

  }, [service, id, date]);

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
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 text-lg">{services.category}</p>
                {/* Rating Stars */}
                {reviewStats.totalReviews > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(reviewStats.averageRating) ? "text-yellow-500" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      ({reviewStats.totalReviews} reviews)
                    </span>
                  </div>
                )}
              </div>
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
          className="shadow-xl border border-gray-100 h-max sticky top-24 rounded-2xl p-6 bg-white"
        >
          <div className="flex flex-col gap-1 mb-6">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Fixed Price for Work</p>
            <p className="flex items-baseline gap-1 text-3xl text-gray-900 font-bold">
              {currency}{services.price}
            </p>
          </div>

          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                <span>Select Date</span>
                <span className="text-xs text-primary font-medium">Next 7 days</span>
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                {[...Array(7)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const fullDate = d.toISOString().split('T')[0];
                  const dayName = d.toLocaleString('en-US', { weekday: 'short' });
                  const dateNum = d.getDate();
                  const isSelected = date === fullDate;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDate(fullDate)}
                      className={`flex flex-col items-center justify-center min-w-[66px] h-[80px] rounded-xl border-2 transition-all cursor-pointer ${isSelected
                        ? "bg-primary border-primary text-white shadow-lg scale-105"
                        : "bg-white border-gray-100 text-gray-500 hover:border-primary/30 hover:bg-primary/5"
                        }`}
                    >
                      <span className={`text-[11px] font-bold uppercase tracking-tight ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                        {dayName}
                      </span>
                      <span className="text-2xl font-bold mt-0.5">{dateNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Phone Number</p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-600"
                  required
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Service Address</p>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Street, Landmark"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-600"
                  required
                />
              </div>
            </div>

            {/* Work Description */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Work Description</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your requirements (e.g., room size, specific tasks, etc.)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[120px] resize-none text-sm text-gray-600 placeholder:text-gray-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dull py-4 font-bold text-white rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer mt-2"
            >
              Confirm Booking
            </motion.button>

            <button
              type="button"
              onClick={() => openChat({ _id: services.provider._id, name: services.provider.name, image: services.provider.image || assets.user_profile, role: "provider" })}
              className="w-full flex items-center justify-center gap-2 border border-primary text-primary py-3 font-medium rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="relative">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                {services.provider?._id && unreadCounts[services.provider._id] > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {unreadCounts[services.provider._id]}
                  </span>
                )}
              </div>
              Chat with Provider
            </button>



            <p className="text-sm text-center">
              No credit card required to book
            </p>
          </div>
        </motion.form>
      </div>

      {/* Reviews Section */}
      <ReviewSection serviceId={id} />

    </motion.div>
  );
};

export default Servicedetails;
