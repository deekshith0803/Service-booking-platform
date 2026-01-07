import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  const backgroundImages = [
    "https://media.istockphoto.com/id/2154752387/photo/real-estate-concept-business-home-insurance-and-real-estate-protection-real-estate-investment.jpg?s=612x612&w=0&k=20&c=r6Tmn31ZHHr-8ZuWfZaYIYdqM9nD4dMc6NfDXxwsZeo=",
    "https://media.istockphoto.com/id/1417833200/photo/happy-professional-cleaners-cleaning-a-bathroom-at-an-apartment.jpg?s=612x612&w=0&k=20&c=98suJNqwaQnlzReilcdcfGDz_G7QNGUmha2Gm-6Yzug=",
    "https://media.istockphoto.com/id/1291079851/photo/home-repairman-working-on-a-furnace.jpg?s=612x612&w=0&k=20&c=HM_1TAZ2zdzlssHUjpZ7TX2_lIP6Vqsedp1I0rOKNbo=",
    "https://media.istockphoto.com/id/2149275716/photo/close-up-air-conditioner-technician-hand-check-fill-refrigerant-liquid-and-maintenance.jpg?s=612x612&w=0&k=20&c=-TLrZuwh0oBtFioNVTavfxB-185XBLFW91usLegKCig=",
    "https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?s=612x612&w=0&k=20&c=4WRY5lTezchQ5aLj9gXj0Gixq7Wq7b0tzvrCTt4jrrI=",
  ];

  const [index, setIndex] = useState(0);

  // Background carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Carousel (fade only) */}
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImages[index]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-black text-white mb-4"
        >
          Your Life, <span>Simplified</span>
        </motion.h1>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white/90 mb-6"
        >
          All Services, One Click.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Book trusted professionals for home services, repairs, and more —
          anytime, anywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate("/services")}
            className="px-10 py-4 rounded-full bg-primary text-white font-bold text-lg"
          >
            Let’s Go
          </button>

          <button className="px-10 py-4 rounded-full border-2 border-white text-white font-bold text-lg bg-transparent">
            Learn More
          </button>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </motion.section>
  );
};

export default Hero;
