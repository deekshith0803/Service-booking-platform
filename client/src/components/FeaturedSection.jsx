import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { service = [] } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      <Title
        title="Featured Services"
        subtitle="Discover the top-rated services from our trusted professionals."
        align="center"
      />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {service.slice(0, 3).map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}   // very subtle
          >
            <ServiceCard service={item} />
          </motion.div>
        ))}
      </div>


      <motion.button
        onClick={() => {
          navigate("/services");
          window.scrollTo(0, 0);
        }}
        whileHover={{ opacity: 0.85 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center gap-2 py-2 px-6 border border-borderColor rounded-full mt-18 cursor-pointer transition-all duration-300 hover:bg-gray-100 text-gray-700"
      >
        Explore all services
        <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;
