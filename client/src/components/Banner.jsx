import React from "react";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558fe] to-[#a9cfff] max-w-6xl mx-3 md:mx-auto rounded-3xl overflow-hidden">
      <div className="text-white">
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
        <button className="px-6 py-3 bg-white hower:bg-slate-100 transition-all text-primary rounded-lg mt-4 text-sm curser-pointer">
          List your service
        </button>
      </div>
      <img
        src={assets.banner_service_image}
        alt="service"
        className="max-h-45 mb-5 mt-5 md:mt-0 border-none rounded-lg"
      />
    </div>
  );
};

export default Banner;
