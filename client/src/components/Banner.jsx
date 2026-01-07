import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-start items-center justify-between
        px-8 min-md:pl-14 pt-10
        bg-gradient-to-r from-[#0558fe] to-[#a9cfff]
        max-w-6xl mx-3 md:mx-auto rounded-3xl overflow-hidden"
    >
      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="text-white"
      >
        <h2 className="text-3xl font-medium">
          Do You Provide a Professional Service?
        </h2>

        <p className="mt-2">
          Monetize your skills effortlessly by offering your service on
          [Fixora].
        </p>

        <p className="max-w-150">
          We handle customer booking, communication, and payments — so you can
          grow your business without the hassle.
        </p>

        <motion.button
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="px-6 py-3 bg-white text-primary rounded-lg
            mt-4 text-sm cursor-pointer"
        >
          List your service
        </motion.button>
      </motion.div>

      {/* Image */}
      <motion.img
        src={assets.banner_service_image}
        alt="service"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        className="max-h-45 mb-5 mt-5 md:mt-0 border-none rounded-lg"
      />
    </motion.div>
  );
};

export default Banner;
