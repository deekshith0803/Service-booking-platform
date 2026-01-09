import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Hero from "../components/Hero";
import FeaturedSection from "../components/FeaturedSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";
import Categories from "../components/Categories";

const Home = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email === "deekshithm321@gmail.com") {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </>
  );
};

export default Home;
