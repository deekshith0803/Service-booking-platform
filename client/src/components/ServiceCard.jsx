import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ServiceCard = ({ service }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => {
        navigate(`/service-details/${service._id}`);
        window.scrollTo(0, 0);
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group rounded-lg overflow-hidden shadow-lg cursor-pointer bg-white"
    >
      {/* Image */}
      <div className="relative h-50 overflow-hidden">
        <motion.img
          src={service.image}
          alt="service"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {service.availability && (
          <motion.p
            initial={{ opacity: 0.85 }}
            whileHover={{ opacity: 1 }}
            className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full"
          >
            Available now
          </motion.p>
        )}

        <motion.div
          className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm
            text-white px-3 py-2 rounded-full"
          initial={{ opacity: 0.9 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="font-semibold">
            {currency}
            {service.price}
          </span>
          <span className="text-sm text-white/80"> / Hour</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-muted-foreground text-sm">
          {service.category}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.users_icon} alt="" className="h-4 mr-2" />
            <span>{service.staffCount} Staff</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.location_icon} alt="" className="h-4 mr-2" />
            <span>{service.service_area}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
