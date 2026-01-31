import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      image: assets.testimonial_image_1,
      testimonial:
        "Booking a service through Fixora was seamless. The professional arrived on time, did a fantastic job, and the whole process was smooth and stress-free. Highly recommended!",
    },
    {
      name: "Aarav Mehta",
      location: "Mumbai, India",
      image: assets.testimonial_image_2,
      testimonial:
        "Fixora made it so easy to find the right service provider. I booked a home cleaning, and the quality was top-notch. Will definitely use it again!",
    },
    {
      name: "Sophia Nguyen",
      location: "Melbourne, Australia",
      image: assets.testimonial_image_1,
      testimonial:
        "I was amazed at how quick and professional the entire experience was. From booking to completion, Fixora handled everything perfectly!",
    },
  ];

  return (
    <motion.div
      className="py-28 px-6 md:px-16 lg:px-14 xl:px-44"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Title
        title="What our customers say"
        subtitle="Hear how Fixora is making service booking simple, fast, and reliable."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-transparent transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-14 h-14 rounded-full border-2 border-primary/20"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="font-bold text-xl">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm uppercase tracking-wide font-medium">
                  {testimonial.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-6">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <img
                    key={i}
                    src={assets.star_icon}
                    alt="Star"
                    className="w-4 h-4"
                  />
                ))}
            </div>

            <p className="text-gray-600 mt-5 leading-relaxed italic">
              “{testimonial.testimonial}”
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonial;
