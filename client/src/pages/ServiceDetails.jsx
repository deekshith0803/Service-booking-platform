import React, { useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
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
  const { service, axios, date, setDate, time, setTime, token, setShowLogin } = useAppContext();
  const { openChat, unreadCounts } = useChat(); // Use chat context
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [services, setServices] = useState(null);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [availability, setAvailability] = useState([]); // [{date: string, isAvailable: boolean}]
  const currency = import.meta.env.VITE_CURRENCY;

  // Initialize Razorpay
  const { Razorpay } = useRazorpay();


  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("online");

  const handlePayment = async () => {
    try {
      if (!token) {
        toast.error("Please login to book a service");
        setShowLogin(true);
        return;
      }
      if (!services?._id) return;

      if (paymentMethod === "cod") {
        const { data } = await axios.post("/api/bookings/create", {
          service: id,
          date,
          time: "all-day",
          notes,
          address,
          phone,
          paymentMethod: "cod"
        });

        if (data.success) {
          toast.success("Booking confirmed! Pay on arrival.");
          navigate("/my-bookings");
        } else {
          toast.error(data.message || "Booking failed");
        }
        return;
      }

      // Online Payment Flow
      // 1. Create Order
      const { data: orderData } = await axios.post("/api/payment/create-order", {
        serviceId: services._id
      });

      if (!orderData.success) {
        toast.error("Failed to create payment order");
        return;
      }

      const { order } = orderData;

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Fixora",
        description: `Booking for ${services.title}`,
        image: assets.logo, // Assuming you have a logo asset
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify & Create Booking
            const { data } = await axios.post("/api/bookings/create", {
              service: id,
              date,
              time: "all-day", // Adjust if you have time selection
              notes,
              address,
              phone,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              paymentMethod: "online"
            });

            if (data.success) {
              toast.success("Booking confirmed!");
              navigate("/my-bookings");
            } else {
              toast.error(data.message || "Booking failed");
            }
          } catch (err) {
            console.error("Booking creation failed", err);
            toast.error("Payment successful but booking failed. Please contact support.");
          }
        },
        prefill: {
          name: "User Name", // You can get this from context if available
          email: "user@example.com",
          contact: phone
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp1.open();

    } catch (error) {
      console.error("Payment initiation failed", error);
      toast.error("Failed to initiate payment");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      toast.error("Please fill address and phone number");
      return;
    }
    handlePayment();
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

    // Fetch availability for next 7 days
    const fetchAvailability = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await axios.get(`/api/bookings/service-availability-range/${id}?startDate=${today}&days=7`);
        if (data.success) {
          setAvailability(data.availability);
        }
      } catch (error) {
        console.error("Failed to fetch availability range");
      }
    };
    if (id) fetchAvailability();

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
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer hover:text-primary transition-colors"
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
            className="w-full aspect-[3/2] object-cover rounded-xl mb-6 shadow-md"
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
                  className="flex flex-col items-center bg-gray-50 p-4 rounded-xl transition-colors duration-300"
                >
                  <img src={item.icon} alt="" className="mb-2 h-5" />
                  <p className="text-gray-600 text-sm font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            <div>
              <h1 className="text-xl font-bold mb-3">Description</h1>
              <p className="text-gray-500 leading-relaxed">{services.description}</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Booking Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="shadow-2xl border border-gray-100 h-max sticky top-24 rounded-3xl p-8 bg-white transition-all duration-300"
        >
          <div className="flex flex-col gap-1 mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fixed Price for Work</p>
            <p className="flex items-baseline gap-1 text-4xl text-gray-900 font-black">
              {currency}{services.price}
            </p>
          </div>

          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-4 flex items-center justify-between transition-colors">
                <span>Select Date</span>
                <span className="text-xs text-primary font-bold">Next 7 days</span>
              </p>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                {[...Array(7)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const fullDate = d.toISOString().split('T')[0];
                  const dayName = d.toLocaleString('en-US', { weekday: 'short' });
                  const dateNum = d.getDate();
                  const isSelected = date === fullDate;
                  const dayAvailability = availability.find(a => a.date === fullDate);
                  const isAvailable = dayAvailability ? dayAvailability.isAvailable : true;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setDate(fullDate)}
                      className={`flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-2xl border-2 transition-all duration-300 ${!isAvailable
                        ? "bg-gray-50 border-gray-100 text-gray-300 opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-105 cursor-pointer"
                          : "bg-white border-gray-100 text-gray-500 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                        }`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-widest ${!isAvailable ? "text-gray-300" : isSelected ? "text-white" : "text-gray-400"}`}>
                        {dayName}
                      </span>
                      <span className="text-2xl font-black mt-1">{dateNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +91 9876543210"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-600 placeholder:text-gray-300"
                  required
                />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Service Address</p>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Street, Landmark"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-600 placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            {/* Work Description */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Work Description</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your requirements (e.g., room size, specific tasks, etc.)"
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[140px] resize-none text-sm text-gray-600 placeholder:text-gray-300 leading-relaxed"
              />
            </div>

            <div className="mt-4 mb-6">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Payment Method</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${paymentMethod === "online"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                    }`}
                >
                  Pay Online
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${paymentMethod === "cod"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                    }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dull py-4.5 font-bold text-white rounded-2xl shadow-xl shadow-primary/30 transition-all cursor-pointer mt-4"
            >
              {paymentMethod === "cod" ? "Confirm Booking (COD)" : "Pay & Confirm Booking"}
            </motion.button>

            <button
              type="button"
              onClick={() => openChat({ _id: services.provider._id, name: services.provider.name, image: services.provider.image || assets.user_profile, role: "provider" })}
              className="w-full flex items-center justify-center gap-3 border-2 border-primary/20 text-primary py-4 font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 group"
            >
              <div className="relative">
                <ChatBubbleLeftRightIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {services.provider?._id && unreadCounts[services.provider._id] > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
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
