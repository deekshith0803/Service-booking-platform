import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import ServiceCard from "../components/ServiceCard";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const Service = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [input, setInput] = useState("");
  const { service } = useAppContext();

  // read ?search= from URL
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search") || "";

  useEffect(() => {
    if (searchQuery) setInput(searchQuery);
  }, [searchQuery]);

  const services = Array.isArray(service) ? service : [];
  const searchText = input.toLowerCase();

  const filteredServices = services.filter((service) => {
    if (!service?.title || !service?.category) return false;
    return (
      service.title.toLowerCase().includes(searchText) ||
      service.category.toLowerCase().includes(searchText)
    );
  });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div>
      {/* Back */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-500 hover:text-primary transition-colors cursor-pointer group"
        >
          <img
            src={assets.arrow_icon}
            alt="back"
            className="rotate-180 opacity-65 group-hover:opacity-100 transition-opacity"
          />
          Back
        </button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center py-24 bg-gray-50 max-md:px-4"
      >
        <Title
          title="Services"
          subtitle="Discover the top-rated services from our trusted professionals."
        />

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center bg-white px-6 mt-10 max-w-2xl w-full h-14 rounded-full shadow-xl border border-transparent transition-all"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 mr-3 opacity-60"
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search services..."
            className="w-full outline-none h-full bg-transparent text-gray-700 placeholder:text-gray-400 font-medium"
          />
          <img
            src={assets.filter_icon}
            alt="filter"
            className="w-5 h-5 ml-3 opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
          />
        </motion.div>
      </motion.div>

      {/* Results */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
        <p className="text-gray-500 xl:px-10 max-w-7xl mx-auto font-medium">
          Showing <span className="text-primary font-bold">{filteredServices.length}</span> {filteredServices.length === 1 ? 'service' : 'services'}
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-10 max-w-7xl mx-auto"
        >
          {filteredServices.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center">
              No services found
            </p>
          ) : (
            filteredServices.map((service) => (
              <motion.div key={service._id} variants={item}>
                <ServiceCard service={service} />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Service;
