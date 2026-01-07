import React from "react";
import { motion } from "framer-motion";

const Newsletter = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h1
        className="md:text-4xl text-2xl font-semibold"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        Never Miss a Deal!
      </motion.h1>

      <motion.p
        className="md:text-lg text-gray-500/70 pb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </motion.p>

      <motion.form
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none
            w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Enter your email id"
          required
        />

        <motion.button
          type="submit"
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="md:px-12 px-8 h-full text-white bg-primary
            hover:bg-primary-dull cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Newsletter;
