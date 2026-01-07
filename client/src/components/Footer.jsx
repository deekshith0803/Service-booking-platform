import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Footer = () => {

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: "easeInOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.footer
      className="px-6 md:px-16 lg:px-26 xl:px-32 mt-60 text-sm text-gray-500"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b">

        {/* Brand */}
        <motion.div variants={itemVariants}>
          <img src={assets.logo} alt="logo" className="h-8 md:h-9" />
          <p className="max-w-80 mt-3">
            Fixora connects you with trusted professionals for every service you
            need — fast, reliable, and hassle-free.
          </p>

          <div className="flex items-center gap-3 mt-6">
            {[assets.facebook_logo, assets.instagram_logo, assets.twitter_logo, assets.gmail_logo].map(
              (icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ opacity: 0.6, y: -2 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img src={icon} className="w-5 h-5" alt="" />
                </motion.a>
              )
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants}>
          <h2 className="text-base font-medium text-gray-800">Quick Links</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {["Home", "Browse Services", "List Your Service", "About Us"].map(
              (item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ opacity: 0.6, x: 2 }}
                  transition={{ duration: 0.25 }}
                >
                  <a href="#">{item}</a>
                </motion.li>
              )
            )}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={itemVariants}>
          <h2 className="text-base font-medium text-gray-800">Contact</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li>870-990 fixora</li>
            <li>India, Kerala</li>
            <li>+91 87889-8988</li>
            <li>Fixora@gmail.com</li>
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div variants={itemVariants}>
          <h2 className="text-base font-medium text-gray-800">Resources</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {["Help", "Terms of Service", "Privacy Policy", "Insurance"].map(
              (item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ opacity: 0.6, x: 2 }}
                  transition={{ duration: 0.25 }}
                >
                  <a href="#">{item}</a>
                </motion.li>
              )
            )}
          </ul>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col md:flex-row items-center justify-between py-5"
        >
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Brand. All rights reserved.
          </p>

          <ul className="flex items-center gap-4 md:ml-auto">
            {["Privacy", "Terms", "Cookies"].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                <a href="#">{item}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
